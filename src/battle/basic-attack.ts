import { Action } from "./action";
import { Actor } from "./actor";
import { randomBetween } from "@/util/random";

export class BasicAttack implements Action {
  execute(executor: Actor, target: Actor): void {
    const damage = this.calculateDamage(executor);
    target.currentHealth -= damage;
    console.log(`${executor.name} attacks ${target.name} for ${damage}!`)
  }

  // The damage varies by a 10% of the executor's strength
  private calculateVariability(executor: Actor): number {
    return Math.round(Math.random() * (executor.stats.strength * 0.1));
  }

  private calculateDamage(executor: Actor): number {
    const variability = this.calculateVariability(executor);
    const min = executor.stats.strength - variability;
    const max = executor.stats.strength + variability;
    return Math.round(randomBetween(min, max));
  }

}
