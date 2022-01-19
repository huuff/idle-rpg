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

// TODO: Maybe merge these two interfaces?
export type CallbackTickable = {
  tickable: Tickable,
  callback?: () => void,
}

  export class AsyncTicker {

    public async run(tickable: Tickable): Promise<void> {
      if (tickable.firstTick) {
        tickable.firstTick();
        await this.wait(longTickDuration);
      }

      while (!tickable.isOver()) {
        await this.asyncTimeout(async () => {
          const tickResult = tickable.tick();
          if (tickResult) {
            await this.run(tickResult.tickable)
              .then(() => tickResult.callback && tickResult.callback())
          }
        }, tickDuration)
      }

      if (tickable.lastTick) {
        tickable.lastTick();
        await this.wait(longTickDuration);
      }
    }

    private async asyncTimeout(
      func: (() => Promise<void>) | (() => void),
      delay: number): Promise<void> {
      return new Promise<void>(resolve => {
        setTimeout(async () => {
          await func();
          resolve();
        }, delay)
      });
    }

    private wait(delay: number) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return this.asyncTimeout(() => {}, delay);
    }
  }

