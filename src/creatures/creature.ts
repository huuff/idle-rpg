import StatsOps, { Stats } from "./stats";
import { JobClass, noClass } from "./job-class";
import { Species, noSpecies } from "./species";
import Inventories, { Inventory, } from "@/items/inventory";
import Equipments, { Equipment } from "@/items/equipment";
import { BattleAction } from "@/battle/battle-action";
import LoadOps, { Load } from "@/items/load";
import Skills, { Skill, } from "@/skills/skill";
import ActionSkills, { ActionSkill } from "@/skills/action-skill";
import { BattleStatus } from "@/battle/battle-status";
import { useCreaturesStore } from "@/creatures-store";

export const PLAYER_ID = "1";
export const NO_CREATURE_ID = "0";

export interface Creature {
  id: string;
  species: Species;
  jobClass: JobClass,
  inventory: Inventory,
  level: number;
  name: string;
  battleStatus?: BattleStatus;
  currentHealth: number;
  currentExp: number;
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
function addExp(creature: Creature, exp: number): void {
  if (exp < 0) {
    throw new Error(`Passed negative exp to 'addExp'! Value: ${exp}`)
  }

  const newExp = creature.currentExp + exp;
  const required = requiredExp(creature);
  if (newExp >= required) {
    const excedingExp = newExp - required;
    creature.level++;
    creature.currentExp = excedingExp;
    creature.currentHealth += (creature.species.levelProgression.maxHealth ?? 0) + (creature.jobClass.levelProgression.maxHealth ?? 0);
  } else {
    creature.currentExp = newExp;
  }
}


function birth({
  id = randomId(),
  species,
  name,
  level = 1,
  jobClass = noClass,
}: {
  id?: string,
  species: Species,
  name?: string,
  level?: number,
  jobClass?: JobClass,
}): Creature {
  const inventory: Inventory = {};
  if (species.naturalItems) {
    Inventories.add(inventory, species.naturalItems);
  }

  if (jobClass.baseEquipment) {
    Inventories.add(inventory, jobClass.baseEquipment.map(Inventories.singleItem));
  }

  const creature: Creature = {
    id,
    species,
    name: name ?? species.name,
    level,
    jobClass,
    currentExp: 0,
    battleStatus: undefined,
    currentHealth: 0,
    inventory
  }

  const maxHealth = stats(creature).maxHealth;
  // TODO: Improve this, maybe make stats take the necessary parts and not a full creature
  // so it can be built by parts
  creature.currentHealth = maxHealth;
  const creaturesStore = useCreaturesStore();
  creaturesStore.register(creature);

  return creature;
}

// Null object pattern
export const noCreature: Creature = {
  id: NO_CREATURE_ID,
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

export default {
  stats,
  equipment,
  load,
  birth,
  isAlive,
  healthRatio,
  isNoCreature,
  addExp,
  requiredExp,
  battleActions,
  skills,
}
