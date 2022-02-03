import { Zone } from "@/zones/zone";
import { Settlement } from "./settlements";

export type MapStatusType = "resting" | "travelling";

export type TravellingStatus = {
  readonly type: "travelling";
  readonly from: Settlement;
  readonly to: Settlement;
  readonly through: Zone;
  steps: number;
};

export type RestingStatus = {
  readonly type: "resting";
  readonly at: Settlement;
};

export type MapStatus = TravellingStatus | RestingStatus;

export function matchMapStatus<T>(
  status: Readonly<MapStatus>,
  restingFunc: (s: Readonly<RestingStatus>) => T,
  travellingFunc: (s: Readonly<TravellingStatus>) => T,
): T {
  if (status.type === "resting")
    return restingFunc(status);
  else if (status.type === "travelling")
    return travellingFunc(status);
  else
    throw new Error (`Status type ${JSON.stringify(status)} not handled in matchMapStatus`);
}
