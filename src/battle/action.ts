import { BattleLog } from "./battle-log";
import { Actor } from "./actor";

export interface ActionFactory {
  create(executor: Actor, target: Actor): Action;
}

export interface Action {
  executor: Actor;
  target: Actor;
  damage: number;
  description: string;
}

export function executeAction(action: Action, battleLog: BattleLog) {
  action.target.currentHealth -= action.damage;
  battleLog.push(`${action.executor.name} ${action.description} ${action.target.name} for ${action.damage} damage!`);
}
