import { Stats } from "@/creatures/stats";

// TODO: Force battle action and execution to use this
export type ActionTypes = 
    "attack" 
    | "steal"
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
    dexterity: number; // XXX: Unused yet. Use rarity?
}

export interface Escape {
    type: "escape";
}

export type BattleAction = Attack | Steal | Escape;

export function matchBattleAction<T>(
    action: BattleAction, 
    onAttack: (attack: Attack) => T,
    onSteal: (steal: Steal) => T,
) {
    if (action.type === "attack") {
        return onAttack(action);
    } else if (action.type === "steal") {
        return onSteal(action);
    } else {
        throw new Error(`Battle action ${JSON.stringify(action)} not handled`);
    }
}

