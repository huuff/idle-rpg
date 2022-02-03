import Inventories, { 
  Inventory,
} from "@/items/inventory";
import { basicEquipments } from "@/items/basic-equipments";
import {chooseRandom} from "@/util/random";

export interface Shop {
  inventory: Inventory; 
}

export interface ShopSpecification {
  readonly budget: number;
  readonly rarity: number;
}

function createShopInventory({ budget, rarity}: Readonly<ShopSpecification>): Inventory {
  let budgetLeft = budget;
  const possibleItems = Object.values(basicEquipments).filter(i => i.rarity >= rarity);
  
  const availableItems: Inventory = {};
  while (budgetLeft > 0) {
    const choosenItem = chooseRandom(possibleItems);
    Inventories.add(availableItems, choosenItem);
    budgetLeft -= choosenItem.avgValue;
  }
  return availableItems;
}

export function createShop({ budget, rarity }: Readonly<ShopSpecification>) {
  return {
    inventory: createShopInventory({budget, rarity})
  }
}

export const emptyShop: Shop = {
  inventory: {}
};

export function sellItem(shop: Shop, itemName: string) {
  Inventories.remove(shop.inventory, itemName);
}
