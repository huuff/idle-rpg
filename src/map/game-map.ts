import { Zone } from "@/zones/zone";
import { Scene } from "@/scenes/scene";

export interface MapLocation extends Scene {
  name: string;
}

export interface LocationConnection {
  locations: [ MapLocation, MapLocation ];
  through: Zone;
}

export type TravelOption = {
  to: MapLocation,
  through: Zone,
}

export interface GameMap {
  locations: MapLocation[];
  connections: LocationConnection[];
  optionsFrom(location: MapLocation): TravelOption[];
}

export function createGameMap(locations: MapLocation[], connections: LocationConnection[]): GameMap {
  return {
    locations,
    connections,
    optionsFrom(location: MapLocation) {
      return this.connections
        .filter(conn => conn.locations.includes(location))
        .map(conn => ({
          to: conn.locations[0] === location ? conn.locations[1] : conn.locations[0],
          through: conn.through,
        }));
    }
  }
}
