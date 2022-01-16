import { MapStatus, matchMapStatus } from "./map/map-status";
import { useMainStore } from "@/store";

const delayBetweenScenes = 1500;

type NextStatusAction = "continue" | "arrived" | "rest";

type NextStatus = {
  status: MapStatus;
  action: NextStatusAction;
}
// TODO: This isn't actually autoplay! (or is it?)
// this just goes to next encounter/stage/rest/location
// when appropriate, but this should also be done when not on
// autoplay

// TODO: It's not returning to rest correctly

export class Autoplay {
  private readonly store = useMainStore();

  public changeStatus(): void {
    const nextStatus = this.nextStatus();

    if (nextStatus.action === "continue" && nextStatus.status.type === "resting")
      return;

    if (nextStatus.action === "arrived"
        && nextStatus.status.type === "resting"
       ) {
      this.store.log.push(`You arrived at ${nextStatus.status.in}`)
    } else if (nextStatus.action === "rest"
              && nextStatus.status.type === "resting") {
      this.store.log.push(`You feel tired. You return to ${nextStatus.status.in.name} to rest`);
    }

    this.setStatusWithDelay(nextStatus.status, delayBetweenScenes);
  }

  private nextStatus(): NextStatus {
    return matchMapStatus<NextStatus>(this.store.mapStatus as MapStatus, 
      (resting) => ({
        status: resting,
        action: "continue",
      }),
      (travelling) => {
        if (travelling.through.isComplete(travelling.encounters)) {
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
            status: { ...travelling, encounters: travelling.encounters+1},
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
