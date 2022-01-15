import { h, VNode } from "vue";
import { Scene } from "@/scene";
import { Creature } from "@/creatures/creature";
import { useMainStore } from "@/store";
import { Settlement } from "@/settlements/settlement";

export class Rest implements Scene {
  private readonly player: Creature;
  
  constructor(
    private readonly settlement: Settlement,
  ) {
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
