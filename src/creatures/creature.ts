import { Stats, calculateStats } from "./stats";
import { JobClass, noClass, isNoClass } from "./job-class";
import { Species, noSpecies, isNoSpecies } from "./species";

export type CreatureInitialData = {
  species: Species;
  level?: number;
  name?: string;
  jobClass?: JobClass;
}

export class Creature {
  public readonly species: Species;
  public readonly jobClass: JobClass;

  public level: number;
  // Not readonly so they can be renamed in battle
  // TODO: Add a rename method instead? one that makes a copye
  // or use immer.js
  public name: string;

  public currentHealth: number;
  public currentExp = 0;

  constructor({ 
      species,
      name,
      level = 1,
      jobClass = noClass,
    }: CreatureInitialData) {
    this.name = name ?? species.name;
    this.species = species;
    this.jobClass = jobClass;
    this.level = level;
    this.currentHealth = this.stats.maxHealth;
  }

  public get stats() {
    return calculateStats(this.species, this.level)
      .plus(calculateStats(this.jobClass, this.level))
  }

  public get healthRatio() {
    return this.currentHealth / this.stats.maxHealth;
  }
  public get requiredExp() {
    return this.level * 100;
  }

  public get possibleActions() {
    return this.species.naturalActions;
  }

  public isAlive(): boolean {
    return this.currentHealth > 0;
  }

  public adjustLevel(): void {
    if (this.currentExp >= this.requiredExp) {
      const excedingExp = this.currentExp - this.requiredExp;
      this.level++;
      this.currentExp = excedingExp;
      this.currentHealth += this.species.levelProgression.maxHealth + this.jobClass.levelProgression.maxHealth;
    }
  }
}

// Null object pattern
export const noCreature = new Creature({ species: noSpecies });

export function isNoCreature(creature: Creature) {
  return creature.name === "None"
        && isNoSpecies(creature.species)
        && isNoClass(creature.jobClass)
        ;
}
