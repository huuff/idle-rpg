import { Stats } from "@/creatures/stats";
// TODO: Make bag-of-functions
export type ActionType = 
    "attack" 
    | "steal"
    | "escape"
    ; 

export type BaseAction<T extends { type: ActionType}> = T;

export interface Attack {
    type: "attack";
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

export function isEscape(action: BattleAction): action is Escape {
    return action.type === "escape";
}

export function isSteal(action: BattleAction): action is Steal {
    return action.type === "steal";
}

export type BattleAction = BaseAction<Attack | Steal | Escape>;

export function matchBattleAction<T>(
    action: BattleAction, 
    onAttack: (attack: Attack) => T,
    onSteal: (steal: Steal) => T,
    onEscape: (escape: Escape) => T,
) {
    if (action.type === "attack") {
        return onAttack(action);
    } else if (action.type === "steal") {
        return onSteal(action);
    } else if (action.type === "escape") {
        return onEscape(action);
    } else {
        throw new Error(`Battle action ${JSON.stringify(action)} not handled`);
    }
}

