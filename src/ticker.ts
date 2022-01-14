import { Scene } from "@/scene";

export class Ticker {
  private scene: Scene | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private onEnd: (() => void) | undefined;

  constructor(
    private readonly frameRate: number,
    private readonly delayBetweenScenes: number,
  ) {}

  public startScene(scene: Scene, onEnd: () => void) {
    this.scene = scene;
    this.onEnd = onEnd;
    setTimeout(this.setTimer.bind(this), this.delayBetweenScenes);
  }

  public stop(): void {
    clearTimeout(this.timer);
  }

  private tick(): void {
    if (this.scene) {
      if (!this.scene.isOver()) {
        this.scene.tick();
        this.setTimer();
      } else {
        this.onEnd && setTimeout(this.onEnd, this.delayBetweenScenes);
      }
    }
  }

  private setTimer(): void {
    this.timer = setTimeout(this.tick.bind(this), this.tickDuration());
  }

  private tickDuration(): number {
    return Math.ceil(1000 / this.frameRate);
  }
}
