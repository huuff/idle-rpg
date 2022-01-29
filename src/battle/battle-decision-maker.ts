import { Creature } from "@/creatures/creature";
import BattleActions, { BattleAction, Attack } from "./battle-action";
import { chooseRandom } from "@/util/random";
import { Execution, makeAttackExecution, makeEscapeExecution, makeStealExecution, AttackExecution } from "./action-execution";
import { cloneDeep } from "lodash";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/settings-store";

export type BattleDecisionMaker = (originator: Creature, rivals: Creature[]) => Execution;

export const defaultBattleDecisionMaker: BattleDecisionMaker = (
    originator: Creature,
    rivals: Creature[]
) => {
    let allActions = cloneDeep(originator.possibleActions);

    const { escapeHealth } = storeToRefs(useSettingsStore());

    if (originator.healthRatio < escapeHealth.value && allActions.some(a => a.type === "escape")) {
        // If possible and necessary, escape
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return makeEscapeExecution(allActions.find(BattleActions.isEscape)!);
    } else {
        // Else, do not consider escaping
        allActions = allActions.filter(a => !BattleActions.isEscape(a));
    }

    if (hasUtilityAction(allActions) && originator.healthRatio > 0.5 && Math.random() < 0.2) {
        // XXX: this will break once steal is no longer the only utility action
        // Choose to use one utility action if it has one, once in 5 attacks
        return makeStealExecution(
            chooseRandom(allActions.filter(BattleActions.isSteal)),
            originator,
            chooseRandom(rivals)
            );
    } else {
        const attackActions = allActions.filter(a => a.type === "attack") as Attack[];

        // Test each attack against a random target
        const randomTarget = chooseRandom(rivals.filter(c => c.isAlive));
        const possibleOutcomes = attackActions
            .map(a => makeAttackExecution(a, originator, randomTarget))
            .map(e => [e, e.damage] as [AttackExecution, number])
            .sort(([_1, damage1], [_2, damage2]) => damage1 - damage2)
            ;

        // Choose the one with the highest damage
        return possibleOutcomes[possibleOutcomes.length - 1][0];
    }
}

function hasUtilityAction(actions: BattleAction[]): boolean {
    return actions.some(a => a.type !== "attack");
}
