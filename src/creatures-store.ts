import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";
import { Mutable } from "type-fest";
import produce from "immer";
import { IProduce } from "immer/dist/internal";

type CreaturesStoreState = {
    creatures: Creature[];
}

export const useCreaturesStore = defineStore("creatures", {
    state: (): CreaturesStoreState => ({
        creatures: []
    }),
    getters: {
        player: (state) => (state.creatures.find(c => c.id === "1")),
    },
    actions: {
        withCreature(creatureId: string, transform: Parameters<typeof produce>[1]) {
            const index = this.creatures.findIndex(c => c.id === creatureId);
            this.creatures[index] = produce(this.creatures[index], transform)
        }
    }
})