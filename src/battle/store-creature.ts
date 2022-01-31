import { useMainStore } from "@/store";
import { useBattleStore } from "@/battle-store";
import { storeToRefs } from "pinia";
import { Creature } from "@/creatures/creature";


// TODO: Uses names! IDs would be a better option in the future
export function withStoreCreature(inputCreature: Creature, transformFunction: (creature: Creature) => Creature): void {
    const store = storeToRefs(useMainStore());
    const battleStore = storeToRefs(useBattleStore());

    if (inputCreature.name === store.player.value.name) {
        store.player.value = transformFunction(store.player.value);
    } else { // XXX: Must be an enemy
        battleStore.enemies.value = battleStore.enemies.value.map(c => c.name === inputCreature.name ? transformFunction(c) : c);
    }
}