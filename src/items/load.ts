import { Equipment } from "./equipment";
import { sum } from "lodash";
import { Creature } from "@/creatures/creature";

const LOAD_STRENGTH_MODIFIER = 0.8;

export type Load = {
    current: number;
    max: number;
}

export function total(equipment: Equipment): number {
    return sum(Object.values(equipment).map(e => e.weight));
}

export function creatureCapacity(creature: Creature): number {
    return creature.stats.strength * LOAD_STRENGTH_MODIFIER;
}

export function proportion(load: Load): number {
    return load.current / load.max;
}

export default {
    total,
    creatureCapacity,
    proportion,
}