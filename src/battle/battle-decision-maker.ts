import { Creature } from "@/creatures/creature";
import { BattleAction, makeExecution, makeAttackExecution, Attack } from "./battle-action";
import equipment, { equipmentItems } from "@/items/equipment";
import { isEmpty, max } from "lodash";
import { chooseRandom, randomBetween } from "@/util/random";

export type BattleDecisionMaker = (originator: Creature, rivals: Creature[]) => BattleAction;

export const defaultBattleDecisionMaker: BattleDecisionMaker = (originator: Creature, rivals: Creature[]) => {
    const equipmentActions = equipment.battleActions(originator.equipment) ?? [];
    const naturalActions = originator.species.naturalActions ?? [];
    const classActions = originator.jobClass.battleActions ?? [];

    const allActions = equipmentActions.concat(naturalActions).concat(classActions);

    if (hasUtilityAction(allActions) && originator.healthRatio > 0.5 && Math.random() < 0.2) {
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

        // Choose the one with the highest damage TODO: Add some variability here
        const maxDamage = max(possibleOutcomes);
        const maxDamageIndex = possibleOutcomes.findIndex(o => o === maxDamage);
        return attackActions[maxDamageIndex];
    }
}

function hasUtilityAction(actions: BattleAction[]): boolean {
    return actions.some(a => a.type !== "attack");
}