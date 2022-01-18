import {Creature} from "./creatures/creature";
import { TravellingStatus} from "./map/map-status";
import {TravelAction} from "./travel-action";
import { useTravelStore } from "./travel-store";
import { useMainStore, } from "@/store"
import { Ticker, Tickable } from "@/ticker";

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

  public tick(): Ticker {
    // At this point, isOver has been called and thus we know
    // that we must be travelling if this is being executed
    const status = this.travelStore.mapStatus as TravellingStatus;

    const battle = status.through.newEncounter(status.encounters);
    this.store.battle = battle;
    return new Ticker(battle, () => {
      status.encounters++;
      this.travelStore.takeAction(this.decisionMaker(status, this.store.player));
    })
  }

  public isOver(): boolean {
    return this.travelStore.mapStatus.type !== "travelling";
  }
}
