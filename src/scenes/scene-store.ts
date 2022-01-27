import { h, VNode } from "vue";
import { useTravelStore } from "@/travel/travel-store";
import { defineStore } from "pinia";
import { Settlement, settlementToScene } from "@/map/settlements";
import { Scene } from "./scene";

type SceneState = {
  internalScene: Scene;
}

const fakeScene: Scene = {
  mainView: () => h("div", {})
}

export const useSceneStore = defineStore("scene", {
  state: () => ({
    internalScene: fakeScene,
  }) as SceneState,
  getters: {
    scene: (state) => {
      const travelStore = useTravelStore(); 
      if (travelStore.mapStatus.type === "resting") {
        return settlementToScene(travelStore.mapStatus.at);
      } else {
        return state.internalScene;
      }
    },
    mainView(_): () => VNode {
      return this.scene.mainView.bind(this.scene);
    },
    secondaryView(_): (() => VNode) | undefined {
      return (this.scene 
              && this.scene.sideView 
              && this.scene.sideView.bind(this.scene));
    }
  },

  actions: {
    setScene(newScene: Scene) {
      this.internalScene = newScene;
    }
  }
});
