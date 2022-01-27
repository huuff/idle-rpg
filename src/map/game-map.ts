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
  optionsFrom(location: MapLocation): TravelOption[];
}

export function createGameMap(locations: MapLocation[], connections: LocationConnection[]): GameMap {
  return {
    locations,
    connections,
    optionsFrom(location: MapLocation) {
      return this.connections
        .filter(conn => conn.locations.some(loc => loc.name === location.name))
        .map(conn => ({
          to: conn.locations[0].name === location.name ? conn.locations[1] : conn.locations[0],
          through: conn.through,
        }));
    }
  }
}
