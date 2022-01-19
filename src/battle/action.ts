import { Log } from "@/log";
import { Creature } from "@/creatures/creature";

export interface ActionFactory {
  create(executor: Creature, target: Creature): Action;
}

export interface Action {
  executor: Creature;
  target: Creature;
  damage: number;
  description: string;
}

export function executeAction(action: Action, log: Log) {
  action.target.currentHealth -= action.damage;
  log.messages.push(`${action.executor.name} ${action.description} ${action.target.name} for ${action.damage} damage!`);
}
