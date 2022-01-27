import { h } from "vue";
import { MapLocation } from "./game-map";
import SettlementView from "@/components/scenes/SettlementView.vue";
import RestingOptions from "@/components/scenes/RestingOptions.vue";
import { Scene } from "@/scenes/scene";
import { ShopSpecification } from "@/locations/shop";

export interface Settlement extends MapLocation {
  readonly shop: ShopSpecification,
}

export function makeSettlement(name: string, shop: ShopSpecification): Settlement {
  return {
    name,
    shop,
  }
}

// TODO: In `scene`
export function settlementToScene(settlement: Settlement): Scene {
  return {
    mainView: () => h(SettlementView, { location: settlement }),
    sideView: () => h(RestingOptions, {}),
  }
}