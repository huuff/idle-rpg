import { useMainStore } from "@/store";
import { useTickStore } from "@/ticking/tick-store";
import { storeToRefs } from "pinia";
import { useSceneStore } from "@/scenes/scene-store";
import { useTravelStore } from "@/travel/travel-store";
import { noCreature } from "@/creatures/creature";
import { prontera } from "@/map/settlements";

// FUTURE: Choose a random starting location instead of always prontera
export function gameOver(): void {
  const { autoplay, player } = storeToRefs(useMainStore());
  const { mapStatus } = storeToRefs(useTravelStore());
  const sceneStore = useSceneStore();

  player.value = noCreature;
  autoplay.value = "disabled";
  mapStatus.value = {
    type: "resting",
    at: prontera,
  },
  sceneStore.setScene(prontera);
  useTickStore().stop();

}
