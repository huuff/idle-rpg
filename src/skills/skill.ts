import { Creature } from "@/creatures/creature";

export type SkillType =
 "armor-mastery" 
 | "steal" 
 | "escape"
 | "initiative"
 ;

export type BaseSkill<T extends { 
    type: SkillType;
    level: number;
} | {
    type: SkillType;
    level: "MAX";
}> = T;

export type ArmorMastery = {
    name: string;
    type: "armor-mastery";
    level: number;
};

export type StealSkill =  {
    name: string;
    type: "steal";
    action: true;
    level: number;
};

export type EscapeSkill = {
    name: string;
    type: "escape";
    action: true;
    level: number;
};

export type InitiativeSkill = {
    name: string;
    level: "MAX";
    type: "initiative";
}

export type Skill = BaseSkill<
     ArmorMastery 
     | StealSkill
     | EscapeSkill
     | InitiativeSkill
     > & {
     progress?: number // Progress to next level
 };

function match<T>(skill: Skill,
    onArmorMastery: (armorMastery: ArmorMastery) => T,
    onSteal: (steal: StealSkill) => T,
    onEscape: (escape: EscapeSkill) => T,
    onInitiative: (rearguard: InitiativeSkill) => T,
): T {
    if (skill.type === "armor-mastery") {
        return onArmorMastery(skill);
    } else if (skill.type === "steal") {
        return onSteal(skill);
    } else if (skill.type === "escape") {
        return onEscape(skill);
    } else if (skill.type === "initiative") {
        return onInitiative(skill);
    } else {
        throw new Error(`Skill type ${JSON.stringify(skill)} not handled`);
    }
}

function isArmorMastery(skill: Skill): skill is ArmorMastery {
    return skill.type === "armor-mastery";
}

export const AMOR_MASTERY_MODIFIER = 0.1;
function loadBonus(skills: Skill[]): number {
    return (skills.find(isArmorMastery)?.level ?? 0) * AMOR_MASTERY_MODIFIER;
}

export const STEAL_MODIFIER = 0.1;
function stealChance(steal: StealSkill): number {
    return steal.level * STEAL_MODIFIER;
}

export const ESCAPE_CHANCE_MODIFIER = 0.1;
export const ESCAPE_MIN_CHANCE = 0.5;
function escapeChance(escape: EscapeSkill): number {
    return ESCAPE_MIN_CHANCE + (escape.level * ESCAPE_CHANCE_MODIFIER);
}


function describe(skill: Skill): string {
    return match(skill,
        (armorMastery) => `Load capacity +${(armorMastery.level * AMOR_MASTERY_MODIFIER) * 100}%`,
        (steal) => `Steal chance +${(stealChance(steal)) * 100}%`,
        (escape) => `Escape when under 5% health with ${(escapeChance(escape)) * 100}% chance`,
        (initiative) => `Starts battles at the rearguard`,
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributedOmit<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;
export type SkillSpec<T extends Skill> = DistributedOmit<T, "level" | "progress"> & {
    levelProgression: T["level"];
}

// XXX: I'd love to type this better but I can't. I know basically no usage can break it
// yet I can't get TypeScript to accept it without assertions. Maybe conditional types
// would do but then typescript can't narrow the conditional inside the body of the function,
// so I'd need overloads and maybe got with `any`s for the implementation? No option seems
// especially good, but I enjoy coming here and spending a whole afternoon trying to remove
// the type assertions.
function calculateFromLevel<T extends Skill>(skillSpec: SkillSpec<T>, creatureLevel: number): Skill {
    const { levelProgression, ...res } = skillSpec;

    if (levelProgression === "MAX") {
        return  {
            ...res,
            level: "MAX",
        } as Skill;
    } else if (typeof levelProgression === "number"){
        const skillLevel = Math.floor(levelProgression * creatureLevel);
        const progress = (levelProgression * creatureLevel) - skillLevel;
        return {
            ...res,
            level: skillLevel,
            progress
        } as Skill;
    } else {
        throw new Error(`Level progression of ${levelProgression} not handled`);
    }
}

function hasInitiative(creature: Creature): boolean {
    return !!creature.skills.find(s => s.type === "initiative");
}

export default {
    calculateFromLevel,
    describe,
    loadBonus,
    stealChance,
    escapeChance,
    match,
    hasInitiative,
}