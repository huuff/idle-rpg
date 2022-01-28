import { Stats, zeroStats, areZeroStats } from "./stats"
import { EquipmentItem } from "@/items/item";
import { BattleAction } from "@/battle/battle-action";
import { Skill, SkillSpec } from "@/skills/skill";

export interface JobClass {
  name: string;
  baseStats: Stats;
  levelProgression: Stats;
  description: string;
  baseEquipment?: EquipmentItem[];
  battleActions?: BattleAction[];
  skills?: SkillSpec[];
}

export const noClass: JobClass =  {
  name: "None",
  description: "",
  baseStats: zeroStats,
  levelProgression: zeroStats,
}

export function isNoClass(jobClass: JobClass): boolean {
  return jobClass.name === "None"
        && areZeroStats(jobClass.baseStats)
        && areZeroStats(jobClass.levelProgression)
        && jobClass.description === ""
        && !jobClass.battleActions
        ;
}
