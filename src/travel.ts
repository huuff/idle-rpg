import {Creature} from "./creatures/creature";
import { TravellingStatus} from "./map/map-status";
import {TravelAction} from "./travel-action";
import { useTravelStore } from "./travel-store";
import { useMainStore, } from "@/store"
import { CallbackTickable, Tickable } from "@/ticker";

export type TravelDecisionMaker = (status: TravellingStatus, player: Creature) => TravelAction;

export class Travel implements Tickable {
  private readonly travelStore: ReturnType<typeof useTravelStore>
  private readonly store: ReturnType<typeof useMainStore>

  constructor(
    private readonly decisionMaker: TravelDecisionMaker,
  ){
    this.travelStore = useTravelStore();
    this.store = useMainStore();
  }

  public tick(): void | CallbackTickable {
    // At this point, isOver has been called and thus we know
    // that we must be travelling if this is being executed
    this.store.log.clear();
    const status = this.travelStore.mapStatus as TravellingStatus;

    const action = this.decisionMaker(status, this.store.player);

    if (action === "continue") {
      const battle = status.through.newEncounter(status.encounters);
      this.store.battle = battle;
      return {
        tickable: battle,
        callback: () => {
          status.encounters++;
          this.travelStore.takeAction(action);
          this.store.battle = undefined;
        }
      }
    } else {
      this.travelStore.takeAction(action);
    }
  }

  public isOver(): boolean {
    return this.travelStore.mapStatus.type !== "travelling";
  }
}
