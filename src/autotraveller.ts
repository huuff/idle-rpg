import { TravellingStatus } from "@/map/map-status";
import { Creature } from "@/creatures/creature";
import { TravelDecisionMaker } from "@/travel";

export const autoTravel: TravelDecisionMaker = (status: TravellingStatus, player: Creature) => {
    if (status.through.isComplete(status.encounters)) {
      return "arrive";
    } else if (player.healthRatio < 0.15) {
      return "retreat";
    } else {
      return "continue";
    }
}
