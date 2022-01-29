import stats, { Stats } from "./stats";
import { JobClass, noClass, isNoClass } from "./job-class";
import { Species, noSpecies, isNoSpecies } from "./species";
import inventory, { 
  Inventory,
  singleItem, 
} from "@/items/inventory";
import equipment, { Equipment } from "@/items/equipment";
import { BattleAction } from "@/battle/battle-action";
import load, { Load } from "@/items/load";
import { calculateSkill, Skill, } from "@/skills/skill";
import ActionSkills, { ActionSkill } from "@/skills/action-skill";

export type CreatureInitialData = {
  species: Species;
  level?: number;
  name?: string;
  jobClass?: JobClass;
  items?: Inventory
}

export interface Creature {
  readonly species: Species;
  readonly jobClass: JobClass,
  inventory: Inventory,
  readonly stats: Required<Stats>;
  readonly healthRatio: number;
  readonly possibleActions: BattleAction[];
  readonly level: number;
  readonly isAlive: boolean;
  readonly requiredExp: number;
  readonly equipment: Equipment;
  readonly load: Load;
  readonly skills: Skill[];
  name: string;
  currentHealth: number;
  currentExp: number;
}

export class CreatureImpl implements Creature {
  public readonly species: Species;
  public readonly jobClass: JobClass;
  public inventory: Inventory;

  public level: number;
  // Not readonly so they can be renamed in battle
  public name: string;

  public currentHealth: number;
  public _currentExp = 0;

  constructor({ 
      species,
      name,
      level = 1,
      jobClass = noClass,
      items,
    }: CreatureInitialData) {
    this.name = name ?? species.name;
    this.species = species;
    this.jobClass = jobClass;
    this.level = level;
    this.inventory = items ?? {};
    // XXX: Only if it's a new creature we don't have items
    // so we add those of its species and class
    if (!items) {
      this.inventory = inventory.plus(this.inventory, species.naturalItems ?? []);
      this.inventory = inventory.plus(this.inventory, this.jobClass.baseEquipment?.map(singleItem) ?? [])
    }
    this.currentHealth = this.stats.maxHealth;
  }

  public get stats() {
    return stats.totalize(stats.round(stats.plus(
        stats.calculateByLevel(this.species, this.level),
        stats.calculateByLevel(this.jobClass, this.level),
        equipment.stats(this.equipment)
      )));
  }

  public get equipment() {
    return equipment.from(this.inventory);
  }

  public get healthRatio() {
    return this.currentHealth / this.stats.maxHealth;
  }
  public get requiredExp() {
    return this.level * 100;
  }

  public get possibleActions(): BattleAction[] {
    const naturalActions = this.species.naturalActions;
    const equipmentActions = equipment.battleActions(this.equipment);
    const classActions = this.jobClass.battleActions ?? [];
    const skillActions = this.skills
      .filter(ActionSkills.isActionSkill)
      .map(s => ActionSkills.toBattleAction(s as ActionSkill));
    return equipmentActions.concat(classActions).concat(skillActions).concat(naturalActions);
  }

  public get skills(): Skill[] {
    return this.jobClass.skills?.map(s => calculateSkill(s, this.level)) ?? []
  }

  public get load(): Load {
    return {
      current: load.total(this.equipment),
      max: load.creatureCapacity(this),
    }
  }

  public get currentExp() {
    return this._currentExp;
  }

  public set currentExp(newExp: number) {
    if (newExp >= this.requiredExp) {
      const excedingExp = newExp - this.requiredExp;
      this.level++;
      this._currentExp = excedingExp;
      this.currentHealth += (this.species.levelProgression.maxHealth ?? 0) + (this.jobClass.levelProgression.maxHealth ?? 0);
    } else {
      this._currentExp = newExp;
    }
  }

  public get isAlive(): boolean {
    return this.currentHealth > 0;
  }
}

// Null object pattern
export const noCreature = new CreatureImpl({ species: noSpecies });

export function isNoCreature(creature: Creature) {
  return creature.name === "None"
        && isNoSpecies(creature.species)
        && isNoClass(creature.jobClass)
        ;
}
