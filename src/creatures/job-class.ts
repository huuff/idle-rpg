import { Stats, zeroStats, areZeroStats } from "./stats"
import { EquipmentItem } from "@/items/item";
import { BattleAction } from "@/battle/battle-action";
import { SkillSpec, Skill } from "@/skills/skill";
import { ReadonlyDeep } from "type-fest";

export interface JobClass {
  readonly name: string;
  readonly baseStats: Stats;
  readonly levelProgression: Stats;
  readonly description: string;
  readonly baseEquipment?: EquipmentItem[];
  readonly battleActions?: BattleAction[];
  readonly skills?: SkillSpec<Skill>[];
}

export const noClass: JobClass =  {
  name: "None",
  description: "",
  baseStats: zeroStats,
  levelProgression: zeroStats,
}

export function isNoClass(jobClass: ReadonlyDeep<JobClass>): boolean {
  return jobClass.name === "None"
        && areZeroStats(jobClass.baseStats)
        && areZeroStats(jobClass.levelProgression)
        && jobClass.description === ""
        && !jobClass.battleActions
        ;
}
