import { defineStore } from "pinia";
import { Creature, noCreature } from "@/creatures/creature";
import { Log, makeLog } from "@/log";

export type StoreState = {
  player: Creature;
  battleLog: Log;
  travelLog: Log;
  money: number;
}

export const useMainStore = defineStore("main", {
  state: (): StoreState => ({
      player: noCreature,
      travelLog: makeLog(),
      battleLog: makeLog(),
      money: 0,
    }),
});
