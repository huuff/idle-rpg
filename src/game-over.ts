import { useMainStore } from "@/store";
import { useTickStore } from "@/ticking/tick-store";
import { storeToRefs } from "pinia";
import { useSceneStore } from "@/scenes/scene-store";
import { useTravelStore } from "@/travel/travel-store";
import { noCreature } from "@/creatures/creature";
import basicSettlements from "@/map/basic-settlements.json";
import { settlementToScene } from "./map/settlements";
import { useSettingsStore } from "./settings-store";

// FUTURE: Choose a random starting location instead of always prontera
export function gameOver(): void {
  const { player } = storeToRefs(useMainStore());
  const { autoplay } = storeToRefs(useSettingsStore());
  const { mapStatus } = storeToRefs(useTravelStore());
  const { prontera } = basicSettlements;
  const sceneStore = useSceneStore();

  player.value = noCreature;
  autoplay.value = "disabled";
  mapStatus.value = {
    type: "resting",
    at: prontera,
  },
  sceneStore.setScene(settlementToScene(prontera));
  useTickStore().stop();

}
