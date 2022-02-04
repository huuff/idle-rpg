import { basicEquipments } from "@/items/basic-equipments";
import { JobClass } from "./job-class";
import { keyBy } from "@/util/util";

const { woodenSword, ironKnife, woodenBow } = basicEquipments;

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
  skills: [
    {
      type: "steal",
      name: "Steal",
      action: true,
      levelProgression: 0.5,
    }, 
    {
      type: "escape",
      name: "Escape",
      action: true,
      levelProgression: 0.20,
    }
  ]
};

const archer: JobClass = {
  name: "Archer",
  description: "They excel at the rearguard, but are vulnerable in the front. You might consider hiring a bodyguard to keep you safe",
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
  baseEquipment: [
    { ...woodenBow, isEquipped: true },
  ],
  skills: [
    {
      name: "Initiative",
      type: "initiative",
      levelProgression: "MAX",
    }
  ]
};

export const baseClasses: { [className: string]: JobClass} = keyBy([swordsman, thief, archer], "name");
