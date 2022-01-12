import { Actor } from "./actor";

export interface Action {
  execute(executor: Actor, target: Actor): string;
}
