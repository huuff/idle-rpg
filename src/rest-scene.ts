import { h, VNode } from "vue";
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

  public mainView(): VNode {
    return h("h1", {}, "You are resting");
  }
}
