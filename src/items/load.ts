import { Equipment } from "./equipment";
import { sum } from "lodash";
import { Creature } from "@/creatures/creature";
import Skills from "@/skills/skill";

const LOAD_STRENGTH_MODIFIER = 0.8;

export type Load = {
    current: number;
    max: number;
}

export function total(equipment: Equipment): number {
    return sum(Object.values(equipment).map(e => e.weight));
}

export function creatureCapacity(creature: Creature): number {
    const strengthContribution = creature.stats.strength * LOAD_STRENGTH_MODIFIER;
    return strengthContribution + (Skills.armorMasteryLoadBonus(creature.skills) * strengthContribution);
}

export function proportion(load: Load): number {
    return load.current / load.max;
}

export default {
    total,
    creatureCapacity,
    proportion,
}