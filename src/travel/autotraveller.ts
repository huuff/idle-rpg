import { TravellingStatus } from "@/map/map-status";
import { Creature } from "@/creatures/creature";
import { TravelDecisionMaker } from "./travel";

export const autoTravel: TravelDecisionMaker = {
  decide: (status: TravellingStatus, player: Creature) => {
    if (status.through.isComplete(status.encounters)) {
      return { type: "arrive" };
    } else if (player.healthRatio < 0.15) {
      return { type: "retreat" };
    } else {
      return { type: "continue" };
    }
  }
}
