import { reactive } from "vue";
import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";
import { human } from "@/creatures/species";
import {createCreature} from "@/creatures/species";
import { SceneLog } from "@/scene-log";
import {aldebaran, prontera} from "@/map/settlements";
import { MapStatus, } from "@/map/map-status";
import {GameMap} from "./map/game-map";
import {createPlains} from "./zones/zone";
import { Rest } from "@/rest-scene";
import {Scene} from "./scene";
import {sceneFromMapStatus} from "./scenes/scene-from-map-status";

export type StoreState = {
  player: Creature;
  log: SceneLog;
  mapStatus: MapStatus;
  map: GameMap;
  scene: Scene;
  autoplay: boolean;
  tickDuration: number;
}

export const useMainStore = defineStore("main", {
  state(): StoreState {
    return {
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
      scene: new Rest(prontera),
      autoplay: false,
      tickDuration: 250,
    } as StoreState;
  }, 
  actions: {
    setMapStatus(newStatus: MapStatus) {
      this.mapStatus = newStatus;
      this.scene = sceneFromMapStatus(newStatus);
    }
  }
});
