import { areZeroStats, Stats, StatsImpl, zeroStats } from "@/creatures/stats";
import { ActionFactory } from "@/battle/action";
import { BasicAttack } from "@/battle/basic-attack";

export interface Species {
  name: string;
  baseStats: Stats;
  levelProgression: Stats;
  naturalActions:  ActionFactory[];
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
