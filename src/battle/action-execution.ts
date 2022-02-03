import { Item } from "@/items/item";
import { variabilityRandom, chooseRandom } from "@/util/random";
import { sum, isEmpty } from "lodash";
import StatsOps, { Stats, StatType } from "@/creatures/stats";
import BattleActions, { Steal, Attack, BattleAction, Escape, BaseAction, Move } from "./battle-action";
import BattleStatuses, { CreatureWithStatus } from "./battle-status";
import { extend } from "lodash";
import Creatures from "@/creatures/creature";

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
    originator: CreatureWithStatus;
}

function calculateDamage(
    baseDamage: number,
    stats: Readonly<Stats>,
    statVariability: Readonly<Partial<Stats>>,
    generalVariability: number,
    ): number {
    const statContribution = sum(
        Object.entries(statVariability)
        .filter((nameAndContrib): nameAndContrib is [string, number] => !!nameAndContrib[1])
        .filter((nameAndContrib): nameAndContrib is [StatType, number] => StatsOps.isStatType(nameAndContrib[0]))
        .map(([statName, contrib]) => variabilityRandom((stats[statName]?? 0) * contrib, generalVariability))
    );

    return variabilityRandom(baseDamage, generalVariability) + statContribution;
}

function match<T>(
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

function makeAttack(
    action: Attack,
    executor: CreatureWithStatus,
    target: CreatureWithStatus
): AttackExecution {
    const damage = calculateDamage(
        action.baseDamage,
        Creatures.stats(executor),
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

function canExecute(
    attack: Attack,
    executor: CreatureWithStatus,
    target: CreatureWithStatus
): boolean {
    const executorLocation = BattleStatuses.currentLocation(executor);
    const targetLocation = BattleStatuses.currentLocation(target);
    if (attack.attackType === "melee") {
        return executorLocation.name === targetLocation.name;
    } else if (attack.attackType === "ranged") {
        return executorLocation.name !== targetLocation.name;
    } else {
        throw new Error(`Attack type ${JSON.stringify(attack)} not handled in 'canExecute`);
    }
}

function makeSteal(
    action: Readonly<Steal>,
    executor: Readonly<CreatureWithStatus>,
    target: Readonly<CreatureWithStatus>,
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

function makeEscape(escape: Readonly<Escape>): EscapeExecution {
    return {
        type: "escape",
        success: Math.random() < escape.chance,
    }
}

function isEscape(execution: Readonly<Execution>): execution is EscapeExecution {
    return execution.type === "escape";
}

function isAttack(execution: Readonly<Execution>): execution is AttackExecution {
    return execution.type === "attack";
}

function make(action: Escape): Execution
function make(
    action: Readonly<Exclude<BattleAction, Escape | Move>>, 
    originator: Readonly<CreatureWithStatus>,
    target: Readonly<CreatureWithStatus>): Execution
function make(
    action: Readonly<Move>,
    originator: Readonly<CreatureWithStatus>,
): Execution
function make(
    action: Readonly<BattleAction>, 
    originator?: Readonly<CreatureWithStatus>, 
    target?: Readonly<CreatureWithStatus>): Execution {
    return BattleActions.match<Execution>(action,
            (attack) => makeAttack(attack, originator!, target!), // eslint-disable-line @typescript-eslint/no-non-null-assertion
            (steal) => makeSteal(steal, originator!, target!), // eslint-disable-line @typescript-eslint/no-non-null-assertion
            (escape) => makeEscape(escape),
            (move) => extend(move, { originator: originator! }),
        )
} 

export default {
    makeAttack,
    makeSteal,
    makeEscape,
    isAttack,
    isEscape,
    canExecute,
    match,
    make,
}