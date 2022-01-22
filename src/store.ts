import { defineStore } from "pinia";
import { Creature, noCreature } from "@/creatures/creature";
import { Log, makeLog } from "@/log";
import { Battle } from "@/battle/battle"
import { Autoplay } from "@/autoplay";

export type StoreState = {
  player: Creature;
  battleLog: Log;
  travelLog: Log;
  autoplay: Autoplay;
  battle: Battle | undefined;
  money: number;
}

export const useMainStore = defineStore("main", {
  state: () => ({
      player: noCreature,
      travelLog: makeLog(),
      battleLog: makeLog(),
      autoplay: "disabled",
      money: 0,
    }) as StoreState,
});
