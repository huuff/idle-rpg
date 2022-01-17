import { reactive, VNode, h } from "vue";
import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";
import { human } from "@/creatures/species";
import {createCreature} from "@/creatures/species";
import { SceneLog } from "@/scenes/scene-log";
import {aldebaran, prontera} from "@/map/settlements";
import { MapStatus, } from "@/map/map-status";
import {GameMap} from "./map/game-map";
import {createPlains} from "./zones/zone";
import {Scene} from "@/scenes/scene";
import { Battle } from "@/battle/battle"
import { BattleScene } from "@/scenes/battle-scene";
import { Autoplay } from "@/autoplay";

export type StoreState = {
  player: Creature;
  log: SceneLog;
  mapStatus: MapStatus;
  map: GameMap;
  autoplay: Autoplay;
  battle: Battle | undefined;
  tickDuration: number;
}

export const useMainStore = defineStore("main", {
  state: () => ({
      player: createCreature(human),
      log: reactive(new SceneLog()) as SceneLog,
      mapStatus: { 
        type: "resting",
        in: prontera,
      },
      map: new GameMap(
        [ prontera, aldebaran ],
        [ 
          { locations: [ prontera, aldebaran ], through: createPlains }
        ]
      ),
      battle: undefined,
      autoplay: "disabled",
      tickDuration: 250,
    }) as StoreState,
  getters: {
    scene: (state) => {
      if (state.battle) {
        return new BattleScene(state.battle as Battle); // TODO
      } else if (state.mapStatus.type === "resting") {
        return (state.mapStatus.in as unknown) as Scene; // big TODO
      }
    },
    sceneMainView(_): () => VNode { // TODO
      return (this.scene && this.scene.mainView.bind(this.scene)) ?? (() => h("p", {}, "nothing"));
    },
    sceneSecondaryView(_): () => VNode { // TODO
      return (this.scene 
              && this.scene.sideView 
              && this.scene.sideView.bind(this.scene))
             ?? (() => h("p", {}, "nothing"));
    },
  },
});
