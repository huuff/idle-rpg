import { Scene } from "@/scene";
import { BattleLog } from "./battle-log";
import { Actor, } from "./actor";
import { chooseRandom } from "@/util/random";
import { calculateTurns } from "./turns";
import { executeAction } from "./action";

export class Battle implements Scene {
  private turns: Actor[];
  
  constructor(
    private readonly goodGuys: Actor[],
    private readonly badGuys: Actor[],
    private readonly battleLog: BattleLog,
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

  public isOver(): boolean {
    const winner = this.winner();
    if (!winner)
      return false
    else {
      const winner = this.winner();
      if (winner === "PLAYER") {
        this.battleLog.push("You won!");
        this.shareExp();
      } else if (winner === "ENEMY") {
        this.battleLog.push("You lost!");
      }
      return true;
    }
  }

  private winner(): "PLAYER" | "ENEMY" | undefined {
    if (this.goodGuys.filter(a => a.isAlive()).length === 0)
      return "ENEMY";
    else if (this.badGuys.filter(a => a.isAlive()).length === 0)
      return "PLAYER";
  }

  // FUTURE: Shoul work for several good guys
  private shareExp(): void {
    this.goodGuys[0].currentExp += this.badGuys
      .map(actor => actor.stats.challenge ?? 0)
      .reduce((acc, challenge) => acc + challenge)
      ;
    this.goodGuys.map(a => a.adjustLevel());
  }
}
