import { h } from "vue";
import { Tickable } from "./async-ticker";
import { Scene } from "@/scenes/scene";
import { TravelDecisionMaker } from "@/travel/travel";
import { TravellingStatus} from "@/map/map-status";
import {Creature} from "@/creatures/creature";
import { TravelAction } from "@/travel/travel-action";

export class DecisionTickable implements Tickable, TravelDecisionMaker {
  private ticksHad = 0;
  private decision: TravelAction | undefined;

  public readonly scene: Scene = {
    mainView: () => h(
      "div",
      {}, 
      h("button", { onClick: () => this.decision = { type: "retreat"} }, "retreat")
    )
  }

  constructor(
    private readonly ticksDuration: number,
  ){ }

  public isOver(): boolean {
    return (this.ticksHad > this.ticksDuration) || !!this.decision;
  }

  public tick(): void {
    this.ticksHad++;
  }

  public decide(_1: TravellingStatus, _2: Creature): TravelAction {
    return this.decision ?? { type: "continue" };
  } 
}
