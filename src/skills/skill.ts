import { Steal } from "@/battle/battle-action";

export type SkillType = "armor-mastery" | "steal";


export interface ArmorMastery {
    name: string;
    type: "armor-mastery";
    level: number;
}

export interface StealSkill {
    name: string;
    type: "steal";
    action: true;
    level: number;
}

export type Skill = (ArmorMastery | StealSkill) & {
     progress: number // Progress to next level
 };

export function matchSkill<T>(skill: Skill,
    onArmorMastery: (armorMastery: ArmorMastery) => T,
    onSteal: (steal: StealSkill) => T,
): T {
    if (skill.type === "armor-mastery") {
        return onArmorMastery(skill);
    } else if (skill.type === "steal") {
        return onSteal(skill);
    } else {
        throw new Error(`Skill type ${JSON.stringify(skill)} not handled`);
    }
}

export const AMOR_MASTERY_MODIFIER = 0.1;
export const STEAL_MODIFIER = 0.1;

export function armorMasteryLoadBonus(skills: Skill[]): number {
    return (skills.find(s => s.type === "armor-mastery")?.level ?? 0) * AMOR_MASTERY_MODIFIER;
}

export function describeSkill(skill: Skill): string {
    return matchSkill(skill,
        (armorMastery) => `Load capacity +${(skill.level * AMOR_MASTERY_MODIFIER) * 100}%`,
        (steal) => `Steal chance +${(skill.level * STEAL_MODIFIER) * 100}%`,
    )
}

type UnionOmit<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;
export type SkillSpec = UnionOmit<Skill, "level" | "progress"> & {
    levelProgression: number
}

export function calculateSkill(skillSpec: SkillSpec, creatureLevel: number): Skill {
    const { levelProgression, ...res } = skillSpec;
    const skillLevel = Math.floor(levelProgression * creatureLevel);
    const progress = (levelProgression * creatureLevel) - skillLevel;
    return {
        ...res,
        level: skillLevel,
        progress
    };
}

