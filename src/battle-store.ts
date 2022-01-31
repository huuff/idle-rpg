import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";

type BattleStoreState = {
    enemies: Creature[];
}

export const useBattleStore = defineStore("battle", {
    state: (): BattleStoreState => ({
        enemies: [],
    })
});