import { Tickable } from "@/scenes/tickable";
import { useMainStore } from "@/store";

export class Ticker {
  private readonly tickDuration: number;
  private tickable: Tickable | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private onEnd: (() => void) | undefined;

  constructor() {
    ({tickDuration: this.tickDuration} = useMainStore());
  }

  public start(tickable: Tickable, onEnd: () => void) {
    clearTimeout(this.timer);
    this.tickable = tickable;
    this.onEnd = onEnd;
    tickable.firstTick && tickable.firstTick();
    this.setTimer();
  }

  public stop(): void {
    clearTimeout(this.timer);
  }

  private tick(): void {
    if (this.tickable) {
      if (!this.tickable.isOver()) {
        this.tickable.tick();
        this.setTimer();
      } else {
        this.onEnd && this.onEnd();
      }
    }
  }

  private setTimer(): void {
    this.timer = setTimeout(this.tick.bind(this), this.tickDuration);
  }

}
