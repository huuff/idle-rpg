import { Item, } from "./item";
import { isArray, cloneDeep } from "lodash";
import { ReadonlyDeep } from "type-fest";

export type InventoryItem = {
  amount: number;
} & Item;

export function isInventoryItem(item: ReadonlyDeep<Item>): item is InventoryItem {
  return "amount" in item;
}

export type Inventory = { [itemName: string]: InventoryItem };

export function singleItem(item: ReadonlyDeep<Item>): InventoryItem {
  return { ...item, amount: 1 };
}

// TODO: Can I make this readonly in any way?
export function add(inventory: Inventory, item: Item): void;
export function add(inventory: Inventory, item: InventoryItem): void;
export function add(inventory: Inventory, items: InventoryItem[]): void;
export function add(inventory: Inventory, items: Item | InventoryItem | InventoryItem[]): void {
  const itemsToAdd = isArray(items)
    ? items
    : isInventoryItem(items)
      ? [items]
      : [singleItem(items)]
    ;

    for (const item of itemsToAdd) {
      if (item.name in inventory) {
        inventory[item.name].amount += item.amount;
      } else if (item.amount > 0) {
        inventory[item.name] = cloneDeep(item);
      }
    }

}

export function merge(...inventories: readonly ReadonlyDeep<Inventory>[]): Inventory {
  const result: Inventory = {};

  for (const inventory of inventories)
    add(result, Object.values(inventory));

  return result;
}

export function remove(inventory: Inventory, itemName: string, amount = 1): void {
  if (!inventory[itemName])
    throw new Error(`${itemName} is not in ${JSON.stringify(inventory)}`)

    const item = inventory[itemName];
    if (amount > item.amount) {
      throw new Error(`Trying to remove ${amount} ${itemName} from an inventory with ${item.amount}`)
    }

    inventory[itemName].amount -= amount;
    if (inventory[itemName].amount === 0) {
      delete inventory[itemName];
    }
}

export default {
  add,
  merge,
  remove,
  singleItem,
}
