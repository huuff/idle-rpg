import { Stats } from "./stats";
import { Action } from "./action";

export interface Actor {
  name: string;
  currentHealth: number;
  stats: Stats;
  actions: Action[];
}

export function isAlive(actor: Actor): boolean {
  return actor.currentHealth > 0;
}
