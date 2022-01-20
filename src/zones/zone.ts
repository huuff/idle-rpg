import { Battle } from "@/battle/battle";
import { slime } from "@/creatures/species";
import { Stage, StageEnemy, StageImpl } from "./stage";
   
export class Zone {
  constructor(
    public readonly name: string,
    public readonly stages: Stage[],
  ) {}

  public get stageNumber(): number {
    return this.stages.length;
  }

  public isComplete(encountersHad: number): boolean {
    return encountersHad >= this.stages.reduce((acc, stage) => acc + stage.encounters, 0);
  }

  public newEncounter(encountersHad: number): Battle {
    const stage = this.stageFromEncounterNumber(encountersHad);
    return this.stages[stage].newEncounter()
  }

  public stageFromEncounterNumber(encounters: number): number {
    let result = 0;
    let accStages = 0;
    for (const stage of this.stages) {
      accStages += stage.encounters;
      if (encounters < accStages)
        return result;
      else
        result++;
    }

    throw new Error(`Called stageFromEncounterNumber with ${encounters} encounters, which means this zone is complete!`)
  }
}

export const createPlains = () => new Zone("Plains", [
  new StageImpl([new StageEnemy(slime, 1, 1)], 4),
  new StageImpl([new StageEnemy(slime, 2, 1)], 4),
  new StageImpl([new StageEnemy(slime, 3, 1)], 4),
  new StageImpl([new StageEnemy(slime, 4, 1)], 4),
]);
