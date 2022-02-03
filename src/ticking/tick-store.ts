import { defineStore } from "pinia";
import { Tickable, runTickable } from "./async-ticker";

type TickState = {
  mainTicker: Promise<void> | undefined;
  abortController: AbortController | undefined;
}

export const useTickStore = defineStore("tick", {
  state: (): TickState => ({
    mainTicker: undefined,
    abortController: undefined,
  }),
  actions: {
    start(tickable: Readonly<Tickable>) {
      this.abortController = new AbortController();
      this.mainTicker = runTickable(tickable, this.abortController.signal);
    },
    stop() {
      if (this.mainTicker && this.abortController) {
        this.abortController.abort();
      }
    }
  }
});

