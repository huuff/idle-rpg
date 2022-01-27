import { Battle } from "@/battle/battle";
import { randomInt } from "@/util/random";
import { nrange } from "@/util/range";
import { useMainStore } from "@/store";
import { createEnemyFactory, EnemySpecification } from "./enemy-distribution";

export interface Stage {
  steps: number;
  enemies: EnemySpecification[];
}

export function newEncounter(stage: Stage): Battle {
  const createEnemy = createEnemyFactory(stage.enemies);
  const { player } = useMainStore();
  const enemies = nrange(randomInt(3)).map((_) => createEnemy());
  return new Battle([player], enemies);
}
