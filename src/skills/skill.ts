export type SkillType = "armor-mastery" | "test";

export type ArmorMastery = {
    type: "armor-mastery";
}

export type Skill = (ArmorMastery) & { 
    type: SkillType;
    level: number;
};

export function armorMasteryLoadBonus(skills: Skill[]): number {
    return (skills.find(s => s.type === "armor-mastery")?.level ?? 0) * 0.1;
}

export type SkillSpec<T extends Skill> = Omit<T, "level"> & { 
    levelProgression: number 
}

export function calculateSkill<T extends Skill>(skillSpec: SkillSpec<T>, level: number): Skill {
    const { levelProgression, ...res} = skillSpec;
    return {
        ...res,
        level: Math.floor(levelProgression * level),
    };
}