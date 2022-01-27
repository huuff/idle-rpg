import { EquipmentItem, isEquipmentSlot } from "./item";
import basicEquipmentsJson from "./basic-equipments.json";
import { mapValues } from "lodash";

type EquipmentName = keyof typeof basicEquipmentsJson;
type JsonValue = Omit<EquipmentItem, "type" | "slot"> & {
  type: string;
  slot: string;
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

  return {
    ...val,
    type,
    slot,
  }
}

function loadJson(json: JsonType): BasicEquipments {
  return mapValues(json, valueToEquipmentItem);
}

export const basicEquipments: BasicEquipments = loadJson(basicEquipmentsJson);
