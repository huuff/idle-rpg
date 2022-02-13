import { BattleAction } from "@/battle/battle-action";
import { plus, Stats, zeroStats } from "@/creatures/stats";
import { Inventory } from "./inventory";
import { EquipmentItem, EquipmentSlot, isEquipment, Item } from "./item";
import { pickBy } from "lodash";
import { Creature } from "@/creatures/creature";
import { keyBy } from "@/util/util";
import { ReadonlyDeep } from "type-fest";
import load from "./load";

export type EquipmentInventory<T> = { [ itemName in keyof T ]: EquipmentItem}

// TODO: Do with `equipped` as i did with equipmentItems (that is, write my own implementation
// that gives the correct type instead of a `Dictionary`). Maybe some day I manage to get
// a generic `pickBy` implementation that does it for any type, but I'm hopeless about it
// right now

export function equipmentItems(inventory: Inventory): EquipmentInventory<typeof inventory> {
  return Object.entries(inventory)
    .map<[string, Item]>(item => item)
    .filter((tuple): tuple is [string, EquipmentItem] => isEquipment(tuple[1]))
    .reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {} as EquipmentInventory<typeof inventory>) ;
}

export function equipped(inventory: Readonly<Inventory>): EquipmentInventory<Inventory> {
  return pickBy(equipmentItems(inventory), i => i.isEquipped) as EquipmentInventory<Inventory>;
}

export type Equipment = {[slotName in EquipmentSlot]: EquipmentItem};

export function from(inventory: Readonly<Inventory>): Equipment {
  return keyBy(Object.values(equipped(inventory)), "slot");
}

export function stats(equipment: ReadonlyDeep<Equipment>): Stats {
  return plus(...Object.values(equipment).map(e => e.stats ?? zeroStats));
}

export function battleActions(equipment: ReadonlyDeep<Equipment>): BattleAction[] {
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
