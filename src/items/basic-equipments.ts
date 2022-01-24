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


// STUCK: WHy the fuck won't it narrowwwwww
function loadJson(json: JsonType): BasicEquipments {
  return mapValues(json, (val: JsonValue) => {
    if (val.type !== "equipment") {
      throw new Error(`item type is not 'equipment': ${JSON.stringify(val)}`)
    } 

    if (!isEquipmentSlot(val.slot)) {
      throw new Error(`${val.slot} is not a valid equipment slot type!`)
    }

    if (!isStatsInput(val.stats)) {
      throw new Error(`Not valid stats: ${JSON.stringify(val.stats)}`);
    }
    
    return {
      ...val,
      stats: new StatsImpl(val.stats)
    } as EquipmentItem;
  });
}

export const basicEquipments: BasicEquipments = loadJson(basicEquipmentsJson);
