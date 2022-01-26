import { plus, Stats } from "@/creatures/stats";
import { cloneDeep, keyBy, pickBy } from "lodash";
import { Inventory } from "./inventory";
import { EquipmentItem, EquipmentSlot, isEquipment } from "./item";

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
  return plus(...Object.values(equipment).map(e => e.stats));
}

export function toggleEquipped(inventory: Inventory, itemName: string): Inventory {
  const item = equipmentItems(inventory)[itemName]
  if (!item) {
    throw new Error(`Trying to toggle equipped on ${itemName}, which is not in the inventory`);
  }

  const nextInventory = cloneDeep(inventory);

  // Unequip previous items at same slot
  Object.values(nextInventory).forEach(i => {
    if (isEquipment(i) && i.slot === item.slot)
      i.isEquipped = false;
  });
  
  // Actually toggle it
  (nextInventory[item.name] as EquipmentItem).isEquipped = !item.isEquipped;
  return nextInventory;
}

export default {
  toggleEquipped,
  from,
  stats,
}
