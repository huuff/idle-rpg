import { Tickable } from "./async-ticker";

// XXX: Every time I change a property of tickable, this is silently incorrect.
// There must be a better way

// A decorator that takes any tickable and adds an onEnd function
export function makeTickableWithEnd(tickable: Tickable, end: () => void): Tickable {
  return {
    firstTick: () => tickable.firstTick && tickable.firstTick(),
    tick: () => tickable.tick(),
    isOver: () => tickable.isOver(),
    lastTick: () => tickable.lastTick && tickable.lastTick(),
    scene: tickable.scene,
    onEnd: () => {
      tickable.onEnd && tickable.onEnd();
      end();
    }
  }
}
