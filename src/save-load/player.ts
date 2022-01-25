import { ItemBag } from "@/items/inventory";
import { Creature } from "@/creatures/creature";
import {Species} from "@/creatures/species";
import {JobClass} from "@/creatures/job-class";

export type SavedPlayer = {
  name: string;
  species: Species,
  jobClass: JobClass,
  inventory: ItemBag;
  level: number;
  currentExp: number;
  currentHealth: number;
}

export function playerToSavedPlayer(creature: Creature): SavedPlayer {
  return {
    name: creature.name,
    species: creature.species,
    jobClass: creature.jobClass,
    inventory: creature.inventory.items,
    currentExp: creature.currentExp,
    currentHealth: creature.currentHealth,
    level: creature.level,
  }
}

