import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";
import { human } from "@/creatures/species";
import { createCreature } from "@/creatures/species";
import { Log, makeLog } from "@/log";
import { Battle } from "@/battle/battle"
import { Autoplay } from "@/autoplay";
import { Scene } from "@/scenes/scene";

export type StoreState = {
  player: Creature;
  log: Log;
  autoplay: Autoplay;
  battle: Battle | undefined;
  scene: Scene | undefined;
}

export const useMainStore = defineStore("main", {
  state: () => ({
      player: createCreature(human),
      log: makeLog(),
      autoplay: "disabled",
    }) as StoreState,
});
