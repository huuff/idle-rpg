import { reactive } from "vue";
import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";
import { human } from "@/creatures/species";
import {createCreature} from "./creatures/species";

export const useMainStore = defineStore("main", {
  state: () => ({
    player: reactive(createCreature(human)) as Creature,
  })
});
