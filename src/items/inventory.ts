import { Item, } from "./item";
import { isArray, cloneDeep } from "lodash";

// TODO: Immer would make everything faster here

export type InventoryItem = {
  amount: number;
} & Item;

export function isInventoryItem(item: Item): item is InventoryItem {
  return "amount" in item;
}

export type Inventory = { [itemName: string]: InventoryItem };

export function singleInventoryItem(item: Item): InventoryItem {
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
      : [singleInventoryItem(items)]
    ;
  
  const result = cloneDeep(inventory);
  for (const item of itemsToAdd) {
    if (item.name in result) {
      result[item.name].amount += item.amount;
    } else {
      result[item.name] = item;
    }
  }
  return result;
}

export function merge(...inventories: Inventory[]) {
  return inventories.reduce((acc, i) => plus(acc, Object.values(i)), {} as Inventory)
}

export function minus(inventory: Inventory, itemName: string, amount = 1): Inventory {
  if (!inventory[itemName])
    throw new Error(`${itemName} is not in ${JSON.stringify(inventory)}`)

  const item = inventory[itemName];
  if (amount > item.amount) {
    throw new Error(`Trying to remove ${amount} ${itemName} from an inventory with ${item.amount}`)
  }

  const result = cloneDeep(inventory);
  result[itemName].amount -= amount;

  if (result[itemName].amount === 0) {
    delete result[itemName];
  }

  return result;
}

export default {
  plus,
  merge,
  minus,
}
