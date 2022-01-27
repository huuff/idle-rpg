import { Creature } from "@/creatures/creature";
import { Stats, StatType } from "@/creatures/stats";
import { Item } from "@/items/item";
import { Log } from "@/log";
import { chooseRandom, variabilityRandom } from "@/util/random";
import { isEmpty, sum } from "lodash";
import inventory, { singleInventoryItem } from "@/items/inventory";

export type ActionTypes = "attack" | "steal"; // TODO: Force battle action and execution to use this

export interface Attack {
    type: "attack";
    baseDamage: number;
    statVariability: Partial<Stats>;
    generalVariability: number; // This is applied to determine the minimum and maximum possible damages
    description: string;
}

export interface Steal {
    type: "steal";
    dexterity: number; // XXX: Unused yet
}

export type BattleAction = Attack | Steal;

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

export type Execution = AttackExecution | StealExecution;

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

export function matchExecution<T>(
    execution: Execution, 
    onAttack: (attack: AttackExecution) => T,
    onSteal: (steal: StealExecution) => T,
) {
    if (execution.type === "attack") {
        return onAttack(execution);
    } else if (execution.type === "steal") {
        return onSteal(execution);
    } else {
        throw new Error(`Battle action ${JSON.stringify(execution)} not handled`);
    }
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
            return variabilityRandom((stats[statName as StatType] ?? 0) * contrib!, generalVariability)
        })
    );

    return variabilityRandom(baseDamage, generalVariability) + statContribution;
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
    const stolenItem = !isEmpty(targetItems) ? chooseRandom(targetItems) : undefined;

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

export function makeExecution(action: BattleAction, originator: Creature, target: Creature): Execution {
    return matchBattleAction<Execution>(action,
            (attack) => makeAttackExecution(attack, originator, target),
            (steal) => makeStealExecution(steal, originator, target),
        )
} 

export function executeAttack(attack: AttackExecution, logger: Log): void {
    attack.target.currentHealth -= attack.damage;
    logger.messages.push(attack.description);
}

export function executeSteal(steal: StealExecution, logger: Log): void {
    if (steal.item) {
        steal.originator.inventory = inventory.plus(
            steal.originator.inventory, 
            singleInventoryItem(steal.item),
        )
    }
    
    logger.messages.push(steal.description);
}

export function execute(execution: Execution, logger: Log): void {
    return matchExecution(execution,
            (attack) => executeAttack(attack, logger),
            (steal) => executeSteal(steal, logger)
        );
}