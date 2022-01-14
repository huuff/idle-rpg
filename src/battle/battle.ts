import { Scene } from "@/scene";
import {h, VNode, reactive } from "vue";
import { BattleLogImpl } from "./battle-log";
import { Actor, } from "./actor";
import { chooseRandom } from "@/util/random";
import { calculateTurns } from "./turns";
import { executeAction } from "./action";
import BattleView from "@/components/scenes/BattleView.vue";
import EnemyHealth from "@/components/scenes/EnemyHealth.vue";

export class Battle implements Scene {
  private turns: Actor[];
  private readonly battleLog = new BattleLogImpl();
  
  constructor(
    private readonly goodGuys: Actor[],
    private readonly badGuys: Actor[],
  ) {
    this.turns = calculateTurns([...goodGuys, ...badGuys]);
  }

  public tick() {
    const aliveGoodGuys = this.goodGuys.filter(a => a.isAlive());
    const aliveBadGuys = this.badGuys.filter(a => a.isAlive());

    if (this.turns.length === 0)
      this.turns = calculateTurns([ ...aliveGoodGuys, ...aliveBadGuys]);

    const attacker = this.turns.pop()!;
    const target = this.badGuys.includes(attacker) ? chooseRandom(aliveGoodGuys) : chooseRandom(aliveBadGuys);

    const action = chooseRandom(attacker.possibleActions).create(attacker, target);
    executeAction(action, this.battleLog);

    if (target.currentHealth <= 0) {
      this.turns = this.turns.filter(a => a.isAlive());
      this.battleLog.push(`${attacker.name} killed ${target.name}!`)
    }
  }

  public mainView(): VNode {
    return h(BattleView, { log: reactive(this.battleLog) });
  }

  public secondaryView(): VNode {
    return h(EnemyHealth, { enemies: reactive(this.badGuys)}) ;
  }

  public isOver(): boolean {
    if (this.goodGuys.filter(a => a.isAlive()).length === 0) {
      this.battleLog.push("You lost!");
      return true;
    } else if (this.badGuys.filter(a => a.isAlive()).length === 0) {
      this.battleLog.push("You won!");
      this.shareExp();
      return true;
    } else {
      return false;
    }
  }

  // FUTURE: Should work for several good guys
  private shareExp(): void {
    this.goodGuys[0].currentExp += this.badGuys
      .map(actor => actor.stats.challenge ?? 0)
      .reduce((acc, challenge) => acc + challenge)
      ;
    this.goodGuys.map(a => a.adjustLevel());
  }
}
