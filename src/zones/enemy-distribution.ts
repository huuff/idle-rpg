import {Creature} from "@/creatures/creature";
import { Species } from "@/creatures/species";
import { normalizeFrequencies, randomByNormalizedFrequency } from "@/util/random";

type EnemyWithLevel = {
  species: Species;
  averageLevel: number;
}

export type EnemySpecification = {
  frequency: number;
} & EnemyWithLevel;

export function createEnemyFactory(spec: EnemySpecification[]): () => Creature {
  const normalizedFrequencies = normalizeFrequencies(
    spec.map(e => [ { 
      species: e.species,
      averageLevel: e.averageLevel,
    }, e.frequency] as [EnemyWithLevel, number]));

    return () => {
      const type = randomByNormalizedFrequency(normalizedFrequencies);

      return new Creature({
        species: type.species,
        level: type.averageLevel,
      });
    }
}
