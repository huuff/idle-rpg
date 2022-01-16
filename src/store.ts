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

type StoreState = {
  player: Creature;
  log: SceneLog;
  mapStatus: MapStatus;
  map: GameMap;
  autoplay: boolean;
}

export const useMainStore = defineStore("main", {
  state(): StoreState {
    return {
      player: createCreature(human),
      log: reactive(new SceneLog()),
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
      autoplay: false,
    } as StoreState;
  }
});
