import { basicEquipments } from "@/items/basic-equipments";
import { JobClass } from "./job-class";

const { woodenSword, ironKnife } = basicEquipments;

const swordsman: JobClass = {
  name: "Swordsman",
  description: "All-around powerful and resilient.",
  baseStats: {
    maxHealth: 20,
    strength: 4,
    agility: 1
  },
  levelProgression: {
    maxHealth: 5,
    strength: 1,
    agility: 0.2,
  },
  baseEquipment: [ {...woodenSword, isEquipped: true} ],
  skills: [
    {
      type: "armor-mastery",
      name: "Armor Mastery",
      levelProgression: 0.25,
    }
  ]
};

const thief: JobClass = {
  name: "Thief",
  description: "Not powerful nor resilient, but has many tricks.",
  baseStats: {
    maxHealth: 10,
    strength: 2,
    agility: 2,
  },
  levelProgression: {
    maxHealth: 2,
    strength: 0.2,
    agility: 0.5,
  },
  baseEquipment: [ {...ironKnife, isEquipped: true }],
  battleActions: [ 
    { type: "steal", dexterity: 1 },
    { type: "escape" },
  ]
};

const archer: JobClass = {
  name: "Archer",
  description: "TODO",
  baseStats: {
    maxHealth: 5,
    strength: 1,
    agility: 2,
  },
  levelProgression: {
    maxHealth: 2,
    strength: 0.2,
    agility: 0.2,
  },
};

export const baseClasses: { [className: string]: JobClass} = {
  "Swordsman": swordsman,
  "Thief": thief,
  "Archer": archer,
}
