import { VNode, h } from "vue";
import { MapLocation } from "./game-map";
import { Scene } from "@/scenes/scene";
import SettlementView from "@/components/scenes/SettlementView.vue";
import RestingOptions from "@/components/scenes/RestingOptions.vue";

export class Settlement implements MapLocation, Scene {
  constructor(
    public readonly name: string
  ){}
 
  public mainView(): VNode {
    return h(SettlementView, { location: this });
  }

  public sideView(): VNode {
    return h(RestingOptions, {});
  }
}

export const prontera: Settlement = new Settlement("Prontera");
export const aldebaran: Settlement = new Settlement("Aldebaran");
