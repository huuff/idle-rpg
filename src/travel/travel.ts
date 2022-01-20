import {Creature} from "@/creatures/creature";
import { RestingStatus, TravellingStatus} from "@/map/map-status";
import {TravelAction} from "./travel-action";
import { useTravelStore } from "./travel-store";
import { useMainStore, } from "@/store"
import { Tickable } from "@/ticking/async-ticker";
import { makeTickableWithEnd } from "@/ticking/tickable-with-end";
import { autoTravel } from "@/travel/autotraveller";
import { makeTravelScene } from "@/scenes/travel-scene";

export type TravelDecisionMaker = (status: TravellingStatus, player: Creature) => TravelAction;

export class Travel implements Tickable {
  public readonly scene = makeTravelScene();
  private readonly travelStore: ReturnType<typeof useTravelStore>
  private readonly store: ReturnType<typeof useMainStore>
  private lastAction: TravelAction | undefined;

  constructor(
    private readonly decisionMaker: TravelDecisionMaker = autoTravel,
  ){
    this.travelStore = useTravelStore();
    this.store = useMainStore();
  }

  public tick(): void | Tickable {
    // At this point, isOver has been called and thus we know
    // that we must be travelling if this is being executed
    const status = this.travelStore.mapStatus as TravellingStatus;
    this.store.log.clear();

    const action = this.decisionMaker(status, this.store.player);
    this.lastAction = action; // See below todo

    if (action.type === "continue") {
      const battle = status.through.newEncounter(status.encounters);
      return makeTickableWithEnd(battle, () => {
        status.encounters++;
        this.travelStore.takeAction(action);
      })
    } else {
      this.travelStore.takeAction(action);
    }
  }

  // Still not working
  public lastTick(): void {
    if (!this.lastAction)
      return;

    // Must be resting since the travel is over
    const status = this.travelStore.mapStatus as RestingStatus; 
    if (this.lastAction.type === "arrive") {
      this.store.log.messages.push(`You arrived at ${status.at.name}.`)
    } else if (this.lastAction.type === "retreat") {
      this.store.log.messages.push(`You feel a little tired, so you return to ${status.at.name} to rest.`)
    }
  }

  public isOver(): boolean {
    return this.travelStore.mapStatus.type !== "travelling";
  }
}
