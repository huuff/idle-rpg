
import { Zone } from "@/zones/zone";
import { MapStatus, matchMapStatus, RestingStatus, TravellingStatus } from "@/map/map-status";
import { Settlement } from "@/map/settlements";

export type Arrive = {
  readonly type: "arrive",
}

export type Retreat = {
  readonly type: "retreat",
}

export type Continue = {
  readonly type: "continue";
}

export type Depart = {
  readonly type: "depart";
  readonly to: Settlement;
  readonly through: Zone;
};

export type TravelAction = Arrive | Retreat | Continue | Depart;

export function matchTravelAction<T>(
  action: TravelAction,
  arriveFunc: (arrive: Arrive) => T,
  retreatFunc: (retreat: Retreat) => T,
  continueFunc: (cont: Continue) => T,
  departFunc: (depart: Depart) => T,
): T {
  if (action.type === "arrive")
    return arriveFunc(action);
  else if (action.type === "retreat")
    return retreatFunc(action);
  else if (action.type === "continue")
    return continueFunc(action);
  else if (action.type === "depart")
    return departFunc(action);
  else
    throw new Error(`TravelAction of type ${JSON.stringify(action)} not handled in matchTravelAction`)
}

function notSupportedError(current: MapStatus, action: TravelAction): Error {
  return new Error(`TravelAction '${JSON.stringify(action)}' for status '${current.type}' not handled in resolveNextStatus`);
}

export function resolveNextStatus(current: RestingStatus, action: Depart): TravellingStatus;
export function resolveNextStatus(current: MapStatus, action: Retreat | Arrive): RestingStatus;
export function resolveNextStatus(current: TravellingStatus, action: Continue): TravellingStatus;
export function resolveNextStatus(current: MapStatus, action: TravelAction): MapStatus;
export function resolveNextStatus(current: MapStatus, action: TravelAction): MapStatus {
  return matchMapStatus<MapStatus>(current,
    (resting) => {
      if (action.type === "depart") {
        return {
          type: "travelling",
          from: resting.at,
          to: action.to,
          through: action.through,
          steps: 1,
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
          at: travelling.from,
        }
      } else if (action.type === "arrive") {
        return {
          type: "resting",
          at: travelling.to,
        }
      } else {
        throw notSupportedError(current, action);
      }
    }
  );
}
