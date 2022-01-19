import { h } from "vue";
import { MapLocation } from "./game-map";
import SettlementView from "@/components/scenes/SettlementView.vue";
import RestingOptions from "@/components/scenes/RestingOptions.vue";

export function makeSettlement(name: string): MapLocation {
  return {
    name,
    mainView() {
      return h(SettlementView, { location: this })
    },
    sideView() {
      return h(RestingOptions, {});
    }
  }
}

export const prontera: MapLocation = makeSettlement("Prontera");
export const aldebaran: MapLocation = makeSettlement("Aldebaran");
