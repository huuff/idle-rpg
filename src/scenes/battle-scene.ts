import { VNode, h } from "vue";
import { Scene } from "./scene";
import { Battle } from "@/battle/battle";
import BattleView from "@/components/scenes/BattleView.vue";
import EnemyHealth from "@/components/scenes/EnemyHealth.vue";

export class BattleScene implements Scene {
  
  constructor(
    private readonly battle: Battle,
  ) {}

  public mainView(): VNode {
    return h(BattleView, { });
  }

  public sideView(): VNode {
    return h(EnemyHealth, { enemies: this.battle.badGuys }) ;
  }
}
