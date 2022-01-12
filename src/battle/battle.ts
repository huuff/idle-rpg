import { Ref } from "vue";
import { Actor, isAlive } from "./actor";
import { chooseRandom } from "@/util/random";
import { calculateTurns } from "./turns";

export class Battle {
  private interval: ReturnType<typeof setInterval> | undefined;
  private turns: Actor[];
  
  constructor(
    private readonly goodGuys: Actor[],
    private readonly badGuys: Actor[],
    private readonly battleLog: Ref<string[]>,
  ) {
    this.turns = calculateTurns([...goodGuys, ...badGuys]);
  }

  private tick(): void {
    const aliveGoodGuys = this.goodGuys.filter(isAlive);
    const aliveBadGuys = this.badGuys.filter(isAlive);

    if (this.checkForFinalization(aliveGoodGuys, aliveBadGuys))
      return;

    if (this.turns.length === 0)
      this.turns = calculateTurns([ ...aliveGoodGuys, ...aliveBadGuys]);

    const attacker = this.turns.pop()!;
    const target = this.badGuys.includes(attacker) ? chooseRandom(aliveGoodGuys) : chooseRandom(aliveBadGuys);

    this.battleLog.value.push(chooseRandom(attacker.actions).execute(attacker, target));

    if (target.currentHealth <= 0) {
      this.turns = this.turns.filter(isAlive);
      this.battleLog.value.push(`${attacker.name} killed ${target.name}!`)
    }
  }

  public start(): void {
    this.interval = setInterval(() => this.tick(), 500);
  }

  public stop(): void {
    clearInterval(this.interval);
  }

  private checkForFinalization(aliveGoodGuys: Actor[], aliveBadGuys: Actor[]): boolean {
    if (aliveBadGuys.length === 0 || aliveGoodGuys.length === 0) {
      const message = aliveBadGuys.length === 0 ? "You won!" : "You lost";
      this.battleLog.value.push(message);
      this.stop();
      return true;
    } else {
      return false;
    }
  }
}
