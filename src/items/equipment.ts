import { Stats, zeroStats } from "@/creatures/stats";
import { Inventory } from "./inventory";
import { EquipmentSlot, EquipmentItem, isEquipment } from "./item";

export type Equipment = {
  slots: {[slot in EquipmentSlot]: EquipmentItem};
  totalStats: Stats;
}

export function equipmentFromInventory(inventory: Inventory): Equipment {
  const equipment = Object.values(inventory.items).filter(isEquipment) as EquipmentItem[];
  const weapons = equipment.filter(i => i.slot === "weapon" && i.isEquipped);

  if (weapons.length > 1)
    throw new Error(`Can't have more than one weapon equipped! Currently has: ${JSON.stringify(weapons)}`);

  const weapon = weapons[0];

  return {
    slots: { weapon },
    totalStats: weapon?.stats ?? zeroStats,
  }
}
