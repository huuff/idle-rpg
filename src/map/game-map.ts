import { Zone } from "@/zones/zone";
import { Settlement } from "./settlements";

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

export function optionsFrom(map: Readonly<GameMap>, location: Readonly<Settlement>) {
  return map.connections
  .filter(conn => conn.locations.some(loc => loc.name === location.name))
  .map(conn => ({
    to: conn.locations[0].name === location.name ? conn.locations[1] : conn.locations[0],
    through: conn.through,
  }));
}