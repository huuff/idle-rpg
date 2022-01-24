import { Item, isEquipment, EquipmentItem } from "./item";
import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";

export type InventoryItem = {
  amount: number;
} & Item;

export function singleInventoryItem(item: Item): InventoryItem {
  return { ...item, amount: 1 };
}

// TODO: Return the actual item? Inside Inventory?
function findItem(items: InventoryItem[], itemName: string): number | undefined {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name === itemName)
      return i;
  }
}

export function flattenItems(items: InventoryItem[]): InventoryItem[] {
  const result: InventoryItem[] = [];

  for (const item of items) {
    const positionOfItem = findItem(result, item.name);
    if (positionOfItem != undefined) {
      result[positionOfItem].amount += item.amount;
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
    const itemIndex = findItem(this._items, itemName);

    if (itemIndex === undefined) {
      throw new Error(`Item ${itemName} not in inventory!`);
    }

    const item = this._items[itemIndex];
    item.amount -= amount;
    
    if (item.amount <= 0) {
      remove(this._items, i => i.name === item.name);
    }
  }

  public removeStuff(): void {
    this._items = this._items.filter(i => i.type !== "stuff");
  }

  public toggleEquipped(itemName: string): void {
    const equipmentItems = this._items.filter(isEquipment) as EquipmentItem[];
    const itemIndex = findItem(equipmentItems as InventoryItem[], itemName)

    if (itemIndex == undefined) {
      throw new Error(`Trying to toggle equipment in non-present item ${itemName}`)
    }

    const item = equipmentItems[itemIndex];
    
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
