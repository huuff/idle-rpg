import { h } from "vue";
import { MapLocation } from "./game-map";
import SettlementView from "@/components/scenes/SettlementView.vue";
import RestingOptions from "@/components/scenes/RestingOptions.vue";
import { Shop, createShopFactory } from "@/locations/shop";

export interface Settlement extends MapLocation {
  readonly createShop: () => Shop;
}

export function makeSettlement(name: string, shopFactory: () => Shop): Settlement {
  return {
    name,
    mainView() {
      return h(SettlementView, { location: this })
    },
    sideView() {
      return h(RestingOptions, {});
    },
    createShop: shopFactory,
  }
}

export const prontera: MapLocation = makeSettlement("Prontera", createShopFactory(500, 1) );
export const aldebaran: MapLocation = makeSettlement("Aldebaran", createShopFactory(1000, 2));
