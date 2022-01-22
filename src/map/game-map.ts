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

// TODO: This as a closure
export class GameMap {
  constructor(
    private readonly locations: MapLocation[],
    private readonly connections: LocationConnection[],
  ){}

  public optionsFrom(location: MapLocation): TravelOption[] {
    return this.connections
      .filter(conn => conn.locations.includes(location))
      .map(conn => ({
        to: conn.locations[0] === location ? conn.locations[1] : conn.locations[0],
        through: conn.through,
      }));
  }
}
