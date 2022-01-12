import { Actor } from "@/battle/actor";
import shuffle from "lodash/shuffle"

// A series of turns is calculated, where each actor has
// 'n' turns, where 'n' is the actor's agility,
// The turns are then randomized
export function calculateTurns(actors: Actor[]): Actor[] {
  const turns: Actor[] = [];

  for (const actor of actors) {
    const turnsOfActor = new Array<Actor>(actor.stats.agility).fill(actor); 
    turns.push(...turnsOfActor);
  }

  return shuffle(turns);
}
