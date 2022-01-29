import { Autoplay } from "./autoplay";
import { defineStore } from "pinia";

export type SettingsStoreState = {
    autoplay: Autoplay;
    retreatHealth: number;
}

export const useSettingsStore = defineStore("settings", {
    state: (): SettingsStoreState => ({
        autoplay: "disabled",
        retreatHealth: 0.15,
    })
});