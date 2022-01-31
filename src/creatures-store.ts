import { defineStore } from "pinia";
import { Creature } from "@/creatures/creature";

// TODO: Why do I have to use string instead of Creature["id"]?
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