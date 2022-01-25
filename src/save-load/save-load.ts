import { playerToSavedPlayer } from "./player";
import { useMainStore } from "@/store";
import { SaveData } from "./save-data";
import {CreatureImpl} from "@/creatures/creature";
import {basicSpecies, isBasicSpeciesName} from "@/creatures/basic-species";
import { baseClasses } from "@/creatures/base-classes";

const SAVE_PROPERTY = "save";

export function save(): void {
  const store = useMainStore();

  localStorage.setItem(SAVE_PROPERTY, JSON.stringify({
    player: playerToSavedPlayer(store.player),
    money: store.money
  }));
}

export function existsSaveData(): boolean {
  const value = !!localStorage.getItem(SAVE_PROPERTY);
  return value;
}

export function load(): void {
  const serializedSave = localStorage.getItem(SAVE_PROPERTY);
  if (serializedSave) {
    const saveData = JSON.parse(serializedSave) as SaveData;

    const speciesName = saveData.player.speciesName;
    if (!isBasicSpeciesName(speciesName)) {
      throw new Error(`${speciesName} is not a valid species!`);
    }

    const jobClassName = saveData.player.jobClassName;
    if (!(jobClassName in baseClasses)) {
      throw new Error(`${jobClassName} is not a valid class!`)
    }

    const player = new CreatureImpl({
      species: basicSpecies[speciesName],
      jobClass: baseClasses[jobClassName],
      name: saveData.player.name,
      level: saveData.player.level,
      items: saveData.player.inventory,
    })

    player.currentExp = saveData.player.currentExp;
    player.currentHealth = saveData.player.currentHealth;

    const store = useMainStore();
    store.player = player;
    store.money = saveData.money;
  }
}

export function deleteSave(): void {
  localStorage.clear();
}
