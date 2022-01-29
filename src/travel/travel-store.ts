import { defineStore } from "pinia";
import { GameMap } from "@/map/game-map";
import { MapStatus, RestingStatus } from "@/map/map-status";
import { TravelAction, resolveNextStatus, matchTravelAction } from "./travel-action";
import { makeRest } from "@/tickables/rest";
import { Travel } from "@/travel/travel";
import { hasDestination } from "@/autoplay";
import {useTickStore} from "@/ticking/tick-store";
import {useSceneStore} from "@/scenes/scene-store";
import basicSettlements from "@/map/basic-settlements.json";
import { basicZones } from "@/zones/basic-zones";
import { settlementToScene } from "@/map/settlements";
import { useSettingsStore } from "@/settings-store";

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
        const sceneStore = useSceneStore();
        const tickStore = useTickStore();
        const settingsStore = useSettingsStore();
        matchTravelAction<void>(
          action, 
          (arrive) => {  // eslint-disable-line @typescript-eslint/no-unused-vars
            const status = this.mapStatus as RestingStatus;
            tickStore.start(makeRest())
            // AUTOPLAY 
            if (hasDestination(settingsStore.autoplay)
                && status.at === settingsStore.autoplay.to) {
                settingsStore.autoplay = "disabled";
            }
          }, 
          (retreat) => {  // eslint-disable-line @typescript-eslint/no-unused-vars
            const status = this.mapStatus as RestingStatus;
            tickStore.start(makeRest());
            sceneStore.setScene(settlementToScene(status.at));
          },
          (cont) => {}, //eslint-disable-line
          (depart) => { // eslint-disable-line @typescript-eslint/no-unused-vars
            tickStore.stop();
            tickStore.start(new Travel());
          }
        )
    },
  }
});
