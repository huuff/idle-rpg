import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import { tickDuration, longTickDuration } from "./tick-times";
import { Scene } from "@/scenes/scene";

export interface Tickable {
  firstTick?: () => void;
  // A Tickable can be recursive, and thus return a
  // new Tickable that will need to be completed before
  // going on
  tick: () => void | Tickable;
  lastTick?: () => void | Tickable;
  isOver: () => boolean;
  scene?: Scene;
  onEnd?: () => void;
}

export async function runTickable(tickable: Tickable): Promise<void> {
  if (tickable.firstTick) {
    tickable.firstTick();
    setTickableScene(tickable);
    await wait(longTickDuration);
  }

  while (!tickable.isOver()) {
    setTickableScene(tickable);
    await asyncTimeout(async () => {
      const tickResult = tickable.tick();
      if (tickResult) {
        await runTickable(tickResult);
      }
    }, tickDuration)
  }

  if (tickable.lastTick) {
    tickable.lastTick();
    setTickableScene(tickable);
    await wait(longTickDuration);
  }

  tickable.onEnd && tickable.onEnd();
}

function setTickableScene(tickable: Tickable) {
  if (tickable.scene) {
    const { scene } = storeToRefs(useMainStore());

    scene.value = tickable.scene;
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

