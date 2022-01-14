import { Stats, addStats, zeroStats } from "./stats";
import { ActionFactory } from "@/battle/action";

export class Creature {
  public currentHealth: number;
  public _currentExp: number;
  public level: number;

  constructor(
    public readonly name: string,
    public stats: Stats,
    public readonly possibleActions: ActionFactory[], 
    public readonly levelProgression: Stats = zeroStats,
  ) {
    this.currentHealth = stats.maxHealth;
    this._currentExp = 0;
    this.level = 1;
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
      this.stats = addStats(this.stats, this.levelProgression);
      this.currentExp = excedingExp;
      this.currentHealth += this.levelProgression.maxHealth;
    }
  }
}