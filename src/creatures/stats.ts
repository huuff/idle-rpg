import { omit, sum, mapValues } from "lodash";

export type StatType = "maxHealth" | "strength" | "agility";

export type Stats = {
  readonly [type in StatType]?: number;
}

// Null object pattern
export const zeroStats: Stats = {
  maxHealth: 0,
  strength: 0,
  agility: 0,
};

export function areZeroStats(stats: Stats) {
  return stats.maxHealth === 0
        && stats.strength === 0
        && stats.agility === 0
        ;
}

export function calculateChallenge(stats: Stats) {
  const nonHealthStats = omit(stats, "maxHealth");
  const healthChallenge = stats.maxHealth ? stats.maxHealth / 10 : 0;

  return sum(Object.values(nonHealthStats)) + healthChallenge;
}

export function plus(...stats: Stats[]) {
  return {
    maxHealth: sum(stats.map(s => s.maxHealth ?? 0)),
    strength: sum(stats.map(s => s.strength ?? 0)),
    agility: sum(stats.map(s => s.agility ?? 0)),
  }
}

export function times(stats: Stats, factor: number) {
  return {
    maxHealth: (stats.maxHealth ?? 0) * factor,
    strength: (stats.strength ?? 0) * factor,
    agility: (stats.agility ?? 0) * factor,
  }
}

export interface LevelableStats {
  baseStats: Stats,
  levelProgression: Stats,
}

export function calculateByLevel(stats: LevelableStats, level: number) {
  return plus(stats.baseStats, times(stats.levelProgression, level));
}

export function round(stats: Stats): Stats {
  return mapValues(stats, v => Math.round(v ?? 0));
}

export function totalize(stats: Stats): Required<Stats> {
  return {
    maxHealth: stats.maxHealth ?? 0,
    strength: stats.strength ?? 0,
    agility: stats.agility ?? 0,
  }
}

export function carryingCapacity(strength: number): number {
  return strength * 10;
}

export default {
  plus,
  times,
  totalize,
  round,
  calculateByLevel,
  carryingCapacity
}
