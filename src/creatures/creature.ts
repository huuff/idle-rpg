import { Stats, zeroStats, } from "./stats";
import { ActionFactory } from "@/battle/action";

export class Creature {
  public currentHealth: number;
  public stats: Stats;
  public _currentExp: number;

  constructor(
    public readonly name: string,
    baseStats: Stats,
    public readonly possibleActions: ActionFactory[], 
    public level = 1,
    public readonly levelProgression: Stats = zeroStats,
  ) {
    this.stats = baseStats.plus(levelProgression.times(level))
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
