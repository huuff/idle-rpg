import { TravellingStatus } from "@/map/map-status";
import Creatures, { Creature } from "@/creatures/creature";
import { TravelDecisionMaker } from "./travel";
import { useSettingsStore } from "@/settings-store";
import { storeToRefs } from "pinia";
import Zones from "@/zones/zone";

export const autoTravel: TravelDecisionMaker = (status: TravellingStatus, player: Creature) => {
  const { retreatHealth } = storeToRefs(useSettingsStore());
  if (Zones.isComplete(status.through, status.steps)) {
    return { type: "arrive" };
  } else if (Creatures.healthRatio(player) < retreatHealth.value) {
    return { type: "retreat" };
  } else {
    return { type: "continue" };
  }
}
