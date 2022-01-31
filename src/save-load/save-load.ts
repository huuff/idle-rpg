import { playerToSavedPlayer } from "./player";
import { useMainStore } from "@/store";
import { useTravelStore } from "@/travel/travel-store";
import { useSceneStore } from "@/scenes/scene-store";
import { useNotificationStore } from "@/notification/notification-store";
import { SaveData } from "./save-data";
import { storeToRefs } from "pinia";
import { useTickStore } from "@/ticking/tick-store";
import { settlementToScene, Settlement } from "@/map/settlements";
import { makeRest } from "@/tickables/rest";
import { fixSaveHack } from "./fix-save-hack";
import { useCreaturesStore } from "@/creatures-store";

const SAVE_PROPERTY = "save";

export function save(): void {
  const store = storeToRefs(useMainStore());
  const creaturesStore = storeToRefs(useCreaturesStore());
  const travelStore = storeToRefs(useTravelStore());

  localStorage.setItem(SAVE_PROPERTY, JSON.stringify({
    player: playerToSavedPlayer(creaturesStore.player.value),
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

    const player = {
      id: "1",
      species: saveData.player.species,
      jobClass: saveData.player.jobClass,
      name: saveData.player.name,
      level: saveData.player.level,
      inventory: saveData.player.inventory,
      currentExp: saveData.player.currentExp,
      currentHealth: saveData.player.currentHealth,
    };

    const store = storeToRefs(useMainStore());
    const { creatures } = storeToRefs(useCreaturesStore());
    creatures.value["1"] = player;
    store.money.value = saveData.money;

    fixSaveHack();

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
