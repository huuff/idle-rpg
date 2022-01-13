export function addStats(augend1: Stats, augend2: Stats): Stats {
  return {
    maxHealth: augend1.maxHealth + augend2.maxHealth,
    strength: augend1.strength + augend2.strength,
    agility: augend1.agility + augend2.agility,
    challenge: (augend1.challenge ?? 0) + (augend2.challenge ?? 0),
  };
}

export interface Stats {
  maxHealth: number;
  strength: number;
  agility: number;
  challenge?: number;
}

export const zeroStats: Stats = {
  maxHealth: 0,
  strength: 0,
  agility: 0,
  challenge: 0,
};
