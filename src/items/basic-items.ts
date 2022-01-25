import { StuffItem } from "./item";
import * as basicItemsJson from "./basic-items.json";
import { omit } from "lodash";

type BasicItemName = keyof typeof basicItemsJson;
type JsonValue = Omit<StuffItem, "type"> & { type: string };
type JsonType = { [itemName in BasicItemName]: JsonValue };

export type BasicItems = {[itemName in BasicItemName]: StuffItem}


function areBasicItems(json: JsonType): json is BasicItems {
  // XXX: Omit is needed because json loading works
  // differently in jest (node) to in browser (It adds a default
  // property that messes everything up). This annotation applies
  // to all of my json loading modules, but I'm just leaving it
  // here since I won't put it into each one
  return Object.values(omit(json, "default"))
    .every((obj: JsonValue) => {
      return obj.type === "stuff"
    });
}

function loadJson(json: JsonType): BasicItems {
  if (!areBasicItems(json)) {
    throw new Error("Error loading basic items");
  }

  return json;
}

export const basicItems: BasicItems = loadJson(basicItemsJson);

export function isBasicItemName(itemName: string): itemName is BasicItemName {
  return itemName in basicItems;
}
