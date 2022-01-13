import { Battle } from "@/battle/battle";

export class Ticker {
  private currentBattle: Battle | undefined;
  private timer: number | undefined;

  constructor(
    private readonly frameRate: number,
  ) {}

  public startBattle(battle: Battle) {
    this.currentBattle = battle;
    this.timer = setTimeout(this.battleTick.bind(this), this.tickDuration());
  }

  public stop() {
    clearInterval(this.timer);
  }

  private battleTick(): void {
    console.log("TICKING");
    if (this.currentBattle) {
      const tickResult = this.currentBattle.tick();
      if (tickResult === "CONTINUE")
        this.timer = setTimeout(this.battleTick.bind(this), this.tickDuration());
    }
  }

  private tickDuration(): number {
    return Math.ceil(1000 / this.frameRate);
  }
}
