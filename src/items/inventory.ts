import { Item,  } from "./item";
import {keyBy, cloneDeep,  isArray } from "lodash";

export type InventoryItem = {
  amount: number;
} & Item;

export function isInventoryItem(item: Item): item is InventoryItem {
  return "amount" in item;
}

export type ItemBag = { [itemName: string]: InventoryItem };

export function singleInventoryItem(item: Item): InventoryItem {
  return { ...item, amount: 1 };
}

export interface Inventory {
  items: ItemBag;
  add: (item: Item | InventoryItem) => void;
  // STUCK: I genuinely don't know why the fuck I can't
  // add `InventoryItem[]` to the overload so I desperately add
  // an ugly separate `adds` method
  adds: (items: InventoryItem[]) => void;
  merge: (inventory: Inventory) => Inventory;
  asArray: () => InventoryItem[];
  remove: (itemName: string, amount?: number) => void;
}

export class InventoryImpl implements Inventory {
  public items: ItemBag;

  constructor(initialItems?: InventoryItem[]);
  constructor(initialItems?: ItemBag);
  constructor(initialItems?: InventoryItem[] | ItemBag) {
    if (!initialItems) {
      this.items = {};
    } else if (isArray(initialItems)) {
      this.items = keyBy(initialItems.map(cloneDeep), i => i.name);
    } else {
      this.items = cloneDeep(initialItems);
    }
  }

  public adds(items: InventoryItem[]): void {
    for (const item of items) {
      if (this.items[item.name])
        this.items[item.name].amount += item.amount;
      else
        this.items[item.name] = cloneDeep(item);
    } 
  }

  public add(item: Item): void;
  public add(item: InventoryItem): void;
  public add(item: Item | InventoryItem): void {
    this.adds(isInventoryItem(item)
            ? [item]
            : [singleInventoryItem(item)])
  }

  public merge(other: Inventory): Inventory {
    const result = new InventoryImpl(this.items);
    for (const item of Object.values(other.items)) {
      result.add(item);
    }
    return result;
  }

  public asArray(): InventoryItem[] {
    return Object.values(this.items);
  }

  public remove(itemName: string, amount = 1) {
    const item = this.items[itemName];
    if (!item) {
      throw new Error(`Item ${itemName} not in inventory!`);
    }

    item.amount -= amount;
    if (item.amount == 0) {
      delete this.items[itemName];
    } 
  }
}
