import { Battle } from "@/battle/battle";
import { slime } from "@/creatures/species";
import { Stage, StageEnemy } from "./stage";
   
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
