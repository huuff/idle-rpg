import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";

// FUTURE: Why do I have to use string instead of Creature["id"]?
// Creature["id"] throws a weird error yet my IDE and tools do not care about it
// is this a weird pinia, TS bug?
type StoredCreatures = { [id: string]: Creature }
type CreaturesStoreState = {
    creatures: StoredCreatures;
}

export const useCreaturesStore = defineStore("creatures", {
    state: (): CreaturesStoreState => ({
        creatures: {} as StoredCreatures,
    }),
    getters: {
        player: (state) => (state.creatures["1"]),
    },
    actions: {
        register(creature: Creature) {
            this.creatures[creature.id] = creature;
        },
    }
})

export function normalCreaturesToStored(normal: Creature[]): Creature[] {
    const { creatures } = useCreaturesStore();
    return normal.map(c => creatures[c.id]);
}