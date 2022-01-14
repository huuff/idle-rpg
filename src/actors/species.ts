import { Stats } from "@/battle/stats";
import { ActionFactory } from "@/battle/action";
import { BasicAttack } from "@/battle/basic-attack";
import { Actor } from "@/battle/actor";


export interface Species {
  name: string;
  baseStats: Stats;
  levelProgression: Stats;
  naturalActions:  ActionFactory[];
}

export function createActor(species: Species, identifier?: number) {
  return new Actor(
    identifier ? species.name + ` ${identifier}` : species.name,
    species.baseStats,
    species.naturalActions,
    species.levelProgression,
  )
}

export const slime: Species = {
  name: "Slime",
  baseStats: {
    maxHealth: 20,
    strength: 4,
    agility: 2,
    challenge: 20
  },
  levelProgression: {
    maxHealth: 3,
    strength: 1,
    agility: 0,
    challenge: 2
  },
  naturalActions: [ new BasicAttack() ],
}

export const human: Species = {
  name: "Human",
  baseStats: {
    maxHealth: 50,
    strength: 12,
    agility: 8
  },
  levelProgression: {
    maxHealth: 5,
    strength: 2,
    agility: 1
  },
  naturalActions: [ new BasicAttack() ],
};
