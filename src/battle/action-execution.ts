import { Creature } from "@/creatures/creature";
import { Item } from "@/items/item";
import inventory, { singleInventoryItem} from "@/items/inventory";
import { variabilityRandom, chooseRandom } from "@/util/random";
import { sum, isEmpty } from "lodash";
import { Stats, StatType } from "@/creatures/stats";
import { Steal, Attack, BattleAction, matchBattleAction } from "./battle-action";
import { Log } from "@/log";

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
            (escape) => {throw new Error("Can't execute an escape! (Must be handled before execution)")},
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