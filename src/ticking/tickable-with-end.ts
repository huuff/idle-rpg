import { Tickable } from "./async-ticker";

// A decorator that takes any tickable and adds an onEnd function
export function makeTickableWithEnd(tickable: Tickable, end: () => void): Tickable {
  return {
    firstTick: () => tickable.firstTick && tickable.firstTick(),
    tick: () => tickable.tick(),
    isOver: () => tickable.isOver(),
    lastTick: () => tickable.lastTick && tickable.lastTick(),
    onEnd: end,
  }
}
