import { VNode, h } from "vue";
import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";
import { human } from "@/creatures/species";
import { createCreature } from "@/creatures/species";
import { Log, makeLog } from "@/log";
import { Battle } from "@/battle/battle"
import { makeBattleScene } from "@/scenes/battle-scene";
import { Autoplay } from "@/autoplay";
import { useTravelStore } from "@/travel/travel-store";

export type StoreState = {
  player: Creature;
  log: Log;
  autoplay: Autoplay;
  battle: Battle | undefined;
}

export const useMainStore = defineStore("main", {
  state: () => ({
      player: createCreature(human),
      log: makeLog(),
      battle: undefined, // TODO: Should battle be in the store?
      autoplay: "disabled",
    }) as StoreState,
  getters: {
    scene: (state) => {
      const travelStore = useTravelStore();
      if (state.battle) {
        return makeBattleScene(state.battle.badGuys);
      } else if (travelStore.mapStatus.type === "resting") {
        return travelStore.mapStatus.at;
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
