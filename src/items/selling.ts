import inventoryOps, { InventoryItem, Inventory } from "./inventory";

export function findSellable(inventory: Inventory): InventoryItem[] {
  return Object.values(inventory).filter(i => i.type === "stuff");
}

export function sellableValue(inventory: Inventory): number {
  return findSellable(inventory).reduce((acc, i) => acc + (i.avgValue * i.amount), 0);
}

export function withoutSellable(inventory: Inventory): Inventory {
  let result = inventory;
  for (const sellable of findSellable(inventory)) {
    result = inventoryOps.minus(inventory, sellable.name, sellable.amount);
  }

  return result;
}
