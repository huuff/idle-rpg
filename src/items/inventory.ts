import { Item, } from "./item";
import { isArray } from "lodash";
import { produce } from "immer";

export type InventoryItem = {
  amount: number;
} & Item;

export function isInventoryItem(item: Item): item is InventoryItem {
  return "amount" in item;
}

export type Inventory = { [itemName: string]: InventoryItem };

export function singleItem(item: Item): InventoryItem {
  return { ...item, amount: 1 };
}

export function plus(inventory: Inventory, item: Item): Inventory;
export function plus(inventory: Inventory, item: InventoryItem): Inventory;
export function plus(inventory: Inventory, items: InventoryItem[]): Inventory;
export function plus(inventory: Inventory, items: Item | InventoryItem | InventoryItem[]): Inventory {
  const itemsToAdd = isArray(items)
    ? items
    : isInventoryItem(items)
      ? [items]
      : [singleItem(items)]
    ;
  
  return produce(inventory, draft => {
    for (const item of itemsToAdd) {
      if (item.name in draft) {
        draft[item.name].amount += item.amount;
      } else if (item.amount > 0) {
        draft[item.name] = item;
      }
    }
  });
}

export function merge(...inventories: Inventory[]) {
  return inventories.reduce((acc, i) => plus(acc, Object.values(i)), {} as Inventory)
}

export function minus(inventory: Inventory, itemName: string, amount = 1): Inventory {
  if (!inventory[itemName])
    throw new Error(`${itemName} is not in ${JSON.stringify(inventory)}`)

  return produce(inventory, draft => {
    const item = draft[itemName];
    if (amount > item.amount) {
      throw new Error(`Trying to remove ${amount} ${itemName} from an inventory with ${item.amount}`)
    }

    draft[itemName].amount -= amount;
    if (draft[itemName].amount === 0) {
      delete draft[itemName];
    }
  });
}

export default {
  plus,
  merge,
  minus,
  singleItem,
}
