import Creatures, { Creature } from "@/creatures/creature";
import shuffle from "lodash/shuffle"

// A series of turns is calculated, where each actor has
// 'n' turns, where 'n' is the actor's agility,
// The turns are then randomized
export function calculateTurns<T extends Creature>(creatures: T[]): T[] {
  const turns: T[] = [];

  for (const creature of creatures) {
    const turnsOfCreature = new Array<T>(Creatures.stats(creature).agility).fill(creature); 
    turns.push(...turnsOfCreature);
  }

  return shuffle(turns);
}
