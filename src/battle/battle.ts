import { useMainStore } from "@/store";
import { Creature, } from "@/creatures/creature";
import { chooseRandom } from "@/util/random";
import { calculateTurns } from "./turns";
import { executeAction } from "./action";
import { Tickable } from "@/ticker";

// TODO: This should take the responsibility of naming the
// enemies (as 1, 2, 3, etc) instead of doing it in the stage
// Since it's a property that's only for presentation
export class Battle implements Tickable {
  private readonly log = useMainStore().log;
  private turns: Creature[];
  
  constructor(
    public readonly goodGuys: Creature[],
    public readonly badGuys: Creature[],
  ) {
    this.turns = calculateTurns([...goodGuys, ...badGuys]);
  }

  public firstTick(): void {
    const enemyNames = this.badGuys
                        .map(a => a.name)
                        .join(", ");
    this.log.push(`${enemyNames} appear!`);
  }

  public tick() {
    const aliveGoodGuys = this.goodGuys.filter(a => a.isAlive());
    const aliveBadGuys = this.badGuys.filter(a => a.isAlive());

    if (this.turns.length === 0)
      this.turns = calculateTurns([ ...aliveGoodGuys, ...aliveBadGuys]);

    const attacker = this.turns.pop()!;
    const target = this.badGuys.includes(attacker) ? chooseRandom(aliveGoodGuys) : chooseRandom(aliveBadGuys);

    const action = chooseRandom(attacker.possibleActions).create(attacker, target);
    executeAction(action);

    if (target.currentHealth <= 0) {
      this.turns = this.turns.filter(a => a.isAlive());
      this.log.push(`${attacker.name} killed ${target.name}!`)
    }
  }

  public isOver(): boolean {
    if (this.goodGuys.filter(a => a.isAlive()).length === 0) {
      this.log.push("You lost!");
      return true;
    } else if (this.badGuys.filter(a => a.isAlive()).length === 0) {
      this.log.push("You won!");
      this.shareExp();
      return true;
    } else {
      return false;
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
