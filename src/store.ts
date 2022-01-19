import { reactive, VNode, h } from "vue";
import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";
import { human } from "@/creatures/species";
import {createCreature} from "@/creatures/species";
import { SceneLog } from "@/scenes/scene-log";
import { Battle } from "@/battle/battle"
import { BattleScene } from "@/scenes/battle-scene";
import { Autoplay } from "@/autoplay";
import { useTravelStore } from "@/travel-store";

export type StoreState = {
  player: Creature;
  log: SceneLog;
  autoplay: Autoplay;
  battle: Battle | undefined;
  tickDuration: number;
}

export const useMainStore = defineStore("main", {
  state: () => ({
      player: createCreature(human),
      log: reactive(new SceneLog()) as SceneLog,
      battle: undefined, // TODO: Should battle be in the store?
      autoplay: "disabled",
      tickDuration: 250,
    }) as StoreState,
  getters: {
    scene: (state) => {
      const travelStore = useTravelStore();
      if (state.battle) {
        return new BattleScene(state.battle as Battle); // TODO
      } else if (travelStore.mapStatus.type === "resting") {
        return travelStore.mapStatus.in;
      }
    },
    sceneMainView(_): () => VNode { // TODO
      return (this.scene && this.scene.mainView.bind(this.scene)) ?? (() => h("p", {}, "nothing"));
    },
    sceneSecondaryView(_): (() => VNode) | undefined { 
      return (this.scene 
              && this.scene.sideView 
              && this.scene.sideView.bind(this.scene));
    },
  },
});
