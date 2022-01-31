import StatsOps, { Stats } from "./stats";
import { JobClass, noClass, isNoClass } from "./job-class";
import { Species, noSpecies, isNoSpecies } from "./species";
import Inventories, {  Inventory,} from "@/items/inventory";
import Equipments, { Equipment } from "@/items/equipment";
import { BattleAction } from "@/battle/battle-action";
import LoadOps, { Load } from "@/items/load";
import Skills, { Skill, } from "@/skills/skill";
import ActionSkills, { ActionSkill } from "@/skills/action-skill";
import { produce } from "immer";

export interface Creature {
  readonly id: string;
  readonly species: Species;
  readonly jobClass: JobClass,
  readonly inventory: Inventory,
  readonly level: number;
  readonly name: string;
  readonly currentHealth: number;
  readonly currentExp: number;
}

// Adding two so it's not possible that this creature is created with none (0) or player (1) ids
function randomId(): string {
  return (Math.round(Math.random() * 1_000_000) + 2).toString();
}

function stats(creature: Creature): Required<Stats> {
  return StatsOps.totalize(StatsOps.round(StatsOps.plus(
    StatsOps.calculateByLevel(creature.species, creature.level),
    StatsOps.calculateByLevel(creature.jobClass, creature.level),
    Equipments.stats(equipment(creature))
  )));
}

function equipment(creature: Creature): Equipment {
  return Equipments.from(creature.inventory);
}

function healthRatio(creature: Creature): number {
  return creature.currentHealth / stats(creature).maxHealth;
}

function isAlive(creature: Creature): boolean {
  return creature.currentHealth > 0;
}

function skills(creature: Creature): Skill[] {
  return creature.jobClass.skills?.map(s => Skills.calculateFromLevel(s, creature.level)) ?? []
}

function load(creature: Creature): Load {
  return {
    current: LoadOps.total(equipment(creature)),
    max: LoadOps.creatureCapacity(creature),
  }
}

function requiredExp(creature: Creature): number {
  return creature.level * 100;
}

function battleActions(creature: Creature): BattleAction[] {
  const naturalActions = creature.species.naturalActions;
  const equipmentActions = Equipments.battleActions(equipment(creature));
  const classActions = creature.jobClass.battleActions ?? [];
  const skillActions = skills(creature)
    .filter(ActionSkills.isActionSkill)
    .map(s => ActionSkills.toBattleAction(s as ActionSkill));
  return equipmentActions.concat(classActions).concat(skillActions).concat(naturalActions);
}

// TODO: Handle leveling up several levels at once
function addExp(creature: Creature, exp: number): Creature {
  if (exp < 0) {
    throw new Error(`Passed negative exp to 'addExp'! Value: ${exp}`)
  }

  return produce(creature, draft => {
    const newExp = draft.currentExp + exp;
    const required = requiredExp(draft);
    if (newExp >= required) {
      const excedingExp = newExp - required;
      draft.level++;
      draft.currentExp = excedingExp;
      draft.currentHealth += (draft.species.levelProgression.maxHealth ?? 0) + (draft.jobClass.levelProgression.maxHealth ?? 0);
    } else {
      draft.currentExp = newExp;
    }  
    return draft;
  })
}

function withHealth(creature: Creature, newHealth: number): Creature {
  return produce(creature, draft => {
    draft.currentHealth = newHealth;
  });
}

function healthDelta(creature: Creature, change: number): Creature {
  return withHealth(creature, creature.currentHealth + change);
}

function withInventory(creature: Creature, inventory: Inventory): Creature {
  return produce(creature, draft => {
    draft.inventory = inventory;
  })
}

function rename(creature: Creature, newName: string): Creature {
  return produce(creature, draft => {
    draft.name = newName;
  });
}

function birth({
  id = randomId(),
  species,
  name,
  level = 1,
  jobClass = noClass,
}: {
  id: string,
  species: Species,
  name?: string,
  level?: number,
  jobClass?: JobClass,
}): Creature {
  const creature: Creature =  {
    id,
    species,
    name: name ?? species.name,
    level,
    jobClass,
    currentExp: 0,
    currentHealth: 0,
    inventory: Inventories.plus(
      {},
      (species.naturalItems ?? []).concat(jobClass.baseEquipment?.map(Inventories.singleItem) ?? []),
    )
  }

  const maxHealth = stats(creature).maxHealth;
  return withHealth(creature, maxHealth);
}

// Null object pattern
export const noCreature: Creature = {
  id: "0",
  species: noSpecies,
  jobClass: noClass,
  name: "None",
  inventory: {},
  level: 0,
  currentExp: 0,
  currentHealth: 0,
}

function isNoCreature(creature: Creature): boolean {
  return creature.id === "0";
}

function isPlayer(creature: Creature): boolean {
  return creature.id === "1";
}

export default {
  stats,
  equipment,
  load,
  birth,
  isAlive,
  withHealth,
  healthDelta,
  healthRatio,
  isNoCreature,
  withInventory,
  addExp,
  battleActions,
  rename,
  skills,
}
