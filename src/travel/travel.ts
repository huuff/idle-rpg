import {Creature} from "@/creatures/creature";
import { TravellingStatus} from "@/map/map-status";
import {TravelAction} from "./travel-action";
import { useTravelStore } from "./travel-store";
import { useMainStore, } from "@/store"
import { Tickable } from "@/ticking/async-ticker";
import { makeTickableWithEnd } from "@/ticking/tickable-with-end";
import { autoTravel } from "@/travel/autotraveller";
import { makeTravelScene } from "@/scenes/travel-scene";
import {DecisionTickable} from "@/ticking/decision-tickable";

export type TravelDecisionMaker = (status: TravellingStatus, player: Creature) => TravelAction;

const noLastActionError = new Error("Travel was ended without deciding a last action!");

export class Travel implements Tickable {
  public readonly scene = makeTravelScene();
  private readonly travelStore: ReturnType<typeof useTravelStore>
  private readonly store: ReturnType<typeof useMainStore>
  private lastAction: TravelAction | undefined;

  constructor(
    private decisionMaker: TravelDecisionMaker = autoTravel,
  ){
    this.travelStore = useTravelStore();
    this.store = useMainStore();
    this.store.travelLog.clear();
  }

  public tick(): void | Tickable {
    // By this point, isOver has been called and thus we know
    // that we must be travelling if this is being executed
    
    const status = this.travelStore.mapStatus as TravellingStatus;
    if (status.encounters === 2) {
      return new DecisionTickable(10, (decision) => {
        if (decision.type === "retreat"){
          this.lastAction = decision;
        }
      });
    }

    const action = this.decisionMaker(status, this.store.player);

    if (action.type === "continue") {
      const battle = status.through.newEncounter(status.encounters);
      return makeTickableWithEnd(battle, () => {
        status.encounters++;
        this.travelStore.takeAction(action);
      })
    } else {
      this.lastAction = action;
      status.encounters++;
    }
  }

  public lastTick(): void {
    if (!this.lastAction)
      throw noLastActionError;

    // Must be travelling since the last action is not yet taken
    const status = this.travelStore.mapStatus as TravellingStatus; 
    if (this.lastAction.type === "arrive") {
      this.store.travelLog.messages.push(`You arrived at ${status.to.name}.`)
    } else if (this.lastAction.type === "retreat") {
      this.store.travelLog.messages.push(`You feel a little tired, so you return to ${status.from.name} to rest.`)
    }
  }

  public onEnd(): void {
    if (!this.lastAction)
      throw noLastActionError;

    this.travelStore.takeAction(this.lastAction);
  }

  public isOver(): boolean {
    return !!this.lastAction;
  }
}
