import { EquipmentItem, isEquipmentSlot } from "./item";
import { StatsImpl, isStatsInput } from "@/creatures/stats";
import basicEquipmentsJson from "./basic-equipments.json";
import { mapValues } from "lodash";
// TODO: Weapons should not give strength, but attacks!

type EquipmentName = keyof typeof basicEquipmentsJson;
type JsonValue = Omit<EquipmentItem, "type" | "stats" | "slot"> & {
  type: string;
  slot: string;
  stats: { [statName: string]: number};
}
type JsonType = {[itemName in EquipmentName]: JsonValue};

export type BasicEquipments = {[name in EquipmentName]: EquipmentItem};


function valueToEquipmentItem(val: JsonValue): EquipmentItem {
  const type = val.type;
  if (type !== "equipment") {
    throw new Error(`item type is not 'equipment': ${JSON.stringify(val)}`)
  } 

  const slot = val.slot;
  if (!isEquipmentSlot(slot)) {
    throw new Error(`${val.slot} is not a valid equipment slot type!`)
  }

  const statsInput = val.stats;
  if (!isStatsInput(statsInput)) {
    throw new Error(`Not valid stats: ${JSON.stringify(val.stats)}`);
  }

  return {
    ...val,
    type,
    slot,
    stats: new StatsImpl(val.stats),
  }
}

function loadJson(json: JsonType): BasicEquipments {
  return mapValues(json, valueToEquipmentItem);
}

export const basicEquipments: BasicEquipments = loadJson(basicEquipmentsJson);
