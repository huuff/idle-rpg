import { storeToRefs } from "pinia";
import { useMainStore } from "@/store";
import Equipments from "@/items/equipment";
import Creatures, { Creature } from "@/creatures/creature";
import { useCreaturesStore } from "@/creatures-store";

// HACK
// I don't know what happens nor why (likely because I am using `reactive` in battle for creatures)
// but loading a save game breaks shit. I don't know why this makes it work again but it does, so
// keep it while I debug that weird vue internals error.
// Some idea: Maybe it's related to immer, since last time I got this error it came from mixing
// immer and vue's reactivity together

// What this does is unequipping and re-equipping all of player's items
// TODO: Remove immer and put everything as a store modification... is this needed then?
export function fixSaveHack() {
    const { player } = storeToRefs(useCreaturesStore());

    for (const item of Object.values(Creatures.equipment(player.value))) {
        // We know it's not an overload since it was already there
        player.value = Equipments.toggleEquipped(player.value, item.name) as Creature;
        player.value = Equipments.toggleEquipped(player.value, item.name) as Creature;
    }
}
