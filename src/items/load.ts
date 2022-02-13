import { Equipment } from "./equipment";
import { sum } from "lodash";
import Creatures, { Creature } from "@/creatures/creature";
import Skills from "@/skills/skill";
import { ReadonlyDeep } from "type-fest";

const LOAD_STRENGTH_MODIFIER = 0.8;

export type Load = {
    readonly current: number;
    readonly max: number;
}

export function total(equipment: ReadonlyDeep<Equipment>): number {
    return sum(Object.values(equipment).map(e => e.weight));
}

export function creatureCapacity(creature: Readonly<Creature>): number {
    const strengthContribution = Creatures.stats(creature).strength * LOAD_STRENGTH_MODIFIER;
    return strengthContribution + (Skills.loadBonus(Creatures.skills(creature)) * strengthContribution);
}

export function proportion(load: ReadonlyDeep<Load>): number {
    return load.current / load.max;
}

export default {
    total,
    creatureCapacity,
    proportion,
}
