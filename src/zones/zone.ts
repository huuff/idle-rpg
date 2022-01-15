import { Creature } from "@/creatures/creature";
import { Battle } from "@/battle/battle";
import { Species, createCreature, slime } from "@/creatures/species";
import { nrange } from "@/util/range";
import { 
  randomInt, 
  randomByNormalizedSortedFrequency,
  normalizeAndSortFrequencies, 
   } from "@/util/random";

export class Zone {
  private readonly enemyToFrequency: [Species, number][];
  public currentStage = 1;

  constructor(
    public readonly name: string,
    public readonly stages: number,
    enemyToFrequency: [Species, number][],
  ) {
    this.enemyToFrequency = normalizeAndSortFrequencies(enemyToFrequency);
  }

  public newEncounter(player: Creature): Battle {
    const enemies = nrange(randomInt(3))
    .map(i => createCreature(
      randomByNormalizedSortedFrequency(this.enemyToFrequency),
      i,
    ));

    return new Battle([player], enemies);
  }
}

export const createPlains = () => new Zone("Plains", 5, [
  [slime, 1],
]);
