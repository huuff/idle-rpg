import inventory, { 
  Inventory,
} from "@/items/inventory";
import { basicEquipments } from "@/items/basic-equipments";
import {chooseRandom} from "@/util/random";

export interface Shop {
  inventory: Inventory; 
}

export interface ShopSpecification {
  budget: number;
  rarity: number;
}

function createShopInventory({ budget, rarity}: ShopSpecification): Inventory {
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

export function createShop({ budget, rarity }: ShopSpecification) {
  return {
    inventory: createShopInventory({budget, rarity})
  }
}

export const emptyShop: Shop = {
  inventory: {}
};

export function sellItem(shop: Shop, itemName: string) {
  shop.inventory = inventory.minus(shop.inventory, itemName);
}
