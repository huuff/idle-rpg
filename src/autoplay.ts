import { TravelOption } from "@/map/game-map";

// FUTURE: Perhaps this should be some class that contains an
// object or type "objective" or something to allow more
// objectives. Also, pathfinding for a location objective
export type Autoplay = "disabled" | "enabled" | TravelOption;

export function hasDestination(autoplay: Autoplay): autoplay is TravelOption {
  return autoplay !== "disabled" && autoplay !== "enabled";
}
