import { TravellingStatus } from "@/map/map-status";
import { Creature } from "@/creatures/creature";
import { TravelDecisionMaker } from "./travel";
import { useSettingsStore } from "@/settings-store";
import { storeToRefs } from "pinia";

export const autoTravel: TravelDecisionMaker = (status: TravellingStatus, player: Creature) => {
  const { retreatHealth } = storeToRefs(useSettingsStore());
  if (status.through.isComplete()) {
    return { type: "arrive" };
  } else if (player.healthRatio < retreatHealth.value) {
    return { type: "retreat" };
  } else {
    return { type: "continue" };
  }
}
