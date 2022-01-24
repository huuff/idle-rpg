import { 
  Inventory,
  InventoryImpl,
  singleInventoryItem
} from "@/items/inventory";
import { basicEquipments } from "@/items/basic-equipments";
import {chooseRandom} from "@/util/random";

export interface Shop {
  inventory: Inventory; 
}

function createShopInventory(budget: number, rarity: number): Inventory {
  let budgetLeft = budget;
  const possibleItems = basicEquipments.filter(i => i.rarity <= rarity);
  
  const availableItems = new InventoryImpl();
  while (budgetLeft > 0) {
    const choosenItem = chooseRandom(possibleItems);
    availableItems.addItems([singleInventoryItem(choosenItem)]);
    budgetLeft -= choosenItem.avgValue;
  }
  return availableItems;
}

export function createShopFactory(budget: number, rarity: number) {
  return () => ({
    inventory: createShopInventory(budget, rarity),
  });
}

export const emptyShop: Shop = {
  inventory: new InventoryImpl(),
};
