import { Action } from "./action";
import { Actor } from "./actor";

export class BasicAttack implements Action {
  execute(executor: Actor, target: Actor): void {
    const damage = Math.floor(Math.random() * executor.stats.strength);
    target.currentHealth -= damage;
    console.log(`${executor.name} attacks ${target.name} for ${damage}!`)
  }

}
