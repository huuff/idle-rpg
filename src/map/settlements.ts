import { h } from "vue";
import { MapLocation } from "./game-map";
import SettlementView from "@/components/scenes/SettlementView.vue";
import RestingOptions from "@/components/scenes/RestingOptions.vue";
import { Scene } from "@/scenes/scene";
import { ShopSpecification } from "@/locations/shop";

export interface Settlement extends MapLocation {
  readonly shop: ShopSpecification,
}

export function settlementToScene(settlement: Readonly<Settlement>): Scene {
  return {
    mainView: () => h(SettlementView, { location: settlement }),
    sideView: () => h(RestingOptions, {}),
  }
}