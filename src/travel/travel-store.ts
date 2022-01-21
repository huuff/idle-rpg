import { defineStore } from "pinia";
import { prontera, aldebaran } from "@/map/settlements";
import { GameMap } from "@/map/game-map";
import { MapStatus, RestingStatus } from "@/map/map-status";
import { plains } from "@/zones/zone";
import { TravelAction, resolveNextStatus, matchTravelAction } from "./travel-action";
import { makeRest } from "@/rest";
import { Travel } from "@/travel/travel";
import { hasDestination } from "@/autoplay";
import { useMainStore } from "@/store";
import {useTickStore} from "@/ticking/tick-store";

export type TravelStoreState = {
  mapStatus: MapStatus;
  map: GameMap;
};

// FUTURE: I cast the status as the one I *know* they must be.
// However, in the future it'd be cool if `resolveNextStatus` could give stronger guarantees
// as to the return type. But I don't know how to do that yet.

export const useTravelStore = defineStore("travel", {
  state: () => ({
    mapStatus: {
      type: "resting",
      at: prontera,
    },
    map: new GameMap(
      [ prontera, aldebaran ],
      [ 
        { locations: [ prontera, aldebaran ], through: plains }
      ]),
  }) as TravelStoreState,
  actions: {
    takeAction(action: TravelAction) {
        this.mapStatus = (resolveNextStatus(this.mapStatus, action));
        const store = useMainStore();
        const tickStore = useTickStore();
        matchTravelAction<void>(
          action, 
          (arrive) => {
            const status = this.mapStatus as RestingStatus;
            tickStore.start(makeRest())
            // AUTOPLAY 
            if (hasDestination(store.autoplay)
                && status.at === store.autoplay.to) {
                store.autoplay = "disabled";
            }
          }, 
          (retreat) => {
            const status = this.mapStatus as RestingStatus;
            tickStore.start(makeRest());
            store.scene = status.at;
          },
          (cont) => {}, //eslint-disable-line @typescript-eslint/no-empty-function
          (depart) => {
            tickStore.stop();
            tickStore.start(new Travel());
          }
        )
    },
  }
});
