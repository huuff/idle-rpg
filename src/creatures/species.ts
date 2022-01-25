import { areZeroStats, Stats, zeroStats } from "@/creatures/stats";
import { ActionFactory } from "@/battle/action";
import { InventoryItem } from "@/items/inventory";

export interface Species {
  readonly name: string;
  readonly baseStats: Stats;
  readonly levelProgression: Stats;
  readonly naturalActions:  ActionFactory[];
  readonly naturalItems?: InventoryItem[];
}

// Null object
export const noSpecies: Species = {
  name: "None",
  baseStats: zeroStats,
  levelProgression: zeroStats,
  naturalActions: [],
}

export function isNoSpecies(species: Species) {
  return species.name === "None"
    && areZeroStats(species.baseStats)
    && areZeroStats(species.levelProgression)
    && species.naturalActions.length === 0
    ;
}
