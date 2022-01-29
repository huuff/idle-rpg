import { EnemySpecification } from "./enemy-distribution";

export interface Stage {
  steps: number;
  enemies: EnemySpecification[];
}