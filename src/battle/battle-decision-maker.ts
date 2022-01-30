import BattleActions, { BattleAction, Attack } from "./battle-action";
import Executions, { 
    AttackExecution,
    Execution,
} from "./action-execution";
import { cloneDeep, isEmpty } from "lodash";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/settings-store";
import { StillCreature } from "./battle-status";
import BattleAreas, { BattleArea } from "./battle-area";
import { chooseRandom } from "@/util/random";

export type BattleDecisionMaker = (
    originator: StillCreature, 
    rivals: StillCreature[],
    areas: BattleArea[],
    ) => Execution;

export const defaultBattleDecisionMaker: BattleDecisionMaker = (
    originator: StillCreature,
    rivals: StillCreature[],
    areas: BattleArea[],
) => {
    const allActions = cloneDeep(originator.possibleActions)
        .concat();

    const { escapeHealth } = storeToRefs(useSettingsStore());
    if (originator.healthRatio < escapeHealth.value && allActions.some(a => a.type === "escape")) {
        // If possible and necessary, escape
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return Executions.makeEscape(allActions.find(BattleActions.isEscape)!);
    } // Else do not consider escaping

    const attackActions =  allActions
        .filter((a): a is Attack => BattleActions.isAttack(a));

    const allPossibleAttacks: AttackExecution[] = [];
    for (const action of attackActions) {
        // Test each action against each rival
        for (const rival of rivals) {
            if (Executions.canExecute(action, originator, rival)){
                allPossibleAttacks.push(Executions.makeAttack(
                    action,
                    originator,
                    rival
                ))
            }
        }
    }
    
    if (!isEmpty(allPossibleAttacks)) {
        const possibleOutcomes = allPossibleAttacks
            .map(e => [e, e.damage] as [AttackExecution, number])
            .sort(([_1, damage1], [_2, damage2]) => damage1 - damage2)
            ;

        // Choose the one with the highest damage
        return possibleOutcomes[possibleOutcomes.length - 1][0];
    } else { // No attack possible, so move
        // XXX: Obviously a better solution than moven randomly would be needed if there
        // were more than 2 areas
        return chooseRandom(BattleAreas.possibleMoves(originator.status.in, areas)
            .map(move => Executions.make(move, originator))
        );
    }
}

function hasUtilityAction(actions: BattleAction[]): boolean {
    return actions.some(a => a.type !== "attack");
}
