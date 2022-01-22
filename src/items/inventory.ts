import { Item } from "./item";

export interface InventoryItem extends Item {
  amount: number;
}

export interface Inventory {
  items: () => InventoryItem[];
  addItems: (itemsToAdd: InventoryItem[]) => void;
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
    if (positionOfItem) {
      result[positionOfItem].amount += item.amount;
    } else {
      result.push(item);
      }
  }

  return result;
}

export function createInventory(initialItems: InventoryItem[] = []): Inventory {
  let items = [...initialItems];


  return {
    items: () => [...items],
    addItems: (itemsToAdd: InventoryItem[]) => {
      items = flattenItems(items.concat(itemsToAdd));
    }
  }
}
