import { StuffItem } from "./item";
import basicItemsJson from "./basic-items.json";

export type BasicItems = {[itemName in keyof typeof basicItemsJson]: StuffItem}

function areBasicItems(json: any): json is BasicItems {
  return Object.values(json)
    .every((obj: any) => {
      const result = obj.type === "stuff"
            && typeof obj.name === "string"
            && typeof obj.avgValue === "number"
            && typeof obj.rarity === "number";
      if (!result) {
        throw new Error(`Error loading 'basic-items.json'! The following object is not a 'StuffItem': ${JSON.stringify(obj)}`)
      }
      return result;
    })
}

function loadJson(): BasicItems {
  if (!areBasicItems(basicItemsJson)) {
    throw new Error("Error loading basic items");
  }

  return basicItemsJson;
}

export const basicItems: BasicItems = loadJson();
