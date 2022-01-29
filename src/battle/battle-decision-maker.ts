import { Creature } from "@/creatures/creature";
import { BattleAction, Attack } from "./battle-action";
import { max } from "lodash";
import { chooseRandom } from "@/util/random";
import { makeAttackExecution, } from "./action-execution";
import { cloneDeep } from "lodash";

export type BattleDecisionMaker = (originator: Creature, rivals: Creature[]) => BattleAction;

// TODO: Return the actual execution
export const defaultBattleDecisionMaker: BattleDecisionMaker = (
    originator: Creature,
    rivals: Creature[]
) => {
    let allActions = cloneDeep(originator.possibleActions);

    if (originator.healthRatio < 0.05 && allActions.some(a => a.type === "escape")) {
        // If possible and necessary, escape
        return allActions.find(c => c.type === "escape")!;
    } else {
        // Else, do not consider escaping
        allActions = allActions.filter(a => a.type !== "escape");
    }

    if (hasUtilityAction(allActions) && originator.healthRatio > 0.5 && Math.random() < 0.2) {
        // XXX: this will break once steal is no longer the only utility action
        // Choose to use one utility action if it has one, once in 5 attacks
        return chooseRandom(allActions.filter(a => a.type !== "attack"));
    } else {
        const attackActions = allActions.filter(a => a.type === "attack") as Attack[];

        // Test each attack against a random target
        const randomTarget = chooseRandom(rivals.filter(c => c.isAlive));
        const possibleOutcomes = attackActions
            .map(a => makeAttackExecution(a, originator, randomTarget))
            .map(e => e.damage)
            ;

        // Choose the one with the highest damage
        const maxDamage = max(possibleOutcomes);
        const maxDamageIndex = possibleOutcomes.findIndex(o => o === maxDamage);
        return attackActions[maxDamageIndex];
    }
}

function hasUtilityAction(actions: BattleAction[]): boolean {
    return actions.some(a => a.type !== "attack");
}
