import { Species } from "./species";
import basicSpeciesJson from "./basic-species.json";
import {mapValues} from "lodash";
import {basicItems, isBasicItemName} from "@/items/basic-items";
import {InventoryItem} from "@/items/inventory";

type BasicSpeciesName = keyof typeof basicSpeciesJson;
type JsonNaturalItem = {
  item: string;
  amount: number;
}

type JsonValue = Omit<Species, "naturalItems"> & {
  naturalItems?: JsonNaturalItem[];
}
type JsonType = {[speciesName in BasicSpeciesName]: JsonValue};

export type BasicSpecies = {[name in BasicSpeciesName]: Species };

function valueToSpecies(val: JsonValue): Species {
  
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


