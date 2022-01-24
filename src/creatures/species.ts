import { areZeroStats, Stats, StatsImpl, zeroStats } from "@/creatures/stats";
import { ActionFactory } from "@/battle/action";
import { BasicAttack } from "@/battle/basic-attack";
import { InventoryItem } from "@/items/inventory";
import { basicItems } from "@/items/basic-items";

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

export const slime: Species = {
  name: "Slime",
  baseStats: new StatsImpl({
    maxHealth: 20,
    strength: 4,
    agility: 2,
  }),
  levelProgression: new StatsImpl({
    maxHealth: 5,
    strength: 0.5,
    agility: 0.2,
  }),
  naturalActions: [ new BasicAttack() ],
  naturalItems: [ { ...basicItems.slimeJelly, amount: 1 } ],
}

export const human: Species = {
  name: "Human",
  baseStats: new StatsImpl({
    maxHealth: 50,
    strength: 12,
    agility: 8,
  }),
  levelProgression: new StatsImpl({
    maxHealth: 5,
    strength: 2,
    agility: 1
  }),
  naturalActions: [ new BasicAttack() ],
};
