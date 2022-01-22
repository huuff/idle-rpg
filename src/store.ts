import { defineStore } from "pinia";
import { Creature, noCreature } from "@/creatures/creature";
import { Log, makeLog } from "@/log";
import { Battle } from "@/battle/battle"
import { Autoplay } from "@/autoplay";
import { Scene } from "@/scenes/scene";

export type StoreState = {
  player: Creature;
  battleLog: Log;
  travelLog: Log;
  autoplay: Autoplay;
  battle: Battle | undefined;
  scene: Scene | undefined; //TODO: Remove this?
}

export const useMainStore = defineStore("main", {
  state: () => ({
      player: noCreature,
      travelLog: makeLog(),
      battleLog: makeLog(),
      autoplay: "disabled",
    }) as StoreState,
});
