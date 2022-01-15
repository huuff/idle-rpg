import { useMainStore } from "@/store";
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

export function executeAction(action: Action) {
  action.target.currentHealth -= action.damage;
  useMainStore().log.push(`${action.executor.name} ${action.description} ${action.target.name} for ${action.damage} damage!`);
}
