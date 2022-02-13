import inventoryOps, { InventoryItem, Inventory } from "./inventory";
import { ReadonlyDeep } from "type-fest";

export function findSellable(inventory: ReadonlyDeep<Inventory>): InventoryItem[] {
  return Object.values(inventory).filter(i => i.type === "stuff");
}

export function sellableValue(inventory: ReadonlyDeep<Inventory>): number {
  return findSellable(inventory).reduce((acc, i) => acc + (i.avgValue * i.amount), 0);
}

export function removeSellable(inventory: Inventory): void {
  for (const sellable of findSellable(inventory)) {
    inventoryOps.remove(inventory, sellable.name, sellable.amount);
  }
}
