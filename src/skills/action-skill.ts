import { Skill, StealSkill, STEAL_MODIFIER } from "./skill";
import { Steal } from "@/battle/battle-action";

export type ActionSkill = Skill & { action: true };

function isActionSkill(skill: Skill): skill is ActionSkill {
    return ("action" in skill) && skill.action;
}

function stealToBattleAction(skill: StealSkill): Steal {
    return {
        type: "steal",
        rarityModifier: skill.level * STEAL_MODIFIER,
    }
}

function toBattleAction(skill: Skill & { action: true}) {
    if (skill.type === "steal") {
        return stealToBattleAction(skill);
    } else {
        throw new Error(`Skill ${JSON.stringify(skill)} not handled in toBattleAction`)
    }
}

export default {
    toBattleAction,
    isActionSkill,
}