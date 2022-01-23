import { EquipmentItem } from "./item";
import { StatsImpl } from "@/creatures/stats";

// TODO: Weapons should not give strength, but attacks!
export const woodenSword: EquipmentItem = {
  type: "equipment",
  name: "Wooden Sword",
  slot: "weapon",
  isEquipped: false,
  avgValue: 100,
  stats: new StatsImpl({ strength: 1 }),
}

export const ironSword: EquipmentItem = {
  type: "equipment",
  name: "Iron Sword",
  slot: "weapon",
  isEquipped: false,
  avgValue: 1000,
  stats: new StatsImpl({ strength: 10, }),
}

export const ironKnife: EquipmentItem = {
  type: "equipment",
  name: "Iron Knife",
  slot: "weapon",
  isEquipped: false,
  avgValue: 10,
  stats: new StatsImpl({ strength: 0.2 }),
}
