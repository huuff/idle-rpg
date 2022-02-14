import { EnemySpecification } from "./enemy-distribution";

export interface Stage {
  readonly steps: number;
  readonly enemies: readonly EnemySpecification[];
}