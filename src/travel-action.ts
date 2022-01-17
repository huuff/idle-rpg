import { MapStatus, TravellingStatus } from "@/map/map-status";

export type TravelAction = "arrive" | "retreat" | "continue";

export function resolveNextStatus(current: TravellingStatus, action: TravelAction): MapStatus {
  if (action === "continue") {
    return {
      ...current,
      encounters: current.encounters + 1,
    }
  } else if (action === "retreat") {
    return {
      type: "resting",
      in: current.from,
    }
  } else if (action === "arrive") {
    return {
      type: "resting",
      in: current.to,
    }
  } else {
    throw new Error(`TravelAction ${JSON.stringify(action)} not handled in resolveNextStatus`);
  }
}
