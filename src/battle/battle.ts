import { useMainStore } from "@/store";
import { Creature, } from "@/creatures/creature";
import { chooseRandom } from "@/util/random";
import { calculateTurns } from "./turns";
import { executeAction } from "./action";
import { Tickable } from "@/ticking/async-ticker";
import {Scene} from "@/scenes/scene";
import {makeBattleScene} from "@/scenes/battle-scene";

function allDead(creatures: Creature[]) {
  return creatures.every(c => !c.isAlive());
}

// TODO: This should take the responsibility of naming the
// enemies (as 1, 2, 3, etc) instead of doing it in the stage
// Since it's a property that's only for presentation
export class Battle implements Tickable {
  public readonly scene: Scene;

  private readonly log = useMainStore().battleLog;
  private turns: Creature[];
  
  constructor(
    public readonly goodGuys: Creature[],
    public readonly badGuys: Creature[],
  ) {
    this.log.clear();
    this.turns = calculateTurns([...goodGuys, ...badGuys]);
    this.scene = makeBattleScene(badGuys);
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
