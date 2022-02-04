import { defineStore } from "pinia";
import { GameMap } from "@/map/game-map";
import { MapStatus, } from "@/map/map-status";
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

const { prontera, aldebaran } = basicSettlements;
const { plains } = basicZones;

export const useTravelStore = defineStore("travel", {
  state: (): TravelStoreState => ({
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
  }),
  actions: {
    takeAction(action: TravelAction) {
        const sceneStore = useSceneStore();
        const tickStore = useTickStore();
        const settingsStore = useSettingsStore();
        matchTravelAction<void>(
          action, 
          (arrive) => {
            const nextStatus = resolveNextStatus(this.mapStatus, arrive);
            this.mapStatus = nextStatus;
            tickStore.start(makeRest())
            // AUTOPLAY 
            if (hasDestination(settingsStore.autoplay)
                && nextStatus.at === settingsStore.autoplay.to) {
                settingsStore.autoplay = "disabled";
            }
          }, 
          (retreat) => { 
            const nextStatus = resolveNextStatus(this.mapStatus, retreat);
            tickStore.start(makeRest());
            sceneStore.setScene(settlementToScene(nextStatus.at));
            this.mapStatus = nextStatus;
          },
          (cont) => {
            this.mapStatus = resolveNextStatus(this.mapStatus, cont);
          }, //eslint-disable-line
          (depart) => { // eslint-disable-line @typescript-eslint/no-unused-vars
            this.mapStatus = resolveNextStatus(this.mapStatus, depart);
            tickStore.stop();
            tickStore.start(new Travel());
          }
        )
    },
  }
});
