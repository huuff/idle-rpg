import { Zone } from "@/zones/zone";
import { Settlement } from "./settlements";
import { isEqual} from "lodash";
import { ReadonlyDeep } from "type-fest";

export interface MapLocation {
  readonly name: string;
}

export interface LocationConnection {
  readonly locations: [ Settlement, Settlement ];
  readonly through: Zone;
}

export type TravelOption = {
  readonly to: Settlement,
  readonly through: Zone,
}

export interface GameMap {
  readonly locations: Settlement[];
  readonly connections: LocationConnection[];
}

export function optionsFrom(map: ReadonlyDeep<GameMap>, location: ReadonlyDeep<Settlement>) {
  return map.connections
  .filter(conn => conn.locations.some(l => isEqual(l, location)))
  .map(conn => ({
    to: isEqual(conn.locations[0], location) ? conn.locations[1] : conn.locations[0],
    through: conn.through,
  }));
}