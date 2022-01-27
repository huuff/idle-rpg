import { Settlement } from "@/map/settlements";
import { SavedPlayer } from "./player";

export type SaveData = {
  player: SavedPlayer;
  money: number;
  location: Settlement;
}
