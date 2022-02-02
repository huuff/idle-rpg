import { defineStore } from "pinia";
import { Creature, PLAYER_ID } from "@/creatures/creature";

// FUTURE: Why do I have to use string instead of Creature["id"]?
// Creature["id"] throws a weird error yet my IDE and tools do not care about it
// is this a weird pinia, TS bug?
type StoredCreatures = { [id: string]: Creature }
type CreaturesStoreState = {
    creatures: StoredCreatures;
}

type RegisterOptions = {
  override?: boolean;
}

export const useCreaturesStore = defineStore("creatures", {
    state: (): CreaturesStoreState => ({
        creatures: {} as StoredCreatures,
    }),
    getters: {
        player: (state) => (state.creatures[PLAYER_ID]),
    },
    actions: {
        register(creature: Creature, { override = false }: RegisterOptions = {}) {
          if (this.creatures[creature.id] && !override) {
            throw new Error(`Trying to register a creature with id ${creature.id}, but it already exists!`)
          }
          this.creatures[creature.id] = creature;
        },
        remove(id: string) {
          delete this.creatures[id];
        },
    }
})

export function normalCreaturesToStored(normal: Creature[]): Creature[] {
    const { creatures } = useCreaturesStore();
    return normal.map(c => creatures[c.id]);
}
