import { BattleLog } from "./battle-log";
import { Actor, isAlive } from "./actor";
import { chooseRandom } from "@/util/random";
import { calculateTurns } from "./turns";
import { executeAction } from "./action";

export type BattleResult = "WON" | "LOST";

export class Battle {
  private turns: Actor[];
  
  constructor(
    private readonly goodGuys: Actor[],
    private readonly badGuys: Actor[],
    private readonly battleLog: BattleLog,
  ) {
    this.turns = calculateTurns([...goodGuys, ...badGuys]);
  }

  public tick(): BattleResult | "CONTINUE" {
    const aliveGoodGuys = this.goodGuys.filter(isAlive);
    const aliveBadGuys = this.badGuys.filter(isAlive);

    if (this.isOver()) {
      const winner = this.winner();
      if (winner === "PLAYER") {
        this.battleLog.push("You won!");
        return "WON";
      } else if (winner === "ENEMY") {
        this.battleLog.push("You lost!");
        return "LOST";
      }
    }

    if (this.turns.length === 0)
      this.turns = calculateTurns([ ...aliveGoodGuys, ...aliveBadGuys]);

    const attacker = this.turns.pop()!;
    const target = this.badGuys.includes(attacker) ? chooseRandom(aliveGoodGuys) : chooseRandom(aliveBadGuys);

    const action = chooseRandom(attacker.possibleActions).create(attacker, target);
    executeAction(action, this.battleLog);

    if (target.currentHealth <= 0) {
      this.turns = this.turns.filter(isAlive);
      this.battleLog.push(`${attacker.name} killed ${target.name}!`)
    }

    return "CONTINUE";
  }

  private isOver(): boolean {
    return !!this.winner();
  }

  private winner(): "PLAYER" | "ENEMY" | undefined {
    if (this.goodGuys.filter(isAlive).length === 0)
      return "ENEMY";
    else if (this.badGuys.filter(isAlive).length === 0)
      return "PLAYER";
  }
}
