import { EquipmentItem, isEquipmentSlot } from "./item";
import basicEquipmentsJson from "./basic-equipments.json";
import { mapValues } from "lodash";

type EquipmentName = keyof typeof basicEquipmentsJson;

export type BasicEquipments = {[name in EquipmentName]: EquipmentItem};


export const basicEquipments: BasicEquipments = basicEquipmentsJson as BasicEquipments;
