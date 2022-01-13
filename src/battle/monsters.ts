import { Actor } from "@/battle/actor";
import { BasicAttack } from "@/battle/basic-attack";

export const makeSlime = (id?: number): Actor => ({
  name: id !== undefined ? `Slime ${id.toString()}` : "Slime",
  currentHealth: 20,
  stats: {
    maxHealth: 20,
    strength: 4,
    agility: 2,
  },
  possibleActions: [ new BasicAttack() ],
})
