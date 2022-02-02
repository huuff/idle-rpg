import { Autoplay } from "./autoplay";
import { defineStore } from "pinia";
import { Autosave, AutosaveImpl } from "./save-load/autosave";

export type SettingsStoreState = {
    autoplay: Autoplay;
    retreatHealth: number;
    escapeHealth: number;
    autosave: Autosave;
}

export const useSettingsStore = defineStore("settings", {
    state: (): SettingsStoreState => ({
        autoplay: "disabled",
        retreatHealth: 0.15,
        escapeHealth: 0.05,
        autosave: new AutosaveImpl(),
    })
});