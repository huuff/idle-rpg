import { ItemBag } from "@/items/inventory";
import { Creature } from "@/creatures/creature";

export type SavedPlayer = {
  name: string;
  speciesName: string,
  jobClassName: string,
  inventory: ItemBag;
  level: number;
  currentExp: number;
  currentHealth: number;
}

export function playerToSavedPlayer(creature: Creature): SavedPlayer {
  return {
    name: creature.name,
    speciesName: creature.species.name,
    jobClassName: creature.jobClass.name,
    inventory: creature.inventory.items,
    currentExp: creature.currentExp,
    currentHealth: creature.currentHealth,
    level: creature.level,
  }
}

