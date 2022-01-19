import { defineStore } from "pinia";
import { Ticker, } from "./ticker";

export type TickState = {
  mainTicker: Ticker;
}

export const useTickStore = defineStore("tick", {
  state: () => ({
    ticker: new Ticker(),
  }),
});
