import { Battle } from "@/battle/battle";
import { Species, createCreature, slime } from "@/creatures/species";
import { nrange } from "@/util/range";
import { 
  randomInt, 
  randomByNormalizedFrequency,
  normalizeFrequencies, 
} from "@/util/random";
import {useMainStore} from "@/store";

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
  private encountersHad = 0;

  constructor(
    enemies: StageEnemy[],
    private readonly encounters: number,
  ) {
    this.enemyToFrequency = normalizeFrequencies(
      enemies.map(e => e.toFrequencyTuple())
    );
  }

  public newEncounter(): Battle {
    const { player } = useMainStore();
    const enemies = nrange(randomInt(3))
    .map(i => {
      const enemy = randomByNormalizedFrequency(this.enemyToFrequency);
      return createCreature(enemy.species, i, enemy.averageLevel)
    });
    this.encountersHad++;

    return new Battle([player], enemies);
  }

  public isCompleted(): boolean {
    return this.encountersHad >= this.encounters;
  }

  public reset(): void {
    this.encountersHad = 0;
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

  public newEncounter(): Battle {
    if (this.currentStageObject().isCompleted()) {
      this.currentStage++;
    }
    return this.currentStageObject().newEncounter()
  }

  public reset(): void {
    this.currentStage = 1;
    this.stages.forEach(s => s.reset());
  }

  private currentStageObject(): Stage {
    return this.stages[this.currentStage - 1];
  }
}

export const createPlains = () => new Zone("Plains", [
  new Stage([new StageEnemy(slime, 1, 1)], 5),
  new Stage([new StageEnemy(slime, 2, 1)], 5),
  new Stage([new StageEnemy(slime, 3, 1)], 5),
  new Stage([new StageEnemy(slime, 4, 1)], 5),
]);
