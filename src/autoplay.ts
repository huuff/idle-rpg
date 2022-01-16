import { Ref } from "vue";
import { Creature } from "@/creatures/creature";
import { SceneLog } from "./scene-log";
import { MapStatus, matchMapStatus } from "./map/map-status";

const delayBetweenScenes = 1500;

type NextStatusAction = "continue" | "arrived" | "rest";

type NextStatus = {
  status: MapStatus;
  action: NextStatusAction;
}

export class Autoplay {
  constructor(
    private readonly status: Ref<MapStatus>,
    private readonly player: Ref<Creature>,
    private readonly log: Ref<SceneLog>,
  ) {}

  public changeStatus(): void {
    const nextStatus = this.nextStatus();

    if (nextStatus.action === "arrived"
        && nextStatus.status.type === "resting"
       ) {
      this.log.value.push(`You arrived at ${nextStatus.status.in}`)
    } else if (nextStatus.action === "rest"
              && nextStatus.status.type === "resting") {
      this.log.value.push(`You feel tired. You return to ${nextStatus.status.in} to rest`);
    }

    this.setStatusWithDelay(nextStatus.status, delayBetweenScenes);
  }

  private nextStatus(): NextStatus {
    return matchMapStatus<NextStatus>(this.status.value, 
      (resting) => ({
        status: resting,
        action: "continue",
      }),
      (travelling) => {
        if (this.player.value.currentHealth <= 0.5) {
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
      this.log.value.clear();
      this.status.value = status;
    }, delay)
  }
}
