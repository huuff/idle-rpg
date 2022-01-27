import { Zone } from "@/zones/zone";

export interface MapLocation {
  readonly name: string;
}

export interface LocationConnection {
  readonly locations: [ MapLocation, MapLocation ];
  readonly through: Zone;
}

export type TravelOption = {
  readonly to: MapLocation,
  readonly through: Zone,
}

export interface GameMap {
  readonly locations: MapLocation[];
  readonly connections: LocationConnection[];
}

export function optionsFrom(map: GameMap, location: MapLocation) {
  return map.connections
  .filter(conn => conn.locations.some(loc => loc.name === location.name))
  .map(conn => ({
    to: conn.locations[0].name === location.name ? conn.locations[1] : conn.locations[0],
    through: conn.through,
  }));
}