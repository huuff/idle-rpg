import { Stats } from "./stats";
import { Action } from "./action";

export interface Actor {
  name: string;
  currentHealth: number;
  stats: Stats;
  actions: Action[];
}
