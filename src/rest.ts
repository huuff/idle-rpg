import { useMainStore } from "@/store";
import { Tickable } from "@/ticking/async-ticker";
import {hasDestination} from "./autoplay";
import {useTravelStore} from "./travel/travel-store";

export function makeRest(): Tickable {
  const { player, autoplay } = useMainStore();
  const travelStore = useTravelStore();
  const { mapStatus, map } = travelStore;
  return {
    tick: () => {
      player.currentHealth++;
    },

    isOver: () => player.currentHealth >= player.stats.maxHealth,

    // AUTOPLAY
    onEnd: () => {
      if (!hasDestination(autoplay) || mapStatus.type !== "resting") 
        return;
      
      const nextStepToObjective = map.optionsFrom(mapStatus.at).find(opt => opt.to === autoplay.to);
      if (nextStepToObjective) {
        travelStore.takeAction({
          type: "depart",
          to: autoplay.to,
          through: nextStepToObjective.through(),
        })
      }
    }
  }
}
