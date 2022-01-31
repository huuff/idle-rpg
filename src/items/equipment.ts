import { BattleAction } from "@/battle/battle-action";
import { plus, Stats, zeroStats } from "@/creatures/stats";
import produce from "immer";
import { keyBy, pickBy } from "lodash";
import { Inventory } from "./inventory";
import { EquipmentItem, EquipmentSlot, isEquipment } from "./item";
import { Creature } from "@/creatures/creature";
import load from "./load";

export type EquipmentInventory<T> = { [ itemName in keyof T ]: EquipmentItem}

export function equipmentItems(inventory: Inventory): EquipmentInventory<Inventory> {
  return pickBy(inventory, isEquipment) as EquipmentInventory<Inventory>;
}

export function equipped(inventory: Inventory): EquipmentInventory<Inventory> {
  return pickBy(equipmentItems(inventory), i => i.isEquipped) as EquipmentInventory<Inventory>;
}

export type Equipment = {[slotName in EquipmentSlot]: EquipmentItem};

// XXX: Why is the type not inferred? Is it the fault of lodash types? (Dictionary)
export function from(inventory: Inventory): Equipment {
  return keyBy(equipped(inventory), "slot") as Equipment;
}

export function stats(equipment: Equipment): Stats {
  return plus(...Object.values(equipment).map(e => e.stats ?? zeroStats));
}

export function battleActions(equipment: Equipment): BattleAction[] {
  return Object.values(equipment).flatMap(e => e.battleActions ?? []);

}

export function toggleEquipped(creature: Creature, itemName: string): Creature | "overload" {
  return produce<Creature | "overload">(creature, draft => {
    const creatureDraft = draft as Creature;
    const item = creatureDraft.inventory[itemName];
    if (!item) {
      throw new Error(`Trying to toggle equipped on ${itemName}, which is not in the inventory`);
    }

    if (!isEquipment(item)) {
      throw new Error(`Trying to toggle equipped on ${itemName}, which is not equipment!`)
    }
    
    if (!item.isEquipped) {
      
      const equipment = from(creatureDraft.inventory);
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
  });
}

export default {
  toggleEquipped,
  from,
  stats,
  battleActions,
}
