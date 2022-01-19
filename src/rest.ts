import { useMainStore } from "@/store";
import { Tickable } from "@/ticking/async-ticker";

export function makeRest(): Tickable {
  const { player: creature } = useMainStore();
  return {
    tick: () => {
      creature.currentHealth++;
    },

    isOver: () => creature.currentHealth >= creature.stats.maxHealth,
  }
}
