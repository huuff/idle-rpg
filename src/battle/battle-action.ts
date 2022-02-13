import { Stats } from "@/creatures/stats";
import { BattleArea } from "./battle-area";
export type ActionType = 
    "attack" 
    | "steal"
    | "escape"
    | "move"
    ; 

export type BaseAction<T extends { type: ActionType}> = T;

export interface Attack {
    type: "attack";
    attackType: "melee" | "ranged";
    baseDamage: number;
    statVariability: Partial<Stats>;
    generalVariability: number; // This is applied to determine the minimum and maximum possible damages
    description: string;
}

export interface Steal {
    type: "steal";
    chance: number; // Effective chance is `rarity + (chance * rarity)`
}

export interface Escape {
    type: "escape";
    chance: number;
}

export interface Move {
    type: "move";
    to: BattleArea,
}

function isEscape(action: BattleAction): action is Escape {
    return action.type === "escape";
}

function isSteal(action: BattleAction): action is Steal {
    return action.type === "steal";
}

function isAttack(action: BattleAction): action is Attack {
    return action.type === "attack";
}

export type BattleAction = BaseAction<Attack | Steal | Escape | Move>;

function match<T>(
    action: BattleAction, 
    onAttack: (attack: Attack) => T,
    onSteal: (steal: Steal) => T,
    onEscape: (escape: Escape) => T,
    onMove: (move: Move) => T,
) {
    if (action.type === "attack") {
        return onAttack(action);
    } else if (action.type === "steal") {
        return onSteal(action);
    } else if (action.type === "escape") {
        return onEscape(action);
    } else if (action.type === "move") {
        return onMove(action);
    } else {
        throw new Error(`Battle action ${JSON.stringify(action)} not handled`);
    }
}

export default {
    match,
    isEscape,
    isSteal,
    isAttack,
}