import { Stats } from "./stats";
import { ActionFactory } from "./action";

export class Actor {
  public currentHealth: number;
  public currentExp: number;
  public currentLevel: number;

  constructor(
    public readonly name: string,
    public readonly stats: Stats,
    public readonly possibleActions: ActionFactory[], 
    public readonly levelProgression?: Stats,
  ) {
    this.currentHealth = stats.maxHealth;
    this.currentExp = 0;
    this.currentLevel = 1;
  }
  // TODO: Should this be a getter?
  public requiredExp(): number {
    return this.currentLevel * 100;
  }

  public isAlive(): boolean {
    return this.currentHealth > 0;
  }
}
