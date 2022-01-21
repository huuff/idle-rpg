import { TravellingStatus } from "@/map/map-status";
import { Creature } from "@/creatures/creature";
import { TravelDecisionMaker } from "./travel";

export const autoTravel: TravelDecisionMaker = (status: TravellingStatus, player: Creature) => {
  if (status.through.isComplete()) {
    return { type: "arrive" };
  } else if (player.healthRatio < 0.15) {
    return { type: "retreat" };
  } else {
    return { type: "continue" };
  }
}
