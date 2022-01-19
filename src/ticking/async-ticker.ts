import { tickDuration, longTickDuration } from "./tick-times";

export interface Tickable {
  firstTick?: () => void;
  // A Tickable can be recursive, and thus return a
  // new Tickable that will need to be completed before
  // going on
  tick: () => void | Tickable;
  lastTick?: () => void;
  isOver: () => boolean;
  onEnd?: () => void;
}


export async function runTickable(tickable: Tickable): Promise<void> {
  if (tickable.firstTick) {
    tickable.firstTick();
    await wait(longTickDuration);
  }

  while (!tickable.isOver()) {
    await asyncTimeout(async () => {
      const tickResult = tickable.tick();
      if (tickResult) {
        await runTickable(tickResult)
          .then(() => tickResult.onEnd && tickResult.onEnd())
      }
    }, tickDuration)
  }

  if (tickable.lastTick) {
    tickable.lastTick();
    await wait(longTickDuration);
  }
}

async function asyncTimeout(
  func: (() => Promise<void>) | (() => void),
  delay: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(async () => {
      await func();
      resolve();
    }, delay)
  });
}

function wait(delay: number) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return asyncTimeout(() => {}, delay);
}

