import { storeToRefs } from "pinia";
import { useMainStore } from "@/store";
import equipment from "@/items/equipment";

// HACK
// I don't know what happens nor why (likely because I am using `reactive` in battle for creatures)
// but loading a save game breaks shit. I don't know why this makes it work again but it does, so
// keep it while I debug that weird vue internals error.
// Some idea: Maybe it's related to immer, since last time I got this error it came from mixing
// immer and vue's reactivity together

// What this does is unequipping and re-equipping all of player's items
export function fixSaveHack() {
    const { player } = storeToRefs(useMainStore());

    for (const item of Object.values(player.value.equipment)) {
        equipment.toggleEquipped(player.value, item.name);
        equipment.toggleEquipped(player.value, item.name);
    }
}
