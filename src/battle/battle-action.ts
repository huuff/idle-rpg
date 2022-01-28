import { Stats } from "@/creatures/stats";

// TODO: Force battle action and execution to use this
export type ActionTypes = 
    "attack" 
    | "steal"
    | "escape"
    ; 

export interface Attack {
    type: "attack";
    baseDamage: number;
    statVariability: Partial<Stats>;
    generalVariability: number; // This is applied to determine the minimum and maximum possible damages
    description: string;
}

export interface Steal {
    type: "steal";
    rarityModifier: number; // Effective chance is `rarity + (rarityModifier * rarity)`
}

export interface Escape {
    type: "escape";
}

export type BattleAction = Attack | Steal | Escape;

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

