import { Creature } from "@/creatures/creature";
import { Battle } from "@/battle/battle";
import { Species, createCreature, slime } from "@/creatures/species";
import { nrange } from "@/util/range";
import { 
  randomInt, 
  randomByNormalizedSortedFrequency,
  normalizeAndSortFrequencies, 
} from "@/util/random";

class StageEnemy {
  constructor(
    public readonly species: Species,
    public readonly averageLevel: number,
    public readonly frequency: number,
  ) {}

  public toFrequencyTuple(): [StageEnemy, number] {
    return [ this, this.frequency ];
  }
}

export class Stage {
  private readonly enemyToFrequency: [StageEnemy, number][];

  constructor(
    enemies: StageEnemy[],
  ) {
    this.enemyToFrequency = normalizeAndSortFrequencies(
      enemies.map(e => e.toFrequencyTuple())
    );
  }

  public newEncounter(player: Creature): Battle {
    const enemies = nrange(randomInt(3))
    .map(i => createCreature(
      randomByNormalizedSortedFrequency(this.enemyToFrequency).species,
      i,
    ));

    return new Battle([player], enemies);
  }
}
   
export class Zone {
  public currentStage = 1;

  constructor(
    public readonly name: string,
    public readonly stages: Stage[],
  ) {}

  public get stageNumber(): number {
    return this.stages.length;
  }

  public newEncounter(player: Creature): Battle {
    return this.stages[this.currentStage - 1].newEncounter(player)
  }
}

export const createPlains = () => new Zone("Plains", [
  new Stage([new StageEnemy(slime, 1, 1)]),
  new Stage([new StageEnemy(slime, 2, 1)])
]);
