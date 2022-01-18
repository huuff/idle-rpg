import { MapLocation } from "@/map/game-map";
import { Zone } from "@/zones/zone";
import { MapStatus, matchMapStatus } from "@/map/map-status";

export type Arrive = {
  type: "arrive",
}

export type Retreat = {
  type: "retreat",
}

export type Continue = {
  type: "continue";
}

export type Depart = {
  type: "depart";
  to: MapLocation;
  through: Zone;
};

export type TravelAction = Arrive | Retreat | Continue | Depart;

function notSupportedError(current: MapStatus, action: TravelAction): Error {
  return new Error(`TravelAction '${JSON.stringify(action)}' for status '${current.type}' not handled in resolveNextStatus`);
}

export function resolveNextStatus(current: MapStatus, action: TravelAction): MapStatus {
  return matchMapStatus<MapStatus>(current,
    (resting) => {
      if (action.type === "depart") {
        return {
          type: "travelling",
          from: resting.in,
          to: action.to,
          through: action.through,
          encounters: 0,
        }
      } else {
        throw notSupportedError(current, action);
      }
    },
    (travelling) => {
      if (action.type === "continue") {
        return travelling;
      } else if (action.type === "retreat") {
        return {
          type: "resting",
          in: travelling.from,
        }
      } else if (action.type === "arrive") {
        return {
          type: "resting",
          in: travelling.to,
        }
      } else {
        throw notSupportedError(current, action);
      }

    }
  );
}
