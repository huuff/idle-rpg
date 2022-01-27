import { Battle } from "@/battle/battle";
import { randomInt } from "@/util/random";
import { nrange } from "@/util/range";
import { useMainStore } from "@/store";
import { createEnemyFactory, EnemySpecification } from "./enemy-distribution";

export interface Stage {
  steps: number;
  newEncounter: () => Battle; // TODO: This out of here, create an encounter from an stage
}

export function createStage({ steps, enemies }: { steps: number, enemies: EnemySpecification[]}): Stage {
  const createEnemy = createEnemyFactory(enemies);
  return {
    steps,
    newEncounter: () => {
      const { player } = useMainStore();
      const enemies = nrange(randomInt(3)).map((_) => createEnemy());
      return new Battle([player], enemies);
    }
  }
}
