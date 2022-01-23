import { useMainStore } from "@/store";
import { Tickable } from "@/ticking/async-ticker";
import {hasDestination} from "./autoplay";
import {useTravelStore} from "./travel/travel-store";
import { storeToRefs } from "pinia";

export function makeRest(): Tickable {
  const { player, autoplay } = storeToRefs(useMainStore());
  const travelStore = useTravelStore();
  const { mapStatus, map } = travelStore;
  return {
    tick: () => {
      player.value.currentHealth++;
    },

    isOver: () => player.value.currentHealth >= player.value.stats.maxHealth,

    // AUTOPLAY
    onEnd: () => {
      const autoplayValue = autoplay.value;
      if (!hasDestination(autoplayValue) || mapStatus.type !== "resting") 
        return;
      
      const nextStepToObjective = map.optionsFrom(mapStatus.at).find(opt => opt.to === autoplayValue.to);
      if (nextStepToObjective) {
        travelStore.takeAction({
          type: "depart",
          to: autoplayValue.to,
          through: nextStepToObjective.through,
        })
      }
    }
  }
}
