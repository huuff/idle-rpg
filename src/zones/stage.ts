import { Battle } from "@/battle/battle";
import { Species, createCreature } from "@/creatures/species";
import {
  randomByNormalizedFrequency,
  normalizeFrequencies,
  randomInt,
} from "@/util/random";
import { nrange } from "@/util/range";
import { useMainStore } from "@/store";

export class StageEnemy {
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
}
