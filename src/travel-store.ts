import { defineStore } from "pinia";
import { prontera, aldebaran } from "@/map/settlements";
import { GameMap } from "@/map/game-map";
import { MapStatus } from "@/map/map-status";
import { createPlains } from "@/zones/zone";
import { TravelAction, resolveNextStatus } from "@/travel-action";

export type TravelStoreState = {
  mapStatus: MapStatus;
  map: GameMap;
};

export const useTravelStore = defineStore("travel", {
  state: () => ({
    mapStatus: {
      type: "resting",
      in: prontera,
    },
    map: new GameMap(
      [ prontera, aldebaran ],
      [ 
        { locations: [ prontera, aldebaran ], through: createPlains }
      ]),
  }) as TravelStoreState,
  actions: {
    takeAction(action: TravelAction) {
      if (this.mapStatus.type === "travelling")
        this.mapStatus = (resolveNextStatus(this.mapStatus, action));
    }
  }
});
