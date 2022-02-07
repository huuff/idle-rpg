import { BattleAction } from "@/battle/battle-action";
import { plus, Stats, zeroStats } from "@/creatures/stats";
import { Inventory } from "./inventory";
import { EquipmentItem, EquipmentSlot, isEquipment, Item } from "./item";
import { Creature } from "@/creatures/creature";
import { keyBy } from "@/util/util";

import load from "./load";

export type EquipmentInventory<T> = { [ itemName in keyof T ]: EquipmentItem}

// FUTURE: This is just my own `pickBy` implementation that types the result with something other than a `Dictionary`
// However, this is not generic. See if I am able to do it generically in the future.
export function equipmentItems(inventory: Readonly<Inventory>): EquipmentInventory<typeof inventory> {
  return Object.entries(inventory)
    .map<[string, Item]>(item => item)
    .filter((tuple): tuple is [string, EquipmentItem] => isEquipment(tuple[1]))
    .reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {} as EquipmentInventory<typeof inventory>);
}

export function equipped(inventory: Readonly<Inventory>): EquipmentInventory<typeof inventory> {
  return Object.entries(equipmentItems(inventory))
      .filter(([_, item]) => item.isEquipped)
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {} as EquipmentInventory<typeof inventory>);
}

export type Equipment = {[slotName in EquipmentSlot]: EquipmentItem};

export function from(inventory: Readonly<Inventory>): Equipment {
  return keyBy(Object.values(equipped(inventory)), "slot");
}

export function stats(equipment: Readonly<Equipment>): Stats {
  return plus(...Object.values(equipment).map(e => e.stats ?? zeroStats));
}

export function battleActions(equipment: Readonly<Equipment>): BattleAction[] {
  return Object.values(equipment).flatMap(e => e.battleActions ?? []);

}

export function toggleEquipped(creature: Creature, itemName: string): void | "overload" {
    const item = creature.inventory[itemName];
    if (!item) {
      throw new Error(`Trying to toggle equipped on ${itemName}, which is not in the inventory`);
    }

    if (!isEquipment(item)) {
      throw new Error(`Trying to toggle equipped on ${itemName}, which is not equipment!`)
    }
    
    if (!item.isEquipped) {
      
      const equipment = from(creature.inventory);
      const previousItemAtSlot = equipment[item.slot];

      const loadLeft = load.creatureCapacity(creature) 
      - (load.total(equipment) - (previousItemAtSlot?.weight ?? 0));
      if (loadLeft >= item.weight) {
        // Unequip previous item at same slot
        if (previousItemAtSlot) {
          previousItemAtSlot.isEquipped = false;
        }
        // And equip it
        item.isEquipped = true;
      } else {
        // Not enough capacity, deny it
        return "overload";
      }
    } else {
      item.isEquipped = false;
    }
}

export default {
  toggleEquipped,
  from,
  stats,
  battleActions,
}
