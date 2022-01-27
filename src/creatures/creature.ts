import stats, { Stats } from "./stats";
import { JobClass, noClass, isNoClass } from "./job-class";
import { Species, noSpecies, isNoSpecies } from "./species";
import inventory, { 
  Inventory,
  singleInventoryItem, 
} from "@/items/inventory";
import equipment, {Equipment} from "@/items/equipment";
import { BattleAction } from "@/battle/battle-action";
import { isEmpty } from "lodash";

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
      this.inventory = inventory.plus(this.inventory, this.jobClass.baseEquipment?.map(singleInventoryItem) ?? [])
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

  public get possibleActions() {
    // Prefer equipment actions to natural actions since they are likely to be better
    // (or else you wouldn't have that equipped)
    const equipmentActions = equipment.battleActions(this.equipment);
    if (!isEmpty(equipmentActions))
      return equipmentActions.concat(this.jobClass.battleActions ?? []);
    else 
      return this.species.naturalActions.concat(this.jobClass.battleActions ?? []);
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
