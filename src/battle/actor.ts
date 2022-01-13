import { Stats } from "./stats";
import { ActionFactory } from "./action";

export interface Actor {
  name: string;
  currentHealth: number;
  stats: Stats;
  possibleActions: ActionFactory[];
}

export function isAlive(actor: Actor): boolean {
  return actor.currentHealth > 0;
}
