import { defineStore } from "pinia";
import { prontera, aldebaran } from "@/map/settlements";
import { GameMap } from "@/map/game-map";
import { MapStatus } from "@/map/map-status";
import { createPlains } from "@/zones/zone";
import { TravelAction, resolveNextStatus, matchTravelAction } from "./travel-action";
import { runTickable } from "@/ticking/async-ticker";
import {makeRest} from "@/rest";
import { Travel } from "@/travel/travel";

export type TravelStoreState = {
  mapStatus: MapStatus;
  map: GameMap;
};

export const useTravelStore = defineStore("travel", {
  state: () => ({
    mapStatus: {
      type: "resting",
      at: prontera,
    },
    map: new GameMap(
      [ prontera, aldebaran ],
      [ 
        { locations: [ prontera, aldebaran ], through: createPlains }
      ]),
  }) as TravelStoreState,
  actions: {
    takeAction(action: TravelAction) {
        this.mapStatus = (resolveNextStatus(this.mapStatus, action));
        matchTravelAction<void>(
          action, 
          (arrive) => runTickable(makeRest()), 
          (retreat) => runTickable(makeRest()),
          (cont) => {}, //eslint-disable-line @typescript-eslint/no-empty-function
          (depart) => runTickable(new Travel()),
        )
        
    }
  }
});
