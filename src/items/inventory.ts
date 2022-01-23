import { Item } from "./item";
import cloneDeep from "lodash/cloneDeep";

export interface InventoryItem extends Item {
  amount: number;
}

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
  items: Readonly<InventoryItem[]>;
  addItems: (items: InventoryItem[]) => void;
}

export class InventoryImpl {
  private _items: InventoryItem[];

  constructor(initialItems?: InventoryItem[]) {
    this._items = initialItems ? cloneDeep(initialItems) : [];
  }

  public get items(): Readonly<InventoryItem[]> {
    return this._items;
  }

  public addItems(items: InventoryItem[]) {
    this._items = flattenItems(this._items.concat(items));
  }
}
