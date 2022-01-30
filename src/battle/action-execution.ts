import { Item } from "@/items/item";
import { variabilityRandom, chooseRandom } from "@/util/random";
import { sum, isEmpty } from "lodash";
import { Stats, StatType } from "@/creatures/stats";
import BattleActions, { Steal, Attack, BattleAction, Escape, BaseAction, Move } from "./battle-action";
import { CreatureWithStatus, StillCreature } from "./battle-status";
import { extend } from "lodash";

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

function calculateDamage(
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

function canExecute(
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

function makeSteal(
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

function makeEscape(escape: Escape): EscapeExecution {
    return {
        type: "escape",
        success: Math.random() < escape.chance,
    }
}

function isEscape(execution: Execution): execution is EscapeExecution {
    return execution.type === "escape";
}

function isAttack(execution: Execution): execution is AttackExecution {
    return execution.type === "attack";
}

function make(action: Escape): Execution
function make(
    action: Exclude<BattleAction, Escape | Move>, 
    originator: StillCreature,
    target: StillCreature): Execution
function make(
    action: Move,
    originator: StillCreature,
): Execution
function make(
    action: BattleAction, 
    originator?: StillCreature, 
    target?: StillCreature): Execution {
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