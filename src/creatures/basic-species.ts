import { Species } from "./species";
import basicSpeciesJson from "./basic-species.json";
import {mapValues} from "lodash";
import {isStatsInput, StatsImpl} from "./stats";
import {basicItems, isBasicItemName} from "@/items/basic-items";
import {InventoryItem} from "@/items/inventory";
import {BasicAttack} from "@/battle/basic-attack";

type BasicSpeciesName = keyof typeof basicSpeciesJson;
type JsonNaturalItem = {
  item: string;
  amount: number;
}

type JsonValue = Omit<Species, "baseStats" | "levelProgression" | "naturalActions" | "naturalItems"> & {
  baseStats: { [statName: string]: number };
  levelProgression: { [statName: string]: number };
  naturalActions: string[];
  naturalItems?: JsonNaturalItem[];
}
type JsonType = {[speciesName in BasicSpeciesName]: JsonValue};

export type BasicSpecies = {[name in BasicSpeciesName]: Species };

function valueToSpecies(val: JsonValue): Species {
  const baseStats = val.baseStats;
  if (!isStatsInput(baseStats)) {
    throw new Error(`Not valid stats: ${JSON.stringify(baseStats)}`)
  }

  const levelProgression = val.levelProgression;
  if (!isStatsInput(levelProgression)) {
    throw new Error(`Not valid stats: ${JSON.stringify(levelProgression)}`)
  }

  // TODO: Improve it when there are more attacks
  const naturalActions = val.naturalActions;
  if (naturalActions.length !== 1 && naturalActions[0] !== "basicAttack") {
    throw new Error("Natural actions incorrect in JSON");
  }
  
  const naturalItems: InventoryItem[] = []
  if (val.naturalItems) {
    for (const naturalItem of val.naturalItems) {
      const itemName = naturalItem.item;
      if (!isBasicItemName(itemName)) {
        throw new Error(`${naturalItem.item} is not a known item!`);
      }

      naturalItems.push({
        ...basicItems[itemName],
        amount: naturalItem.amount
      })
    }
  }

  return {
    ...val,
    baseStats: new StatsImpl(baseStats),
    levelProgression: new StatsImpl(levelProgression),
    naturalActions: [ new BasicAttack() ],
    naturalItems,
  }
}

function loadJson(json: JsonType): BasicSpecies {
  return mapValues(json, valueToSpecies);
}

export const basicSpecies: BasicSpecies = loadJson(basicSpeciesJson);

export function isBasicSpeciesName(speciesName: string): speciesName is BasicSpeciesName {
  return speciesName in basicSpecies;
}


