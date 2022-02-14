import { Stats } from "@/creatures/stats";
import { BattleAction } from "@/battle/battle-action";
import { ReadonlyDeep } from "type-fest";

export type BaseItem = {
  readonly name: string;
  readonly avgValue: number;
  readonly rarity: number;
  readonly weight: number;
}

export type StuffItem = {
  readonly type: "stuff";
} & BaseItem;


export type EquipmentSlot = "weapon" | "head" | "hands" | "body";
export function isEquipmentSlot(slot: string): slot is EquipmentSlot {
  return [ "weapon", "head", "hands", "body" ].includes(slot);
}

export type EquipmentItem = {
  readonly type: "equipment";
  readonly slot: EquipmentSlot;
  readonly stats?: Stats;
  readonly battleActions?: readonly BattleAction[],
  isEquipped?: boolean;
} & BaseItem;

export type Item = StuffItem | EquipmentItem;

export function isEquipment(item: ReadonlyDeep<Item>): item is EquipmentItem {
  return item.type === "equipment";
}

