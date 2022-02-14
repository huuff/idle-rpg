import BattleActions, { Attack } from "./battle-action";
import Executions, { 
    AttackExecution,
    Execution,
} from "./action-execution";
import { cloneDeep, isEmpty } from "lodash";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/settings-store";
import { CreatureWithStatus } from "./battle-status";
import BattleAreas, { BattleArea } from "./battle-area";
import { chooseRandom } from "@/util/random";
import Creatures from "@/creatures/creature";

export type BattleDecisionMaker = (
    originator: CreatureWithStatus, 
    rivals: CreatureWithStatus[],
    areas: readonly BattleArea[],
    ) => Execution;

export const defaultBattleDecisionMaker: BattleDecisionMaker = (
    originator: CreatureWithStatus,
    rivals: CreatureWithStatus[],
    areas: readonly BattleArea[],
) => {

    // If it's moving, can't do anything, keep moving
    if (originator.battleStatus.type === "moving") {
        return Executions.make({
            type: "move",
            to: originator.battleStatus.to
        }, originator)
    }

    const allActions = cloneDeep(Creatures.battleActions(originator))
        .concat();

    const { escapeHealth } = storeToRefs(useSettingsStore());
    if (Creatures.healthRatio(originator) < escapeHealth.value && allActions.some(a => a.type === "escape")) {
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
            .map(e => [e, e.damage] as const)
            .sort(([_1, damage1], [_2, damage2]) => damage1 - damage2)
            ;

        // Choose the one with the highest damage
        return possibleOutcomes[possibleOutcomes.length - 1][0];
    } else { // No attack possible, so move
        // XXX: Obviously a better solution than moving randomly would be needed if there
        // were more than 2 areas
        return chooseRandom(BattleAreas.possibleMoves(originator.battleStatus.in, areas)
            .map(move => Executions.make(move, originator))
        );
    }
}

