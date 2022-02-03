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

function isEscape(action: Readonly<BattleAction>): action is Escape {
    return action.type === "escape";
}

function isSteal(action: Readonly<BattleAction>): action is Steal {
    return action.type === "steal";
}

function isAttack(action: Readonly<BattleAction>): action is Attack {
    return action.type === "attack";
}

export type BattleAction = Readonly<BaseAction<Attack | Steal | Escape | Move>>;

function match<T>(
    action: Readonly<BattleAction>, 
    onAttack: (attack: Readonly<Attack>) => T,
    onSteal: (steal: Readonly<Steal>) => T,
    onEscape: (escape: Readonly<Escape>) => T,
    onMove: (move: Readonly<Move>) => T,
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