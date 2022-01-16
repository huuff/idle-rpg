import { Ref } from "vue";
import { Creature } from "@/creatures/creature";
import { SceneLog } from "./scene-log";
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

    if (nextStatus.action === "arrived"
        && nextStatus.status.type === "resting"
       ) {
      this.store.log.push(`You arrived at ${nextStatus.status.in}`)
    } else if (nextStatus.action === "rest"
              && nextStatus.status.type === "resting") {
      this.store.log.push(`You feel tired. You return to ${nextStatus.status.in.name} to rest`);
    }

    console.log("Changing status in a delay")
    this.setStatusWithDelay(nextStatus.status, delayBetweenScenes);
  }

  private nextStatus(): NextStatus {
    return matchMapStatus<NextStatus>(this.store.mapStatus as MapStatus, 
      (resting) => ({
        status: resting,
        action: "continue",
      }),
      (travelling) => {
        if (this.store.player.currentHealth <= 0.5) {
          return {
            status: {
              type: "resting",
              in: travelling.from,
            },
            action: "rest",
          };
          // TODO: Solve this
        } else if (false) { //eslint-disable-line
          return {
            status: {
              type: "resting",
              in: travelling.to,
            },
            action: "arrived",
          }
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
