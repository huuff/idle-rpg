import { Actor, isAlive } from "./actor";
import { chooseRandom } from "@/util/random";

export class Battle {
  private interval: ReturnType<typeof setInterval> | undefined;
  
  constructor(
    private readonly goodGuys: Actor[],
    private readonly badGuys: Actor[],
  ) {}

  private tick(): void {
    const aliveGoodGuys = this.goodGuys.filter(isAlive);
    const aliveBadGuys = this.badGuys.filter(isAlive);

    if (this.checkForFinalization(aliveGoodGuys, aliveBadGuys))
      return;

    const attacker = chooseRandom([ ...aliveGoodGuys, ...aliveBadGuys ]);
    const target = this.badGuys.includes(attacker) ? chooseRandom(aliveGoodGuys) : chooseRandom(aliveBadGuys);

    chooseRandom(attacker.actions).execute(attacker, target);

    if (target.currentHealth <= 0) 
      console.log(`${attacker.name} killed ${target.name}!`)
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
      console.log(message);
      this.stop();
      return true;
    } else {
      return false;
    }
  }
}
