import { h } from "vue";
import { Tickable } from "./async-ticker";
import { Scene } from "@/scenes/scene";
import { TravelAction } from "@/travel/travel-action";
import TravelDecision from "@/components/scenes/TravelDecision.vue";

export class DecisionTickable implements Tickable {
  private ticksHad = 0;
  private decision: TravelAction | undefined;

  public readonly scene: Scene = {
    mainView: () => h(
      TravelDecision,
      {
        onContinue: () => this.decision = { type: "continue" },
        onRetreat: () => this.decision = { type: "retreat" },
      }, 
    )
  }

  constructor(
    private readonly ticksDuration: number,
    private readonly runDecision: (decision: TravelAction) => void,
  ){ }

  public tick(): void {
    this.ticksHad++;
  }

  public isOver(): boolean {
    return (this.ticksHad > this.ticksDuration) || !!this.decision;
  }

  public onEnd() {
    return this.runDecision(this.decision ?? { type: "continue" });
  }
}
