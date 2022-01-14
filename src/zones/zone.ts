import { Creature } from "@/creatures/creature";
import { Battle } from "@/battle/battle";
import { Species, createCreature, slime } from "@/creatures/species";
import range from "@/util/range";
import { randomInt } from "@/util/random";

export interface Zone {
  name: string;
  stages: number;
  enemyToFrequency: Map<Species, number>;
  newEncounter(player: Creature): Battle;
}

export const plains: Zone = {
  name: "Plains",
  stages: 5,
  enemyToFrequency: new Map([
    [slime, 1] ,
  ]),

  // TODO: Generalize this for any zone
  // use frequency to generate an appropriate number
  // of enemies
  newEncounter(player: Creature): Battle {
    const enemies = range(randomInt(3)).map(i => createCreature(slime, i+1))

    return new Battle([ player ], enemies);
  }
}
