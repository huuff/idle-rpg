import { Zone } from "@/zones/zone";
import { MapLocation, } from "./game-map";

export type MapStatusType = "resting" | "travelling";

export type TravellingStatus = {
  type: "travelling";
  from: MapLocation;
  to: MapLocation;
  steps: number;
  through: Zone;
};

export type RestingStatus = {
  type: "resting";
  at: MapLocation;
};

export type MapStatus = TravellingStatus | RestingStatus;

export function matchMapStatus<T>(
  status: MapStatus,
  restingFunc: (s: RestingStatus) => T,
  travellingFunc: (s: TravellingStatus) => T,
): T {
  if (status.type === "resting")
    return restingFunc(status);
  else if (status.type === "travelling")
    return travellingFunc(status);
  else
    throw new Error (`Status type ${JSON.stringify(status)} not handled in matchMapStatus`);
}
