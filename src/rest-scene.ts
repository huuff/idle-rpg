import { h, VNode } from "vue";
import { Scene } from "@/scene";
import { Creature } from "@/creatures/creature";
import { useMainStore } from "@/store";

export class Rest implements Scene {
  private readonly player: Creature;
  
  constructor() {
    ({ player: this.player} = useMainStore())
  }

  public tick(): void {
    this.player.currentHealth++;
  }

  public isOver(): boolean {
    return this.player.currentHealth >= this.player.stats.maxHealth;
  }

  public mainView(): VNode {
    return h("h1", {}, "You are resting");
  }
}
