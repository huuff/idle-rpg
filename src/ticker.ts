import { useMainStore } from "@/store";

export interface Tickable {
  firstTick?: () => void;
  // A Tickable can be recursive, and thus return a
  // new Tickable that will need to be completed before
  // going on
  tick: () => void | Ticker;
  lastTick?: () => void;
  isOver: () => boolean;
}

export class Ticker {
  private readonly tickDuration: number;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private readonly tickable: Tickable,
    private readonly onEnd?: () => void,
  ) {
    ({tickDuration: this.tickDuration} = useMainStore());
    this.start();
  }

  public stop(): void {
    clearTimeout(this.timer);
  }


  private start() {
    this.tickable.firstTick && this.tickable.firstTick();
    this.setTimer(this.tickable);
  }

  private tick(): void {
    if (!this.tickable.isOver()) {
      const tickResult = this.tickable.tick();
      if (tickResult) {
        tickResult
      }
    }
  }

  private setTimer(tickable: Tickable): void {
    this.timer = setTimeout(tickable.tick.bind(tickable), this.tickDuration);
  }

}
