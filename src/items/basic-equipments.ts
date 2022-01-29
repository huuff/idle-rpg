import { EquipmentItem } from "./item";
import basicEquipmentsJson from "./basic-equipments.json";

type EquipmentName = keyof typeof basicEquipmentsJson;

export type BasicEquipments = {[name in EquipmentName]: EquipmentItem};

export const basicEquipments: BasicEquipments = basicEquipmentsJson as BasicEquipments;
