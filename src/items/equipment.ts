import { BattleAction } from "@/battle/battle-action";
import { plus, Stats, zeroStats } from "@/creatures/stats";
import { pickBy } from "lodash";
import { Inventory } from "./inventory";
import { EquipmentItem, EquipmentSlot, isEquipment } from "./item";
import { Creature } from "@/creatures/creature";
import { keyBy } from "@/util/util";

import load from "./load";

export type EquipmentInventory<T> = { [ itemName in keyof T ]: EquipmentItem}

export function equipmentItems(inventory: Readonly<Inventory>): EquipmentInventory<Inventory> {
  return pickBy(inventory, isEquipment) as EquipmentInventory<Inventory>; // TODO: My own pickby implementation
}

export function equipped(inventory: Readonly<Inventory>): EquipmentInventory<Inventory> {
  return pickBy(equipmentItems(inventory), i => i.isEquipped) as EquipmentInventory<Inventory>;
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
