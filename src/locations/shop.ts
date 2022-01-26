import inventory, { 
  Inventory,
} from "@/items/inventory";
import { basicEquipments } from "@/items/basic-equipments";
import {chooseRandom} from "@/util/random";

export interface Shop {
  inventory: Inventory; 
}

function createShopInventory(budget: number, rarity: number): Inventory {
  let budgetLeft = budget;
  const possibleItems = Object.values(basicEquipments).filter(i => i.rarity <= rarity);
  
  let availableItems: Inventory = {};
  while (budgetLeft > 0) {
    const choosenItem = chooseRandom(possibleItems);
    availableItems = inventory.plus(availableItems, choosenItem);
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
  inventory: {}
};

export function sellItem(shop: Shop, itemName: string) {
  shop.inventory = inventory.minus(shop.inventory, itemName);
}
