import { reactive } from "vue";
import { Stats, StatsImpl } from "@/creatures/stats";
import { ActionFactory } from "@/battle/action";
import { BasicAttack } from "@/battle/basic-attack";
import { Creature } from "@/creatures/creature";
import {JobClass, noClass} from "./job-class";

export interface Species {
  name: string;
  baseStats: Stats;
  levelProgression: Stats;
  naturalActions:  ActionFactory[];
}

// TODO: Ditch this in favor of a better creature initializer
export function createCreature(species: Species, level = 1, jobClass: JobClass = noClass): Creature {
  return reactive(new Creature(
    species.name,
    species.baseStats,
    species.naturalActions,
    level,
    species.levelProgression,
    jobClass, 
  ));
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
