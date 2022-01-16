import { Battle } from "@/battle/battle";
import { Species, createCreature } from "@/creatures/species";
import { Creature } from"@/creatures/creature";
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

  constructor(
    enemies: StageEnemy[],
    public readonly encounters: number,
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

    return new Battle([player as Creature], enemies);
  }
}
