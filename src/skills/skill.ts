export type SkillType = "armor-mastery" | "test";

export type ArmorMastery = {
    type: "armor-mastery";
}

export type Skill = (ArmorMastery) & {
    name: string;
    type: SkillType;
    level: number;
};

export function matchSkill<T>(skill: Skill,
    onArmorMastery: (armorMastery: ArmorMastery) => T
): T {
    if (skill.type === "armor-mastery") {
        return onArmorMastery(skill);
    } else {
        throw new Error(`Skill type ${JSON.stringify(skill)} not handled`);
    }
}

export const AMOR_MASTERY_MODIFIER = 0.1;
export function armorMasteryLoadBonus(skills: Skill[]): number {
    return (skills.find(s => s.type === "armor-mastery")?.level ?? 0) * AMOR_MASTERY_MODIFIER;
}

export function describeSkill(skill: Skill): string {
    return matchSkill(skill,
        (armorMastery) => `Load capacity +${(skill.level * AMOR_MASTERY_MODIFIER) * 100}%`
    )
}

export type SkillSpec<T extends Skill> = Omit<T, "level"> & {
    levelProgression: number
}

export function calculateSkill<T extends Skill>(skillSpec: SkillSpec<T>, creatureLevel: number)
    : Skill & { progress: number} {
    const { levelProgression, ...res } = skillSpec;
    const skillLevel = Math.floor(levelProgression * creatureLevel);
    const progress = (levelProgression * creatureLevel) - skillLevel;
    return {
        ...res,
        level: skillLevel,
        progress
    };
}