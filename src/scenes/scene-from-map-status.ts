import { Scene } from "./scene";
import { MapStatus, matchMapStatus } from "@/map/map-status";
import { Rest } from "@/rest-scene";

export function sceneFromMapStatus(status: MapStatus): Scene {
  return matchMapStatus<Scene>(status,
    (resting) => new Rest(resting.in), 
    (travelling) => travelling.through.newEncounter(travelling.encounters)
  );
}
