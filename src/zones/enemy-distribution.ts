import Creatures, { Creature } from "@/creatures/creature";
import { Species } from "@/creatures/species";
import { normalizeFrequencies, randomByNormalizedFrequency } from "@/util/random";

type EnemyWithLevel = {
  readonly species: Species;
  readonly averageLevel: number;
}

export type EnemySpecification = {
  readonly frequency: number;
} & EnemyWithLevel;

export function createEnemyFactory(spec: Readonly<EnemySpecification[]>): () => Creature {
  const normalizedFrequencies = normalizeFrequencies(
    spec.map(e => [ { 
      species: e.species,
      averageLevel: e.averageLevel,
    }, e.frequency] as [EnemyWithLevel, number]));

    return () => {
      const type = randomByNormalizedFrequency(normalizedFrequencies);

      return Creatures.birth({
        species: type.species,
        level: type.averageLevel,
      });
    }
}
