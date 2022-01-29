import Zones, { Zone } from "./zone";
import { createEnemyFactory } from "./enemy-distribution";
import { useMainStore } from "@/store";
import { nrange } from "@/util/range";
import { randomInt } from "@/util/random";
import { Battle } from "@/battle/battle";

export function newEncounter(zone: Zone, currentSteps: number) {
    const { stage } = Zones.currentStage(zone, currentSteps);

    const createEnemy = createEnemyFactory(stage.enemies);
    const { player } = useMainStore();
    const enemies = nrange(randomInt(3)).map((_) => createEnemy());
    return new Battle([player], enemies, zone.areas);
}