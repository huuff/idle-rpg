import { playerToSavedPlayer } from "./player";
import { useMainStore } from "@/store";
import { useTravelStore } from "@/travel/travel-store";
import { useSceneStore } from "@/scenes/scene-store";
import { SaveData } from "./save-data";
import {CreatureImpl} from "@/creatures/creature";
import { storeToRefs } from "pinia";
import { useTickStore } from "@/ticking/tick-store";
import { settlementToScene, Settlement } from "@/map/settlements";
import { makeRest } from "@/tickables/rest";
import { fixSaveHack } from "./fix-save-hack";

const SAVE_PROPERTY = "save";

export function save(): void {
  const store = storeToRefs(useMainStore());
  const travelStore = storeToRefs(useTravelStore());

  localStorage.setItem(SAVE_PROPERTY, JSON.stringify({
    player: playerToSavedPlayer(store.player.value),
    money: store.money.value,
    location: travelStore.mapStatus.value.type === "resting" 
      ? travelStore.mapStatus.value.at
      : travelStore.mapStatus.value.from
  }));
}

export function saveDataExists(): boolean {
  const value = !!localStorage.getItem(SAVE_PROPERTY);
  return value;
}

export function load(): void {
  const serializedSave = localStorage.getItem(SAVE_PROPERTY);
  if (serializedSave) {
    const saveData = JSON.parse(serializedSave) as SaveData;

    const player = new CreatureImpl({
      species: saveData.player.species,
      jobClass: saveData.player.jobClass,
      name: saveData.player.name,
      level: saveData.player.level,
      items: saveData.player.inventory,
    })

    player.currentExp = saveData.player.currentExp;
    player.currentHealth = saveData.player.currentHealth;

    const store = storeToRefs(useMainStore());
    store.player.value = player;
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
  }
}

export function deleteSave(): void {
  localStorage.clear();
}
