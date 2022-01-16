import { Zone } from "@/zones/zone";

export interface MapLocation {
  name: string;
}

export interface LocationConnection {
  locations: [ MapLocation, MapLocation ];
  through: () => Zone;
}

export type TravelOption = {
  to: MapLocation,
  through: () => Zone,
}

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
