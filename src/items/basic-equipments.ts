import { EquipmentItem } from "./item";
import { StatsImpl } from "@/creatures/stats";

export const woodenSword: EquipmentItem = {
  type: "equipment",
  name: "Wooden Sword",
  slot: "weapon",
  isEquipped: false,
  avgValue: 10,
  stats: new StatsImpl({
    strength: 1,
    maxHealth: 0,
    agility: 0,
  })
}
