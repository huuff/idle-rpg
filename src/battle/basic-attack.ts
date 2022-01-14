import { Action, ActionFactory } from "./action";
import { Creature } from "@/creatures/creature";
import { randomBetween } from "@/util/random";

export class BasicAttack implements ActionFactory {
  create(executor: Creature, target: Creature): Action {
    return { 
      executor, target,
      damage: this.calculateDamage(executor),
      description: "attacks"
    }
  }

  // The damage varies by a 10% of the executor's strength
  private calculateVariability(executor: Creature): number {
    return Math.round(Math.random() * (executor.stats.strength * 0.1));
  }

  private calculateDamage(executor: Creature): number {
    const variability = this.calculateVariability(executor);
    const min = executor.stats.strength - variability;
    const max = executor.stats.strength + variability;
    return Math.round(randomBetween(min, max));
  }

}
