import { defineStore } from "pinia";
import { Log, makeLog } from "@/log";

export type StoreState = {
  battleLog: Log;
  travelLog: Log;
  money: number;
}

export const useMainStore = defineStore("main", {
  state: (): StoreState => ({
      travelLog: makeLog(),
      battleLog: makeLog(),
      money: 0,
    }),
});
