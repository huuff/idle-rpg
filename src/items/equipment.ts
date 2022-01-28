import { BattleAction } from "@/battle/battle-action";
import { plus, Stats, zeroStats } from "@/creatures/stats";
import produce from "immer";
import { keyBy, pickBy } from "lodash";
import { Inventory } from "./inventory";
import { EquipmentItem, EquipmentSlot, isEquipment } from "./item";
import { Creature } from "@/creatures/creature";
import statOps from "@/creatures/stats";
import { sum } from "lodash";

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

export function totalLoad(equipment: Equipment): number {
  return sum(Object.values(equipment).map(e => e.weight));
}

export function toggleEquipped(creature: Creature, itemName: string): void | "overload" {
  const result = produce<Inventory | "overload">(creature.inventory, draft => {
    const inventoryDraft = draft as Inventory;
    const item = inventoryDraft[itemName];
    if (!item) {
      throw new Error(`Trying to toggle equipped on ${itemName}, which is not in the inventory`);
    }

    if (!isEquipment(item)) {
      throw new Error(`Trying to toggle equipped on ${itemName}, which is not equipment!`)
    }
    
    if (!item.isEquipped) {
      
      const equipment = from(inventoryDraft);
      const previousItemAtSlot = equipment[item.slot];

      const loadLeft = statOps.maxLoad(creature.stats.strength) 
      - (totalLoad(equipment) - (previousItemAtSlot?.weight ?? 0));
      console.log(`loadLeft: ${loadLeft}`)
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

  if (result === "overload") {
    return result;
  } else {
    creature.inventory = result;
  }
}

export default {
  toggleEquipped,
  from,
  stats,
  battleActions,
  totalLoad,
}
