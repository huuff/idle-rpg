import { useMainStore } from "@/store";
import { useTravelStore } from "@/travel/travel-store";
import { useSceneStore } from "@/scenes/scene-store";
import { useNotificationStore } from "@/notification/notification-store";
import { storeToRefs } from "pinia";
import { useTickStore } from "@/ticking/tick-store";
import { settlementToScene, Settlement } from "@/map/settlements";
import { makeRest } from "@/tickables/rest";
import { useCreaturesStore } from "@/creatures-store";
import { Creature, PLAYER_ID } from "@/creatures/creature";

const SAVE_PROPERTY = "save";

type SaveData = {
  player: Creature,
  money: number,
  location: Settlement,
}

export function save(): void {
  const store = storeToRefs(useMainStore());
  const creaturesStore = storeToRefs(useCreaturesStore());
  const travelStore = storeToRefs(useTravelStore());

  localStorage.setItem(SAVE_PROPERTY, JSON.stringify({
    player: creaturesStore.player.value,
    money: store.money.value,
    location: travelStore.mapStatus.value.type === "resting" 
      ? travelStore.mapStatus.value.at
      : travelStore.mapStatus.value.from
  }));

  useNotificationStore().setNotification("saved")
}

export function saveDataExists(): boolean {
  const value = !!localStorage.getItem(SAVE_PROPERTY);
  return value;
}

export function load(): void {
  const serializedSave = localStorage.getItem(SAVE_PROPERTY);
  if (serializedSave) {
    const saveData = JSON.parse(serializedSave) as SaveData;

    const store = storeToRefs(useMainStore());
    const creaturesStore = useCreaturesStore();
    creaturesStore.remove(PLAYER_ID);
    creaturesStore.register(saveData.player);
    store.money.value = saveData.money;

    const travelStore = useTravelStore();
    travelStore.mapStatus = {
      "type": "resting",
      at: saveData.location,
    }
    const sceneStore = useSceneStore();
    sceneStore.setScene(settlementToScene(saveData.location as Settlement));
    const tickStore = useTickStore();
    tickStore.start(makeRest())

    useNotificationStore().setNotification("loaded")
  }
}

export function deleteSave(): void {
  localStorage.clear();
  useNotificationStore().setNotification("deleted")
}
