import { VNode, } from "vue";
import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";
import { human } from "@/creatures/species";
import { createCreature } from "@/creatures/species";
import { Log, makeLog } from "@/log";
import { Battle } from "@/battle/battle"
import { Autoplay } from "@/autoplay";
import { Scene } from "@/scenes/scene";

export type StoreState = {
  player: Creature;
  log: Log;
  autoplay: Autoplay;
  battle: Battle | undefined;
  scene: Scene | undefined;
}

export const useMainStore = defineStore("main", {
  state: () => ({
      scene: undefined,
      player: createCreature(human),
      log: makeLog(),
      autoplay: "disabled",
    }) as StoreState,
  getters: {
    sceneMainView(_): () => VNode {
      if (!this.scene) {
        throw new Error("There is no current scene!");
      }

      return this.scene.mainView.bind(this.scene);
    },
    sceneSecondaryView(_): (() => VNode) | undefined { 
      return (this.scene 
              && this.scene.sideView 
              && this.scene.sideView.bind(this.scene));
    },
  },
});
