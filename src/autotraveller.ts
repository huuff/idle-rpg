import { MapStatus, matchMapStatus } from "./map/map-status";
import { useMainStore } from "@/store";
import { hasDestination } from "./autoplay";
import { resolveMapStatusChange, mapStatusChangeToString } from "@/map/map-status-change";

// TODO: This mixes a lot of concerns, especially, it manages choosing the next mapStatus, but also makes autoplay work (decides whether to do an action automatically)
// Also, gives the messages related to travel (arriving at a place, retreating)
// TODO: Adding two todos because the logic is a real clusterfuck here. Maybe I should use FSM or something?
// TODO: Maybe just call it traveller and manage returning or advancing?

export class AutoTraveller {
  private readonly store = useMainStore();
  private readonly delayBetweenScenes: number;

  constructor() {
    this.delayBetweenScenes = Math.round(this.store.tickDuration * 1.5);
  }

  // TODO: Maybe name it update status
  public changeStatus(): void {
    const nextStatus = this.nextStatus();
    const statusChange = resolveMapStatusChange(this.store.mapStatus as MapStatus, nextStatus);

    if (statusChange.type === "continue" && statusChange.status.type === "resting")
      return;

    // TODO: This should be governed by some autoplay standalone handler
    if (hasDestination(this.store.autoplay)
        && statusChange.type === "arrival" 
        && statusChange.at === this.store.autoplay.to) {
        // Autoplay arrived at destination, remove it
       // as an objective
        this.store.autoplay = "enabled";
       }

    const statusChangeDescription = mapStatusChangeToString(statusChange);
    if (statusChangeDescription)
      this.store.log.push(statusChangeDescription);

    this.setStatusWithDelay(nextStatus, this.delayBetweenScenes);
  }

  private nextStatus(): MapStatus {
    return matchMapStatus<MapStatus>(this.store.mapStatus, 
      (resting) => {
        if (this.store.player.healthRatio < 1) {
          return resting;
        } else {
          if (hasDestination(this.store.autoplay)) {
            return {
                type: "travelling",
                from: resting.in,
                to: this.store.autoplay.to,
                through: this.store.autoplay.through(),
                encounters: 0
            };
          } else {
            return resting;
          }
        }
      },
      (travelling) => {
        // We just come from travelling so we assume we've had one encounter
        const encountersHad = travelling.encounters + 1;
        if (travelling.through.isComplete(encountersHad)) {
          return {
              type: "resting",
              in: travelling.to,
            };
          } else if (this.store.player.healthRatio <= 0.15) {
          return {
              type: "resting",
              in: travelling.from,
            };
        } else {
          return  { ...travelling, encounters: encountersHad};
        }
      }
    );
  }

  private setStatusWithDelay(status: MapStatus, delay: number): void {
    setTimeout(() => {
      this.store.log.clear();
      this.store.setMapStatus(status)
    }, delay)
  }
}
