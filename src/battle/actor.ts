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
  ) {
    this.currentHealth = stats.maxHealth;
    this.currentExp = 0;
    this.currentLevel = 1;
  }

  public requiredExp(): number {
    return this.currentLevel * 100;
  }
}

export function isAlive(actor: Actor): boolean {
  return actor.currentHealth > 0;
}
