import { Scene } from "@/scene";
import { Actor } from "@/battle/actor";

export class Rest implements Scene {
  
  constructor(
    private readonly actor: Actor,
  ) {}

  public tick(): void {
    this.actor.currentHealth++;
  }

  public isOver(): boolean {
    return this.actor.currentHealth >= this.actor.stats.maxHealth;
  }
}
