export type SkillType = "armor-mastery" | "steal" | "escape";

export type BaseSkill = {
    type: SkillType;
}

export type ArmorMastery = {
    name: string;
    type: "armor-mastery";
    level: number;
} & BaseSkill;

export type StealSkill =  {
    name: string;
    type: "steal";
    action: true;
    level: number;
} & BaseSkill

export type EscapeSkill = {
    name: string;
    type: "escape";
    action: true;
    level: number;
} & BaseSkill

export type Skill = (ArmorMastery | StealSkill | EscapeSkill) & {
     progress: number // Progress to next level
 };

function match<T>(skill: Skill,
    onArmorMastery: (armorMastery: ArmorMastery) => T,
    onSteal: (steal: StealSkill) => T,
    onEscape: (escape: EscapeSkill) => T,
): T {
    if (skill.type === "armor-mastery") {
        return onArmorMastery(skill);
    } else if (skill.type === "steal") {
        return onSteal(skill);
    } else if (skill.type === "escape") {
        return onEscape(skill);
    } else {
        throw new Error(`Skill type ${JSON.stringify(skill)} not handled`);
    }
}

export const AMOR_MASTERY_MODIFIER = 0.1;
function loadBonus(skills: Skill[]): number {
    return (skills.find(s => s.type === "armor-mastery")?.level ?? 0) * AMOR_MASTERY_MODIFIER;
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
        (escape) => `Escape when under 5% health with ${(escapeChance(escape)) * 100}% chance`
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionOmit<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;
export type SkillSpec = UnionOmit<Skill, "level" | "progress"> & {
    levelProgression: number
}

function calculateFromLevel(skillSpec: SkillSpec, creatureLevel: number): Skill {
    const { levelProgression, ...res } = skillSpec;
    const skillLevel = Math.floor(levelProgression * creatureLevel);
    const progress = (levelProgression * creatureLevel) - skillLevel;
    return {
        ...res,
        level: skillLevel,
        progress
    };
}

export default {
    calculateFromLevel,
    describe,
    loadBonus,
    stealChance,
    escapeChance,
    match,
}

