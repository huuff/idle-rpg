import { h, ref, } from "vue";
import { Tickable } from "./async-ticker";
import { Scene } from "@/scenes/scene";
import { TravelAction } from "@/travel/travel-action";
import TravelDecision from "@/components/scenes/TravelDecision.vue";
import AutoplayCheckbox from "@/components/AutoplayCheckbox.vue";

export class DecisionTickable implements Tickable {
  private ticksHad = ref(0);
  private decision: TravelAction | undefined;

  public readonly scene: Scene = {
    mainView: () => h(
      TravelDecision,
      {
        ticksDuration: this.ticksDuration,
        ticksHad: this.ticksHad,
        onContinue: () => this.decision = { type: "continue" },
        onRetreat: () => this.decision = { type: "retreat" },
      }, 
    ),
    sideView: () => h(AutoplayCheckbox, {}),
  }

  constructor(
    private readonly ticksDuration: number,
    private readonly runDecision: (decision: TravelAction) => void,
  ){ }

  public tick(): void {
    this.ticksHad.value++;
  }

  public isOver(): boolean {
    return (this.ticksHad.value > this.ticksDuration) || !!this.decision;
  }

  public onEnd() {
    return this.runDecision(this.decision ?? { type: "continue" });
  }
}
