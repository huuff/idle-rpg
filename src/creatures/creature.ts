import { Stats, zeroStats, areZeroStats } from "./stats";
import { ActionFactory } from "@/battle/action";
import { JobClass, noClass, isNoClass } from "./job-class";

export class Creature {
  public currentHealth: number;
  public stats: Stats;
  public _currentExp: number;

  // TODO: Take species instead of baseStats and levelProgression
  // And calculate stats with that
  // TODO: Immutable stats by calculating them each time?

  constructor(
    // Not readonly so they can be renamed in battle
    // TODO: Add a rename method instead? one that makes a copye
    // or use immer.js
    public name: string,
    baseStats: Stats,
    public readonly possibleActions: ActionFactory[], 
    public level = 1,
    public readonly levelProgression: Stats = zeroStats,
    public readonly jobClass: JobClass = noClass,
  ) {
    this.stats = baseStats.plus(levelProgression.times(level))
      .plus(jobClass.baseStats.plus(levelProgression.times(level)))
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

  public isAlive(): boolean {
    return this.currentHealth > 0;
  }

  public adjustLevel(): void {
    if (this.currentExp >= this.requiredExp) {
      const excedingExp = this.currentExp - this.requiredExp;
      this.level++;
      this.stats = this.stats.plus(this.levelProgression);
      this.currentExp = excedingExp;
      this.currentHealth += this.levelProgression.maxHealth;
    }
  }
}

// Null object pattern
export const noCreature = new Creature(
  "None",
  zeroStats,
  [],
);

export function isNoCreature(creature: Creature) {
  return creature.name === "None"
        && areZeroStats(creature.stats)
        && areZeroStats(creature.levelProgression)
        && creature.possibleActions.length === 0
        && isNoClass(creature.jobClass)
        ;
}
