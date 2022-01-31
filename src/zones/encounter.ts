import Zones, { Zone } from "./zone";
import { createEnemyFactory } from "./enemy-distribution";
import { useCreaturesStore } from "@/creatures-store";
import { nrange } from "@/util/range";
import { randomInt } from "@/util/random";
import { Battle } from "@/battle/battle";

export function newEncounter(zone: Zone, currentSteps: number) {
    const { stage } = Zones.currentStage(zone, currentSteps);

    const createEnemy = createEnemyFactory(stage.enemies);
    const { player } = useCreaturesStore();
    const enemies = nrange(randomInt(3)).map((_) => createEnemy());
    return new Battle([player], enemies, zone.areas);
}