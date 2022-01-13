import { Battle, BattleResult } from "@/battle/battle";

export type BattleEndCallback = (result: BattleResult) => void;

export class Ticker {
  private currentBattle: Battle | undefined;
  private onEnd: BattleEndCallback | undefined;
  private timer: number | undefined;

  constructor(
    private readonly frameRate: number,
  ) {}

  public startBattle(battle: Battle, onEnd: BattleEndCallback) {
    this.currentBattle = battle;
    this.onEnd = onEnd;
    this.timer = setTimeout(this.battleTick.bind(this), this.tickDuration());
  }

  public stop() {
    clearInterval(this.timer);
  }

  private battleTick(): void {
    if (this.currentBattle) {
      const tickResult = this.currentBattle.tick();
      if (tickResult === "CONTINUE")
        this.timer = setTimeout(this.battleTick.bind(this), this.tickDuration());
      else 
        this.onEnd && this.onEnd(tickResult);
    }
  }

  private tickDuration(): number {
    return Math.ceil(1000 / this.frameRate);
  }
}
