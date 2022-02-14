import { areZeroStats, Stats, zeroStats } from "@/creatures/stats";
import { BattleAction } from "@/battle/battle-action";
import { InventoryItem } from "@/items/inventory";
import { ReadonlyDeep } from "type-fest";

export interface Species {
  readonly name: string;
  readonly baseStats: Stats;
  readonly levelProgression: Stats;
  readonly naturalActions:  readonly BattleAction[];
  readonly naturalItems?: readonly InventoryItem[];
}

// Null object
export const noSpecies: Species = {
  name: "None",
  baseStats: zeroStats,
  levelProgression: zeroStats,
  naturalActions: [],
}

export function isNoSpecies(species: ReadonlyDeep<Species>) {
  return species.name === "None"
    && areZeroStats(species.baseStats)
    && areZeroStats(species.levelProgression)
    && species.naturalActions.length === 0
    ;
}
