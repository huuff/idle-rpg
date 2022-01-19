import { Creature } from "@/creatures/creature";
import { Tickable } from "@/ticker";

export function makeRest(creature: Creature): Tickable {
  return {
    tick: () => {
      creature.currentHealth++;
    },

    isOver: () => creature.currentHealth >= creature.stats.maxHealth,
  }
}
