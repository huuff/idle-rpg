import { MapStatus, } from "./map/map-status";
import { useMainStore } from "@/store";
import { resolveNextStatus, TravelAction } from "@/travel-action";
import { TravellingStatus } from "@/map/map-status";
import { Creature } from "@/creatures/creature";
import {useTravelStore} from "./travel-store";

export class AutoTraveller {
  private readonly store = useMainStore();
  private readonly travelStore = useTravelStore();
  private readonly delayBetweenScenes: number;

  constructor() {
    this.delayBetweenScenes = Math.round(this.store.tickDuration * 1.5);
  }

  public updateStatus(): void {
    const currentStatus = this.travelStore.mapStatus as TravellingStatus; // TODO fix it
    const player = this.store.player;
    const nextAction = this.resolveAction(currentStatus, player);

    this.takeActionWithDelay(nextAction, this.delayBetweenScenes);
  }

  private resolveAction(status: TravellingStatus, player: Creature): TravelAction {
    if (status.through.isComplete(status.encounters)) {
      return "arrive";
    } else if (player.healthRatio < 0.15) {
      return "retreat";
    } else {
      return "continue";
    }
  }

  // TODO: Having delays is likely not the responsibility of the autotraveller
  private takeActionWithDelay(action: TravelAction, delay: number): void {
    setTimeout(() => {
      this.store.log.clear();
      this.travelStore.takeAction(action);
    }, delay)
  }
}
