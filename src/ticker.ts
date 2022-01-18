import { useMainStore } from "@/store";

export interface Tickable {
  firstTick?: () => void;
  // A Tickable can be recursive, and thus return a
  // new Tickable that will need to be completed before
  // going on
  tick: () => void | CallbackTickable;
  lastTick?: () => void;
  isOver: () => boolean;
}

export type CallbackTickable = {
  tickable: Tickable,
  callback?: () => void,
}

// TODO A good way of doing first tick
export class Ticker {
  private readonly tickDuration: number;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private tickableStack: CallbackTickable[];

  constructor(
    callbackTickable: CallbackTickable,
  ) {
    ({tickDuration: this.tickDuration} = useMainStore());
    this.tickableStack = [ callbackTickable ];
    this.start();
  }

  public stop(): void {
    clearTimeout(this.timer);
  }


  private start() {
    this.setTimer();
  }

  private get isOver() {
    return this.tickableStack.length === 0;
  }

  private get currentTickable() {
    return this.tickableStack[this.tickableStack.length - 1];
  }

  private tick(): void {
    if (this.isOver) {
      return;
    }


    if (this.currentTickable.tickable.isOver()) {
      if (this.currentTickable.tickable.lastTick) {
        this.currentTickable.tickable.lastTick();
        this.setTimer({
          func: () => {
            this.currentTickable.callback && this.currentTickable.callback();
            this.tickableStack.pop();
            this.tick();
          },
          duration: this.tickDuration * 2,
        }) 
        return;
      } else {
        this.currentTickable.callback && this.currentTickable.callback(),
        this.tickableStack.pop();
        this.tick();
        return;
      }
    }

    const tickResult = this.currentTickable.tickable.tick();

    if (tickResult) {
      this.tickableStack.push(tickResult); 
    }

    this.setTimer();
  }

  private setTimer({
    func = this.tick.bind(this),
    duration = this.tickDuration,
  } : { 
    func?: () => void,
    duration?: number
    } = {}): void {
    this.timer = setTimeout(func, duration);
  }

}
