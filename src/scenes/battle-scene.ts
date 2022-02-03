import { h } from "vue";
import { Scene } from "./scene";
import BattleView from "@/components/scenes/BattleView.vue";
import EnemyHealth from "@/components/scenes/EnemyHealth.vue";
import {Creature} from "@/creatures/creature";

export function makeBattleScene(enemies: Readonly<Creature[]>): Scene {
  return {
    mainView: () => h(BattleView, {}),
    sideView: () => h(EnemyHealth, { enemies })
  } 
}

