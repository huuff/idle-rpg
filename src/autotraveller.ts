import { MapStatus, } from "./map/map-status";
import { useMainStore } from "@/store";
import { resolveNextStatus, TravelAction } from "@/travel-action";
import { TravellingStatus } from "@/map/map-status";
import { Creature } from "@/creatures/creature";

export class AutoTraveller {
  private readonly store = useMainStore();
  private readonly delayBetweenScenes: number;

  constructor() {
    this.delayBetweenScenes = Math.round(this.store.tickDuration * 1.5);
  }

  public updateStatus(): void {
    const currentStatus = this.store.mapStatus as TravellingStatus; // TODO fix it
    const player = this.store.player;
    const nextAction = this.resolveAction(currentStatus, player);

    const nextStatus = resolveNextStatus(currentStatus, nextAction);

    this.setStatusWithDelay(nextStatus, this.delayBetweenScenes);
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

  private setStatusWithDelay(status: MapStatus, delay: number): void {
    setTimeout(() => {
      this.store.log.clear();
      this.store.mapStatus = status;
    }, delay)
  }
}
