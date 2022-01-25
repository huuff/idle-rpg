import { makeSettlement, Settlement } from "./settlements";
import basicSettlementsJson from "./basic-settlements.json";
import { createShopFactory } from "@/locations/shop";
import { mapValues } from "lodash";

type SettlementName = keyof typeof basicSettlementsJson;
type JsonShop = {
  budget: number;
  rarity: number;
}
type JsonValue = Omit<Settlement, "createShop" | "mainView" | "sideView"> & {
  shop: JsonShop;
}
type JsonType = {[settlementName in SettlementName]: JsonValue};

export type BasicSettlements = {[name in SettlementName]: Settlement};

function valueToSettlement(val: JsonValue): Settlement {
  return makeSettlement(val.name, createShopFactory(val.shop.budget, val.shop.rarity))
}

function loadJson(json: JsonType): BasicSettlements {
  return mapValues(json, valueToSettlement);
}

export const basicSettlements: BasicSettlements = loadJson(basicSettlementsJson);
