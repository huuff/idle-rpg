import { MapStatus } from "./map-status";
import { MapLocation } from "./game-map";
import { Zone } from "@/zones/zone";

export type MapStatusChangeType = "arrival" | "retreat" | "departure" | "continue";

export type Arrival = {
  type: "arrival";
  at: MapLocation;
}

export type Retreat = {
  type: "retreat";
  to: MapLocation;
}

export type Departure = {
  type: "departure";
  from: MapLocation;
  to: MapLocation;
  through: Zone;
}

export type Continue = {
  type: "continue";
  status: MapStatus;
}

export type MapStatusChange = Arrival | Retreat | Departure | Continue;

export function resolveMapStatusChange(oldStatus: MapStatus, newStatus: MapStatus): MapStatusChange {
  if (oldStatus.type === "resting" && newStatus.type === "travelling") {
    return {
      type: "departure",
      from: newStatus.from,
      to: newStatus.to,
      through: newStatus.through,
    }
  } else if (oldStatus.type === "travelling" && newStatus.type === "resting") {
    if (newStatus.in === oldStatus.from) {
      return {
        type: "retreat",
        to: newStatus.in,
      }
    } else if (newStatus.in === oldStatus.to) {
      return {
        type: "arrival",
        at: newStatus.in,
      }
    }
  } else if (oldStatus.type === newStatus.type) {
    return {
      type: "continue",
      status: newStatus
    }
  }

  throw new Error("Some branch not covered for resolveMapStatusChange")
}

export function matchMapStatusChange<T>(
  statusChange: MapStatusChange,
  onArrival: (arrival: Arrival) => T,
  onRetreat: (retreat: Retreat) => T,
  onDeparture: (departure: Departure) =>T,
  onContinue: (cont: Continue) => T,
): T {
  if (statusChange.type === "arrival") {
    return onArrival(statusChange);
  } else if (statusChange.type === "retreat") {
    return onRetreat(statusChange);
  } else if (statusChange.type === "departure") {
    return onDeparture(statusChange);
  } else if (statusChange.type === "continue") {
    return onContinue(statusChange)
  } else {
    throw new Error("Status change not matched!");
  }
}

export function mapStatusChangeToString(mapStatusChange: MapStatusChange): string | undefined {
  return matchMapStatusChange<string | undefined>(mapStatusChange,
    (arrival) => `You arrive at ${arrival.at.name}`, 
    (retreat) => `You return to ${retreat.to.name}`,
    (departure) => `You depart from ${departure.from.name} to ${departure.to.name} through ${departure.through.name}`,
    (cont) => undefined, 
  )
}
