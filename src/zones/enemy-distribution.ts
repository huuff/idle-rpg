import {Creature} from "@/creatures/creature";
import { createCreature, Species } from "@/creatures/species";
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

      return createCreature(type.species, type.averageLevel);
    }
}
