import { Actor } from "@/battle/actor";

// TODO: Dry, dome base class for tickers,
// tick duration is copypasted from BattleTicker
export class RestTicker {
  private restingActor: Actor | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private onEnd: (() => void) | undefined;  

  constructor(
    private readonly frameRate: number,
  ) {}

  public startResting(actor: Actor, onEnd: () => void) {
    this.restingActor = actor;
    this.onEnd = onEnd;
    this.timer = setTimeout(this.restTick.bind(this), this.tickDuration())
  }

  public stop() {
    clearTimeout(this.timer);
  }

  private restTick(): void {
    if (this.restingActor) {
      if (this.restingActor.currentHealth < this.restingActor.stats.maxHealth) {
        this.restingActor.currentHealth++;
        this.timer = setTimeout(this.restTick.bind(this), this.tickDuration());
      } else {
        this.onEnd && this.onEnd();
      }
    }
  }


  private tickDuration(): number {
    return Math.ceil(1000 / this.frameRate);
  }
}
