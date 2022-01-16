import { h, VNode } from "vue";
import { Scene } from "@/scene";
import { Creature } from "@/creatures/creature";
import { useMainStore } from "@/store";
import { MapLocation } from "@/map/game-map";
import SettlementView from "@/components/scenes/SettlementView.vue";
import RestingOptions from "@/components/scenes/RestingOptions.vue";

export class Rest implements Scene {
  private readonly player: Creature;
  
  constructor(
    private readonly location: MapLocation,
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
    return h(
      SettlementView,
      { location: this.location }
    );
  }

  public secondaryView(): VNode {
    return h(RestingOptions, {});
  }
}
