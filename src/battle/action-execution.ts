import { Item } from "@/items/item";
import { variabilityRandom, chooseRandom } from "@/util/random";
import { sum, isEmpty } from "lodash";
import { Stats, StatType } from "@/creatures/stats";
import BattleActions, { Steal, Attack, BattleAction, Escape, BaseAction, Move } from "./battle-action";
import { CreatureWithStatus, StillCreature } from "./battle-status";
import { extend } from "lodash";

// TODO: as bag-of-functions

export type Execution = BaseAction<
AttackExecution
 | StealExecution
 | EscapeExecution
 | MoveExecution>;

export interface AttackExecution {
    type: "attack"
    executor: CreatureWithStatus;
    target: CreatureWithStatus;
    damage: number;
    description: string;
}

export interface StealExecution {
    type: "steal"
    originator: CreatureWithStatus;
    target: CreatureWithStatus;
    item?: Item;
    description: string;
}

export interface EscapeExecution {
    type: "escape";
    success: boolean;
}

export type MoveExecution = Move & {
    originator: StillCreature;
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
    onMove: (move: MoveExecution) => T,
) {
    if (execution.type === "attack") {
        return onAttack(execution);
    } else if (execution.type === "steal") {
        return onSteal(execution);
    } else if (execution.type === "escape") {
        return onEscape(execution);
    } else if (execution.type === "move") {
        return onMove(execution);
    } else {
        throw new Error(`Battle action ${JSON.stringify(execution)} not handled`);
    }
}

export function makeAttackExecution(
    action: Attack,
    executor: StillCreature,
    target: StillCreature
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

export function canExecute(
    attack: Attack,
    executor: StillCreature,
    target: StillCreature
): boolean {
    if (attack.attackType === "melee") {
        return executor.status.in.name === target.status.in.name;
    } else if (attack.attackType === "ranged") {
        return executor.status.in.name !== target.status.in.name;
    } else {
        throw new Error(`Attack type ${JSON.stringify(attack)} not handled in 'canExecute`);
    }
}

export function makeStealExecution(
    action: Steal,
    executor: CreatureWithStatus,
    target: CreatureWithStatus,
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

export function isAttackExecution(execution: Execution): execution is AttackExecution {
    return execution.type === "attack";
}

export function makeExecution(action: Escape): Execution
export function makeExecution(
    action: Exclude<BattleAction, Escape | Move>, 
    originator: StillCreature,
    target: StillCreature): Execution
export function makeExecution(
    action: Move,
    originator: StillCreature,
): Execution
export function makeExecution(
    action: BattleAction, 
    originator?: StillCreature, 
    target?: StillCreature): Execution {
    return BattleActions.match<Execution>(action,
            (attack) => makeAttackExecution(attack, originator!, target!), // eslint-disable-line @typescript-eslint/no-non-null-assertion
            (steal) => makeStealExecution(steal, originator!, target!), // eslint-disable-line @typescript-eslint/no-non-null-assertion
            (escape) => makeEscapeExecution(escape),
            (move) => extend(move, { originator: originator! }),
        )
} 