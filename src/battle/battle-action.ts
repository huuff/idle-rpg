import { Creature } from "@/creatures/creature";
import { Stats, StatType } from "@/creatures/stats";
import { Log } from "@/log";
import { variabilityRandom } from "@/util/random";
import { sum } from "lodash";

export interface BattleAction {
    baseDamage: number;
    statVariability: Partial<Stats>;
    generalVariability: number; // This is applied to determine the minimum and maximum possible damages
    description: string;
}

export interface BattleActionExecution {
    executor: Creature;
    target: Creature;
    damage: number;
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

export function makeExecution(
    action: BattleAction,
    executor: Creature,
    target: Creature
): BattleActionExecution {
    const damage = calculateDamage(
        action.baseDamage,
        executor.stats,
        action.statVariability, 
        action.generalVariability
    );
    const displayDamage = Math.round(damage);

    return {
        executor,
        target,
        damage,
        description: `${executor.name} ${action.description} ${target.name} for ${displayDamage} damage!`
    };
}

export function execute(action: BattleActionExecution, logger: Log): void {
    action.target.currentHealth -= action.damage;
    logger.messages.push(action.description);
}