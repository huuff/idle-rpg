import { MapStatus, matchMapStatus } from "./map/map-status";
import { useMainStore } from "@/store";
import {hasDestination} from "./autoplay";

type NextStatusAction = "continue" | "arrived" | "rest";

type NextStatus = {
  status: MapStatus;
  action: NextStatusAction;
}
// TODO: This mixes a lot of concerns, especially, it manages choosing the next mapStatus, but also makes autoplay work (decides whether to do an action automatically)
// Also, gives the messages related to travel (arriving at a place, retreating)
// TODO: Adding two todos because the logic is a real clusterfuck here. Maybe I should use FSM or something?

export class AutoTraveller {
  private readonly store = useMainStore();
  private readonly delayBetweenScenes: number;

  constructor() {
    this.delayBetweenScenes = Math.round(this.store.tickDuration * 1.5);
  }

  public changeStatus(): void {
    const nextStatus = this.nextStatus();

    if (nextStatus.action === "continue" && nextStatus.status.type === "resting")
      return;

    if ( nextStatus.action === "arrived" 
        && nextStatus.status.type === "resting"
        && hasDestination(this.store.autoplay) 
        && nextStatus.status.in === this.store.autoplay.to
       ) {
        // Autoplay arrived at destination, remove it
         // as an objective
        this.store.autoplay = "enabled";
       }

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
      (resting) => {
        if (this.store.player.healthRatio < 1) {
          return {
            status: resting,
            action: "continue",
          }
        } else {

          if (hasDestination(this.store.autoplay)) {
            return {
              status: {
                type: "travelling",
                from: resting.in,
                to: this.store.autoplay.to,
                through: this.store.autoplay.through(),
                encounters: 0
              },
              action: "continue",
            }
          } else {
            return {
              status: resting,
              action: "continue",
            }
          }
        }
      },
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
