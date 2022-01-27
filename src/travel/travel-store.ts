import { defineStore } from "pinia";
import { GameMap } from "@/map/game-map";
import { MapStatus, RestingStatus } from "@/map/map-status";
import { TravelAction, resolveNextStatus, matchTravelAction } from "./travel-action";
import { makeRest } from "@/tickables/rest";
import { Travel } from "@/travel/travel";
import { hasDestination } from "@/autoplay";
import { useMainStore } from "@/store";
import {useTickStore} from "@/ticking/tick-store";
import {useSceneStore} from "@/scenes/scene-store";
import basicSettlements from "@/map/basic-settlements.json";
import { basicZones } from "@/zones/basic-zones";
import { Settlement, settlementToScene } from "@/map/settlements";

export type TravelStoreState = {
  mapStatus: MapStatus;
  map: GameMap;
};

// FUTURE: I cast the status as the one I *know* they must be.
// However, in the future it'd be cool if `resolveNextStatus` could give stronger guarantees
// as to the return type. But I don't know how to do that yet.

const { prontera, aldebaran } = basicSettlements;
const { plains } = basicZones;

export const useTravelStore = defineStore("travel", {
  state: () => ({
    mapStatus: {
      type: "resting",
      at: prontera,
    },
    map: {
      locations: [ prontera, aldebaran ],
      connections: [ 
        { locations: [ prontera, aldebaran ], through: plains }
      ],
    },
  }) as TravelStoreState,
  actions: {
    takeAction(action: TravelAction) {
        this.mapStatus = (resolveNextStatus(this.mapStatus, action));
        const store = useMainStore();
        const sceneStore = useSceneStore();
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
            sceneStore.setScene(settlementToScene(status.at as Settlement));
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
