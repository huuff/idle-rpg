import Skills, { EscapeSkill, Skill, StealSkill, STEAL_MODIFIER } from "./skill";
import { Escape, Steal } from "@/battle/battle-action";

export type ActionSkill = Skill & { action: true };

function isActionSkill(skill: Skill): skill is ActionSkill {
    return ("action" in skill) && skill.action;
}

// TODO: This in a `stealChance` in skills?
function stealToBattleAction(skill: StealSkill): Steal {
    return {
        type: "steal",
        rarityModifier: skill.level * STEAL_MODIFIER,
    }
}

function escapeToBattleAction(skill: EscapeSkill): Escape {
    return {
        type: "escape",
        chance: Skills.escapeChance(skill)
    }
}

function toBattleAction(skill: ActionSkill) {
    if (skill.type === "steal") {
        return stealToBattleAction(skill);
    } else if (skill.type === "escape") {
        return escapeToBattleAction(skill);
    } else {
        throw new Error(`Skill ${JSON.stringify(skill)} not handled in toBattleAction`)
    }
}

export default {
    toBattleAction,
    isActionSkill,
}