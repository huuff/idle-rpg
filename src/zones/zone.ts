import { useTravelStore } from "@/travel/travel-store";
import { slime } from "@/creatures/species";
import { Stage, createStage } from "./stage";
import { accumulate } from "@/util/accumulate";

export interface Zone {
  name: string;
  stages: Stage[];
  totalSteps: () => number;
  isComplete: () => boolean;
  currentStage: () => { stage: Stage, index: number};
  isCheckpoint: () => boolean;
}

function accumulateStagesBySteps(stages: Stage[]): Stage[] {
  return accumulate(
      stages,
      (s) => s.steps + 1, // One for the checkpoint
      (s, accSteps) => ({ ...s, steps: accSteps }));
}

export function createZone({ name, stages }: { name: string, stages: Stage[]}): Zone {
  return {
    name,
    stages,
    totalSteps: () => {
      // Sum all stages' steps and add one for each for a checkpoint
      return stages.map(s => s.steps).reduce((s1, s2) => s1 + s2, 0) + stages.length;
    },
    isComplete() {
      const { mapStatus: status } = useTravelStore();
      return status.type === "travelling"
        && status.steps >= this.totalSteps();
    },
    currentStage() {
      const { mapStatus: status } = useTravelStore();
      if (status.type !== "travelling") {
        throw new Error(`Shouldn't call 'currentStage' when not travelling`);
      }

      const index = accumulateStagesBySteps(stages).findIndex(s => status.steps < s.steps);
      return {
        stage: stages[index],
        index,
      }
    },
    isCheckpoint() {
      const { mapStatus: status } = useTravelStore();
      if (status.type !== "travelling") {
        throw new Error(`Shouldn't call 'isCheckpoint' when not travelling!`)
      }

      return accumulateStagesBySteps(stages).some(s => s.steps === status.steps)
    }
  }
}

export const plains = createZone({
  name: "Plains",
  stages: [
    createStage({ steps: 5, enemies: [{ species: slime, averageLevel: 1, frequency: 1}]}),
    createStage({ steps: 5, enemies: [{ species: slime, averageLevel: 2, frequency: 1}]}),
    createStage({ steps: 5, enemies: [{ species: slime, averageLevel: 3, frequency: 1}]}),
    createStage({ steps: 5, enemies: [{ species: slime, averageLevel: 4, frequency: 1}]}),
  ]
});
