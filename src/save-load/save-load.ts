import { useMainStore } from "@/store";
import { useTravelStore } from "@/travel/travel-store";
import { useSceneStore } from "@/scenes/scene-store";
import { useNotificationStore } from "@/notification/notification-store";
import { storeToRefs } from "pinia";
import { useTickStore } from "@/ticking/tick-store";
import { settlementToScene, Settlement } from "@/map/settlements";
import { makeRest } from "@/tickables/rest";
import { useCreaturesStore } from "@/creatures-store";
import { Creature } from "@/creatures/creature";
import { useSettingsStore } from "@/settings-store";

const SAVE_PROPERTY = "save";

type SaveData = {
  player: Creature,
  money: number,
  location: Settlement,
  autosave: boolean;
}

export function save(): void {
  const store = storeToRefs(useMainStore());
  const creaturesStore = storeToRefs(useCreaturesStore());
  const travelStore = storeToRefs(useTravelStore());
  const settingsStore = storeToRefs(useSettingsStore());
  const notificationStore = useNotificationStore();

  const saveData: SaveData = {
    player: creaturesStore.player.value,
    money: store.money.value,
    location: travelStore.mapStatus.value.type === "resting" 
      ? travelStore.mapStatus.value.at
      : travelStore.mapStatus.value.from,
    autosave: settingsStore.autosave.value.isEnabled,
  }

  localStorage.setItem(SAVE_PROPERTY, JSON.stringify(saveData));

  notificationStore.setNotification("saved")
}

export function saveDataExists(): boolean {
  return !!localStorage.getItem(SAVE_PROPERTY);
}

export function load(): void {
  const serializedSave = localStorage.getItem(SAVE_PROPERTY);
  if (serializedSave) {
    const saveData = JSON.parse(serializedSave) as SaveData;

    const store = storeToRefs(useMainStore());
    const creaturesStore = useCreaturesStore();
    const sceneStore = useSceneStore();
    const travelStore = useTravelStore();
    const tickStore = useTickStore();
    const settingsStore = useSettingsStore();
    const notificationStore = useNotificationStore();

    creaturesStore.register(saveData.player, { override: true });
    store.money.value = saveData.money;

    travelStore.mapStatus = {
      "type": "resting",
      at: saveData.location,
    }

    sceneStore.setScene(settlementToScene(saveData.location as Settlement));
    tickStore.start(makeRest())

    if (saveData.autosave) {
      settingsStore.autosave.start();
    } else {
      settingsStore.autosave.stop();
    }

    notificationStore.setNotification("loaded")
  }
}

export function deleteSave(): void {
  localStorage.clear();
  useNotificationStore().setNotification("deleted")
}
