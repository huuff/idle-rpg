import { StuffItem } from "./item";
import basicItemsJson from "./basic-items.json";

type BasicItemName = keyof typeof basicItemsJson;
type JsonValue = Omit<StuffItem, "type"> & { type: string };
type JsonType = { [itemName in BasicItemName]: JsonValue };

export type BasicItems = {[itemName in BasicItemName]: StuffItem}


function areBasicItems(json: JsonType): json is BasicItems {
  return Object.values(json)
    .every((obj: JsonValue) => obj.type === "stuff");
}

function loadJson(): BasicItems {
  if (!areBasicItems(basicItemsJson)) {
    throw new Error("Error loading basic items");
  }

  return basicItemsJson;
}

export const basicItems: BasicItems = loadJson();

export function isBasicItemName(itemName: string): itemName is BasicItemName {
  return itemName in basicItems;
}
