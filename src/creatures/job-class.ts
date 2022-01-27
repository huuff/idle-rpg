import { Stats, zeroStats, areZeroStats } from "./stats"
import { EquipmentItem } from "@/items/item";
import { BattleAction } from "@/battle/battle-action";

export interface JobClass {
  name: string;
  baseStats: Stats;
  levelProgression: Stats;
  baseEquipment?: EquipmentItem[];
  battleActions?: BattleAction[];
}

export const noClass: JobClass =  {
  name: "None",
  baseStats: zeroStats,
  levelProgression: zeroStats,
}

export function isNoClass(jobClass: JobClass): boolean {
  return jobClass.name === "None"
        && areZeroStats(jobClass.baseStats)
        && areZeroStats(jobClass.levelProgression)
        && !jobClass.battleActions
        ;
}
