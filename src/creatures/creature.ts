import { Stats, calculateStats } from "./stats";
import { JobClass, noClass, isNoClass } from "./job-class";
import { Species, noSpecies, isNoSpecies } from "./species";

export class Creature {
  public currentHealth: number;
  public stats: Stats;
  public _currentExp: number;

  // And calculate stats with that
  // TODO: Immutable stats by calculating them each time?

  constructor(
    // Not readonly so they can be renamed in battle
    // TODO: Add a rename method instead? one that makes a copye
    // or use immer.js
    // TODO: Name could be optional and derived from species
    public name: string,
    public readonly species: Species,
    public level = 1,
    public readonly jobClass: JobClass = noClass,
  ) {
    this.stats = calculateStats(species, level).plus(calculateStats(jobClass, level));
    this.currentHealth = this.stats.maxHealth;
    this._currentExp = 0;
  }

  public get currentExp() {
    return this._currentExp;
  }
  public set currentExp(newExp: number) {
    this._currentExp = newExp > 0 ? newExp : 0;
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
      this.stats = this.stats
        .plus(this.species.levelProgression)
        .plus(this.jobClass.levelProgression);
      this.currentExp = excedingExp;
      this.currentHealth += this.species.levelProgression.maxHealth + this.jobClass.levelProgression.maxHealth;
    }
  }
}

// Null object pattern
export const noCreature = new Creature("None", noSpecies);

export function isNoCreature(creature: Creature) {
  return creature.name === "None"
        && isNoSpecies(creature.species)
        && isNoClass(creature.jobClass)
        ;
}
