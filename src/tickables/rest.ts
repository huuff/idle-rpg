import { useMainStore } from "@/store";
import { Tickable } from "@/ticking/async-ticker";
import {hasDestination} from "@/autoplay";
import {useTravelStore} from "@/travel/travel-store";
import { storeToRefs } from "pinia";
import { optionsFrom } from "@/map/game-map";
import { useSettingsStore } from "@/settings-store";
import Creatures from "@/creatures/creature";

export function makeRest(): Tickable {
  const { player } = storeToRefs(useMainStore());
  const { autoplay } = storeToRefs(useSettingsStore());
  const travelStore = useTravelStore();
  const { mapStatus, map } = travelStore;
  return {
    tick: () => {
      player.value = Creatures.healthDelta(player.value, +1);
    },

    isOver: () => player.value.currentHealth >= Creatures.stats(player.value).maxHealth,

    // AUTOPLAY
    onEnd: () => {
      const autoplayValue = autoplay.value;
      if (!hasDestination(autoplayValue) || mapStatus.type !== "resting") 
        return;
      
      const nextStepToObjective = optionsFrom(map, mapStatus.at).find(opt => opt.to === autoplayValue.to);
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
