import { Item, isEquipment, EquipmentItem } from "./item";
import {keyBy, cloneDeep, pickBy, Dictionary, isArray } from "lodash";

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
  stuffValue: number;
  removeItem: (itemName: string, amount?: number) => void;
  removeStuff: () => void;
  toggleEquipped: (itemName: string) => void;
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

  // TODO: just `remove`
  public removeItem(itemName: string, amount = 1) {
    const item = this.items[itemName];
    if (!item) {
      throw new Error(`Item ${itemName} not in inventory!`);
    }

    item.amount -= amount;
    if (item.amount == 0) {
      delete this.items[itemName];
    } 
  }

  // TODO stuff stuff somewhere else
  public get stuffValue(): number {
    return Object.entries(this.items)
      .map(([_, item]) => item)
      .filter(i => i.type === "stuff")
      .reduce((acc, item) => acc + (item.amount * item.avgValue), 0)
      ;
  }

  public removeStuff(): void {
    for (const [name, item] of Object.entries(this.items)) {
      if (item.type === "stuff") {
        delete this.items[name];
      }
    }
  }

  // TODO: this in equipment?
  public toggleEquipped(itemName: string): void {
    const equipmentItems = pickBy(this.items, i => isEquipment(i)) as Dictionary<EquipmentItem>;
    const item = equipmentItems[itemName];

    if (!item) {
      throw new Error(`Trying to toggle equipment in non-present item ${itemName}`)
    }

    // Remove previously equipped items for that slot
    Object.entries(pickBy(equipmentItems, i => 
      i.slot === item.slot
      && i.name !== item.name
      && i.isEquipped
    )).forEach((([_, item]) => item.isEquipped = false))

    // Actually toggle it
    item.isEquipped = !item.isEquipped;
  }
}
