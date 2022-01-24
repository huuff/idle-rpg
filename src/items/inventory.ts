import { Item, isEquipment, EquipmentItem } from "./item";
import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";

export type InventoryItem = {
  amount: number;
} & Item;

export function singleInventoryItem(item: Item): InventoryItem {
  return { ...item, amount: 1 };
}


export function flattenItems(items: InventoryItem[]): InventoryItem[] {
  const result: InventoryItem[] = [];

  for (const item of items) {
    const previousItem = result.find(i => i.name === item.name);
    if (previousItem != undefined) {
      previousItem.amount += item.amount;
    } else {
      result.push(item);
    }
  }

  return result;
}

export interface Inventory {
  items: ReadonlyArray<InventoryItem>;
  addItems: (items: InventoryItem[]) => void;
  addItem: (item: Item) => void;
  stuffValue: number;
  removeItem: (itemName: string, amount?: number) => void;
  removeStuff: () => void;
  toggleEquipped: (itemName: string) => void;
}

export class InventoryImpl {
  // TODO: Actually I could hold items by name in an object
  // instead of an array... it'd be much easier to work
  // with that
  private _items: InventoryItem[];

  constructor(initialItems?: InventoryItem[]) {
    this._items = initialItems ? cloneDeep(initialItems) : [];
  }

  public get items(): ReadonlyArray<InventoryItem> {
    return this._items;
  }

  public get stuffValue(): number {
    return this._items
      .filter(i => i.type === "stuff")
      .reduce((acc, item) => acc + (item.amount * item.avgValue), 0);
  }

  public addItems(items: InventoryItem[]): void {
    this._items = flattenItems(this._items.concat(items));
  }

  public addItem(item: Item): void {
    this.addItems([singleInventoryItem(item)]);
  }

  public removeItem(itemName: string, amount = 1) {
    const item = this._items.find(i => i.name === itemName);

    if (!item) {
      throw new Error(`Item ${itemName} not in inventory!`);
    }

    item.amount -= amount;
    if (item.amount == 0) {
      remove(this._items, i => i.name === item.name);
    } 
  }

  public removeStuff(): void {
    this._items = this._items.filter(i => i.type !== "stuff");
  }

  public toggleEquipped(itemName: string): void {
    const equipmentItems = this._items.filter(isEquipment) as EquipmentItem[];
    const item = equipmentItems.find(i => i.name === itemName);

    if (!item) {
      throw new Error(`Trying to toggle equipment in non-present item ${itemName}`)
    }

    // Remove previously equipped items for that slot
    equipmentItems
      .filter(i => i.slot === item.slot)
      .filter(i => i.name !== item.name)
      .filter(i => i.isEquipped)
      .forEach(i => i.isEquipped = false)
      ;

    // Actually toggle it
    item.isEquipped = !item.isEquipped;
  }
}
