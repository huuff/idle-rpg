import { MapStatus, matchMapStatus } from "./map/map-status";
import { useMainStore } from "@/store";

type NextStatusAction = "continue" | "arrived" | "rest";

type NextStatus = {
  status: MapStatus;
  action: NextStatusAction;
}
// TODO: This isn't actually autoplay! (or is it?)
// this just goes to next encounter/stage/rest/location
// when appropriate, but this should also be done when not on
// autoplay

// TODO: Even if this was the autoplay handler, it mixes serveral
// responsibilities
// For example, telling whether you arrived somewhere or returned to rest might be a responsibility of some watcher for scene changes
// But the need to have a delay for it makes it hard for me to find where to put these.

export class Autoplay {
  private readonly store = useMainStore();
  private readonly delayBetweenScenes: number;

  constructor() {
    this.delayBetweenScenes = Math.round(this.store.tickDuration * 1.5);
  }

  public changeStatus(): void {
    const nextStatus = this.nextStatus();

    if (nextStatus.action === "continue" && nextStatus.status.type === "resting")
      return;

    if (nextStatus.action === "arrived"
        && nextStatus.status.type === "resting"
       ) {
      this.store.log.push(`You arrived at ${nextStatus.status.in.name}`)
    } else if (nextStatus.action === "rest"
              && nextStatus.status.type === "resting") {
      this.store.log.push(`You feel tired. You return to ${nextStatus.status.in.name} to rest`);
    }

    this.setStatusWithDelay(nextStatus.status, this.delayBetweenScenes);
  }

  private nextStatus(): NextStatus {
    return matchMapStatus<NextStatus>(this.store.mapStatus as MapStatus, 
      (resting) => ({
        status: resting,
        action: "continue",
      }),
      (travelling) => {
        // We just come from travelling so we assume we've had one encounter
        const encountersHad = travelling.encounters + 1;
        if (travelling.through.isComplete(encountersHad)) {
          return {
            status: {
              type: "resting",
              in: travelling.to,
            },
            action: "arrived",
          }
        }
        else if (this.store.player.healthRatio <= 0.15) {
          return {
            status: {
              type: "resting",
              in: travelling.from,
            },
            action: "rest",
          };
        } else {
          return {
            status: { ...travelling, encounters: encountersHad},
            action: "continue",
          };
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
