import { Creature } from "@/creatures/creature";
import { useMainStore } from "@/store";
import { Tickable } from "@/ticker";

export class Rest implements Tickable {
  private readonly player: Creature;
  
  constructor() {
    const store = useMainStore();
    this.player = store.player; //TODO: Maybe I should pass this in the constructor
  }

  public tick(): void {
    this.player.currentHealth++;
  }

  public isOver(): boolean {
    return this.player.currentHealth >= this.player.stats.maxHealth;
  }
}
