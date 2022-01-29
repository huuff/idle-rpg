import { Creature } from "@/creatures/creature";
import { Item } from "@/items/item";
import { variabilityRandom, chooseRandom } from "@/util/random";
import { sum, isEmpty } from "lodash";
import { Stats, StatType } from "@/creatures/stats";
import { Steal, Attack, BattleAction, matchBattleAction, Escape, BaseAction } from "./battle-action";

export type Execution = BaseAction<AttackExecution | StealExecution | EscapeExecution>;

export interface AttackExecution {
    type: "attack"
    executor: Creature;
    target: Creature;
    damage: number;
    description: string;
}

export interface StealExecution {
    type: "steal"
    originator: Creature;
    target: Creature;
    item?: Item;
    description: string;
}

export interface EscapeExecution {
    type: "escape";
    success: boolean;
}

export function calculateDamage(
    baseDamage: number,
    stats: Stats,
    statVariability: Partial<Stats>,
    generalVariability: number,
    ): number {
    const statContribution = sum(
        Object.entries(statVariability)
        .filter(([_, contrib]) => !!contrib)
        .map(([statName, contrib]) => {
            // Latest installment of "filter won't narrow my fucking types"
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return variabilityRandom((stats[statName as StatType] ?? 0) * contrib!, generalVariability)
        })
    );

    return variabilityRandom(baseDamage, generalVariability) + statContribution;
}

export function matchExecution<T>(
    execution: Execution, 
    onAttack: (attack: AttackExecution) => T,
    onSteal: (steal: StealExecution) => T,
    onEscape: (escape: EscapeExecution) => T,
) {
    if (execution.type === "attack") {
        return onAttack(execution);
    } else if (execution.type === "steal") {
        return onSteal(execution);
    } else if (execution.type === "escape") {
        return onEscape(execution);
    } else {
        throw new Error(`Battle action ${JSON.stringify(execution)} not handled`);
    }
}

export function makeAttackExecution(
    action: Attack,
    executor: Creature,
    target: Creature
): AttackExecution {
    const damage = calculateDamage(
        action.baseDamage,
        executor.stats,
        action.statVariability, 
        action.generalVariability
    );
    const displayDamage = Math.round(damage);

    return {
        type: "attack",
        executor,
        target,
        damage,
        description: `${executor.name} ${action.description} ${target.name} for ${displayDamage} damage!`
    };
}

export function makeStealExecution(
    action: Steal,
    executor: Creature,
    target: Creature,
): StealExecution {
    const targetItems = Object.values(target.inventory);
    const itemToSteal = !isEmpty(targetItems) ? chooseRandom(targetItems) : undefined;

    let stolenItem: undefined | Item;
    if (itemToSteal) {
        const chanceToStealIt = itemToSteal.rarity + (itemToSteal.rarity * action.chance);
        if (Math.random() < chanceToStealIt) {
            stolenItem = itemToSteal;
        }
    }

    const description = stolenItem
        ? `${executor.name} steals ${stolenItem.name} from ${target.name}!`
        : `${executor.name} tries to steal from ${target.name}, but finds nothing!`;

    return {
        type: "steal",
        originator: executor,
        target,
        item: stolenItem,
        description
    }
}

export function makeEscapeExecution(escape: Escape): EscapeExecution {
    return {
        type: "escape",
        success: Math.random() < escape.chance,
    }
}

export function isEscapeExecution(execution: Execution): execution is EscapeExecution {
    return execution.type === "escape";
}

type NonEscape<T> = T extends Escape ? never : T;

export function makeExecution(action: Escape): Execution
export function makeExecution(action: NonEscape<BattleAction>, originator: Creature, target: Creature): Execution
export function makeExecution(action: BattleAction, originator?: Creature, target?: Creature): Execution {
    return matchBattleAction<Execution>(action,
            (attack) => makeAttackExecution(attack, originator!, target!),
            (steal) => makeStealExecution(steal, originator!, target!),
            (escape) => makeEscapeExecution(escape),
        )
} 