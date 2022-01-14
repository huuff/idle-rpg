import { Actor } from "@/battle/actor";
import { Battle } from "@/battle/battle";
import { Species, createActor, slime } from "@/actors/species";
import range from "@/util/range";
import { randomInt } from "@/util/random";

export interface Zone {
  enemyToFrequency: Map<Species, number>
  newEncounter(player: Actor): Battle;
}

export const plains: Zone = {
  enemyToFrequency: new Map([
    [slime, 1] ,
  ]),

  // TODO: Generalize this for any zone
  // use frequency to generate an appropriate number
  // of enemies
  newEncounter(player: Actor): Battle {
    const enemies = range(randomInt(3)).map(i => createActor(slime, i+1))

    return new Battle([ player ], enemies);
  }
}
