import { woodenSword, ironKnife } from "@/items/basic-equipments";
import { JobClass } from "./job-class";
import { StatsImpl } from "./stats";

export const swordsman: JobClass = {
  name: "Swordsman",
  baseStats: new StatsImpl({
    maxHealth: 20,
    strength: 4,
    agility: 1
  }),
  levelProgression: new StatsImpl({
    maxHealth: 5,
    strength: 1,
    agility: 0.2,
  }),
  baseEquipment: [ {...woodenSword, isEquipped: true} ],
};

export const thief: JobClass = {
  name: "Thief",
  baseStats: new StatsImpl({
    maxHealth: 10,
    strength: 2,
    agility: 2,
  }),
  levelProgression: new StatsImpl({
    maxHealth: 2,
    strength: 0.2,
    agility: 0.5,
  }),
  baseEquipment: [ {...ironKnife, isEquipped: true }]
};

export const archer: JobClass = {
  name: "Archer",
  baseStats: new StatsImpl({
    maxHealth: 5,
    strength: 1,
    agility: 2,
  }),
  levelProgression: new StatsImpl({
    maxHealth: 2,
    strength: 0.2,
    agility: 0.2,
  }),
};

export const baseClasses: JobClass[] = [ swordsman, thief, archer ];
