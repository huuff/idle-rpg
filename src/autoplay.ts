import { TravelOption } from "@/map/game-map";

// TODO: Perhaps this should be some class that contains an
// object or type "objective" or something?
export type Autoplay = "disabled" | "enabled" | TravelOption;

export function hasDestination(autoplay: Autoplay): autoplay is TravelOption {
  return autoplay !== "disabled" && autoplay !== "enabled";
}
