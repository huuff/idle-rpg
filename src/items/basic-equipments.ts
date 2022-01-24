import { EquipmentItem } from "./item";
import { StatsImpl, Stats } from "@/creatures/stats";
import basicEquipmentsJson from "./basic-equipments.json";
import { mapValues } from "lodash";
// TODO: Weapons should not give strength, but attacks!

// XXX pretty shitty code tbqh
// Also, deserializing JSON fails to recognize that discriminated
// unions belong to these types (slot name, item type...)
// Maybe find some way to fix that?
// Having used so many discriminated unions means that whenever
// I change items' stuff, I need to change it here too
export type BasicEquipments = {[itemName in keyof typeof basicEquipmentsJson]: EquipmentItem};

const statNames = [ "strength", "agility", "maxHealth" ];
const slotNames = [ "weapon" ];

function isStats(json: any): json is Stats {
  return Object.entries(json).every(([key, value]) => {
    return statNames.includes(key) && typeof value === "number";
  }) 
}

function check(json: any) {
  Object.values(json)
    .every((obj: any) => {
      const result = obj.type === "equipment"
        && typeof obj.name === "string"
        && typeof obj.avgValue === "number"
        && typeof obj.rarity === "number"
        && slotNames.includes(obj.slot)
        && isStats(obj.stats)
        ;

      if (!result) {
        throw new Error(`Error parsing 'basic-equipments.json'! ${JSON.stringify(obj)} is not a 'BasicEquipment'`);
      }
    })
}

function jsonToEquipmentItem(json: any): EquipmentItem {
  return {
    type: "equipment",
    name: json.name,
    slot: json.slot,
    isEquipped: false,
    rarity: json.rarity,
    avgValue: json.avgValue,
    stats: new StatsImpl(json.stats)
  }
}

function loadJson(): BasicEquipments {
  check(basicEquipmentsJson);

  return mapValues(basicEquipmentsJson, jsonToEquipmentItem);
}

export const basicEquipments: BasicEquipments = loadJson();
