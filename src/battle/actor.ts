import { Stats } from "./stats";
import { ActionFactory } from "./action";

export class Actor {
  public currentHealth: number;

  constructor(
    public readonly name: string,
    public readonly stats: Stats,
    public readonly possibleActions: ActionFactory[], 
  ) {
    this.currentHealth = stats.maxHealth;
  }
}

export function isAlive(actor: Actor): boolean {
  return actor.currentHealth > 0;
}
