import { h, VNode } from "vue";
import { Scene } from "@/scene";
import { Creature } from "@/creatures/creature";

export class Rest implements Scene {
  
  constructor(
    private readonly creature: Creature,
  ) {}

  public tick(): void {
    this.creature.currentHealth++;
  }

  public isOver(): boolean {
    return this.creature.currentHealth >= this.creature.stats.maxHealth;
  }

  public mainView(): VNode {
    return h("h1", {}, "You are resting");
  }
}
