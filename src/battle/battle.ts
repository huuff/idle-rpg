import { reactive } from "vue";
import { useMainStore } from "@/store";
import { Creature, } from "@/creatures/creature";
import { chooseRandom } from "@/util/random";
import { calculateTurns } from "./turns";
import { executeAction } from "./action";
import { Tickable } from "@/ticking/async-ticker";
import {Scene} from "@/scenes/scene";
import {makeBattleScene} from "@/scenes/battle-scene";
import { renameCreatures } from "@/creatures/rename-creatures";

function allDead(creatures: Creature[]) {
  return creatures.every(c => !c.isAlive());
}

export class Battle implements Tickable {
  public readonly scene: Scene;
  public readonly badGuys: Creature[];
  private readonly log = useMainStore().battleLog;
  private turns: Creature[];
  
  constructor(
    public readonly goodGuys: Creature[],
    badGuys: Creature[],
  ) {
    this.log.clear();
    this.badGuys = reactive(renameCreatures(badGuys));
    this.turns = calculateTurns([...this.goodGuys, ...this.badGuys]);
    this.scene = makeBattleScene(this.badGuys);
  }

  public firstTick(): void {
    const enemyNames = this.badGuys
                        .map(a => a.name)
                        .join(", ");
    this.log.messages.push(`${enemyNames} appear!`);
  }

  public tick(): void {
    const aliveGoodGuys = this.goodGuys.filter(a => a.isAlive());
    const aliveBadGuys = this.badGuys.filter(a => a.isAlive());

    if (this.turns.length === 0)
      this.turns = calculateTurns([ ...aliveGoodGuys, ...aliveBadGuys]);

    const attacker = this.turns.pop()!;
    const target = this.badGuys.includes(attacker) ? chooseRandom(aliveGoodGuys) : chooseRandom(aliveBadGuys);

    const action = chooseRandom(attacker.possibleActions).create(attacker, target);
    executeAction(action, this.log);

    if (target.currentHealth <= 0) {
      this.turns = this.turns.filter(a => a.isAlive());
      this.log.messages.push(`${attacker.name} killed ${target.name}!`)
    }
  }
  
  public isOver(): boolean {
    return allDead(this.goodGuys) || allDead(this.badGuys);
  }

  public lastTick(): void {
    if (allDead(this.goodGuys)) {
      this.log.messages.push("You lost!");
    } else if (allDead(this.badGuys)) {
      this.log.messages.push("You won!");
      this.shareExp();
    } else {
      throw new Error("Called Battle's `endTick` but all teams are still alive!");
    }
  }

  // FUTURE: Should work for several good guys
  private shareExp(): void {
    this.goodGuys[0].currentExp += this.badGuys
      .map(creature => creature.stats.challenge ?? 0)
      .reduce((acc, challenge) => acc + challenge)
      ;
    this.goodGuys.map(a => a.adjustLevel());
  }
}
