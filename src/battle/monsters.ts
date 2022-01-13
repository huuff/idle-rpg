import { Actor } from "@/battle/actor";
import { BasicAttack } from "@/battle/basic-attack";
import { Stats } from "@/battle/stats";

const slimeBaseStats: Stats = {
    maxHealth: 20,
    strength: 4,
    agility: 2,
};

export const makeSlime = (id?: number): Actor => new Actor(
  id !== undefined ? `Slime ${id.toString()}` : "Slime",
  slimeBaseStats,
  [ new BasicAttack() ],
)
