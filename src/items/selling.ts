import { InventoryItem, Inventory } from "./inventory";

export function findSellable(inventory: Inventory): InventoryItem[] {
  return inventory.asArray().filter(i => i.type === "stuff");
}

export function sellableValue(inventory: Inventory): number {
  return findSellable(inventory).reduce((acc, i) => acc + (i.avgValue * i.amount), 0);
}

export function removeSellable(inventory: Inventory): void {
  for (const sellable of findSellable(inventory)) {
    inventory.removeItem(sellable.name, sellable.amount);
  }
}
