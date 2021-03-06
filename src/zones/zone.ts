import { Stage, } from "./stage";
import { accumulate } from "@/util/accumulate";
import { sum } from "lodash";
import { BattleArea } from "@/battle/battle-area";
import { ReadonlyDeep } from "type-fest";

export interface Zone {
  readonly name: string;
  readonly stages: readonly Stage[];
  readonly areas: readonly BattleArea[];
}

function accumulateStagesBySteps(stages: readonly ReadonlyDeep<Stage>[]): Stage[] {
  return accumulate(
      stages,
      (s) => s.steps + 1, // One for the checkpoint
      (s, accSteps) => ({ ...s, steps: accSteps }));
}

function totalSteps(zone: Zone): number {
  // Sum all stages' steps and add one for each for a checkpoint
  return sum(zone.stages.map(s => s.steps)) + zone.stages.length
}

function isComplete(zone: Zone, steps: number): boolean {
  return steps >= totalSteps(zone);
}

export type StageAndIndex = {
  readonly stage: Stage;
  readonly index: number;
}

function currentStage(zone: Zone, steps: number): StageAndIndex {
  const index = accumulateStagesBySteps(zone.stages).findIndex(s => steps < s.steps);
  return {
    stage: zone.stages[index],
    index,
  }
}

function isCheckpoint(zone: Zone, steps: number): boolean {
  return accumulateStagesBySteps(zone.stages).some(s => s.steps === steps);
}

export default {
  totalSteps,
  isComplete,
  currentStage,
  isCheckpoint,
}