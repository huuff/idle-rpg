import { reactive } from "vue";
import { Stats } from "@/creatures/stats";
import { ActionFactory } from "@/battle/action";
import { BasicAttack } from "@/battle/basic-attack";
import { Creature } from "@/creatures/creature";

export interface Species {
  name: string;
  baseStats: Stats;
  levelProgression: Stats;
  naturalActions:  ActionFactory[];
}

export function createCreature(species: Species, identifier?: number, level = 1): Creature {
  return reactive(new Creature(
    identifier ? species.name + ` ${identifier}` : species.name,
    species.baseStats,
    species.naturalActions,
    level,
    species.levelProgression,
  )) as Creature;
}

export const slime: Species = {
  name: "Slime",
  baseStats: new Stats({
    maxHealth: 20,
    strength: 4,
    agility: 2,
  }),
  levelProgression: new Stats({
    maxHealth: 5,
    strength: 0.5,
    agility: 0.2,
  }),
  naturalActions: [ new BasicAttack() ],
}

export const human: Species = {
  name: "Human",
  baseStats: new Stats({
    maxHealth: 50,
    strength: 12,
    agility: 8
  }),
  levelProgression: new Stats({
    maxHealth: 5,
    strength: 2,
    agility: 1
  }),
  naturalActions: [ new BasicAttack() ],
};
