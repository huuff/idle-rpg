import { Stats } from "@/creatures/stats";

export type BaseItem = {
  name: string;
  avgValue: number
}

export type StuffItem = {
  type: "stuff";
} & BaseItem;


export type EquipmentSlot = "weapon";
export type EquipmentItem = {
  type: "equipment";
  slot: EquipmentSlot;
  stats: Stats;
  isEquipped: boolean;
} & BaseItem;

export type Item = StuffItem | EquipmentItem;

export function isEquipment(item: Item): item is EquipmentItem {
  return item.type === "equipment";
}
