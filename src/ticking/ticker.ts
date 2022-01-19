import { tickDuration, longTickDuration } from "./tick-times";

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

export class Ticker {
  private timer: ReturnType<typeof setTimeout> | undefined;
  private tickableStack: CallbackTickable[];

  constructor(
    callbackTickable: CallbackTickable,
  ) {
    this.tickableStack = [ callbackTickable ];
    this.startTickable();
  }

  public stop(): void {
    clearTimeout(this.timer);
  }

  private get isOver() {
    return this.tickableStack.length === 0;
  }

  private get currentTickable() {
    return this.tickableStack[this.tickableStack.length - 1].tickable;
  }

  private get currentTickableCallback() {
    return this.tickableStack[this.tickableStack.length - 1].callback;
  }

  private tick(): void {
    if (this.isOver) {
      return;
    }


    if (this.currentTickable.isOver()) {
      this.endTickable();
      return;
    }

    const tickResult = this.currentTickable.tick();

    if (tickResult) { 
      this.tickableStack.push(tickResult); 
      this.startTickable();
    } else {
      this.setTimer();
    }
  }

  private startTickable(): void {
    if (this.currentTickable.firstTick) {
      this.currentTickable.firstTick();
      this.setTimer({ duration: longTickDuration })
    } else {
      this.setTimer();
    }
  }

  private endTickable(): void {
    if (this.currentTickable.lastTick) {
      this.currentTickable.lastTick();
      this.setTimer({
        func: () => {
          this.currentTickableCallback && this.currentTickableCallback();
          this.tickableStack.pop();
          this.tick();
        },
        duration: longTickDuration,
      }) 
    } else {
      this.currentTickableCallback && this.currentTickableCallback();
      this.tickableStack.pop();
      this.tick();
    }
  }

  private setTimer({
    func = this.tick.bind(this),
    duration = tickDuration,
  } : { 
    func?: () => void,
    duration?: number
    } = {}): void {
    this.timer = setTimeout(func, duration);
  }

}
