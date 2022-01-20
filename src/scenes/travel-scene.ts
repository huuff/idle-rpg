import { h } from "vue";
import { Scene } from "./scene";
import TravelView from "@/components/scenes/TravelView.vue";

export function makeTravelScene(): Scene {
  return {
    mainView: () => h(TravelView, {}),
  }
}
