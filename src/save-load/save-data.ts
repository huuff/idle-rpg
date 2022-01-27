import { MapLocation } from "@/map/game-map";
import { SavedPlayer } from "./player";

export type SaveData = {
  player: SavedPlayer;
  money: number;
  location: MapLocation;
}
