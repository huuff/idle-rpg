import { Stats } from "@/creatures/stats";

export type BaseItem = {
  readonly name: string;
  readonly avgValue: number;
  readonly rarity: number;
}

export type StuffItem = {
  readonly type: "stuff";
} & BaseItem;


export type EquipmentSlot = "weapon";
export function isEquipmentSlot(slot: string): slot is EquipmentSlot {
  return slot === "weapon";
}

export type EquipmentItem = {
  readonly type: "equipment";
  readonly slot: EquipmentSlot;
  readonly stats: Stats;
  isEquipped: boolean;
} & BaseItem;

export type Item = StuffItem | EquipmentItem;

export function isEquipment(item: Item): item is EquipmentItem {
  return item.type === "equipment";
}

