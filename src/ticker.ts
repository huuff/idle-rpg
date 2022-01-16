import { Scene } from "@/scene";

export class Ticker {
  private scene: Scene | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private onEnd: (() => void) | undefined;

  constructor(
    private readonly frameRate: number,
  ) {}

  public startScene(scene: Scene, onEnd: () => void) {
    clearTimeout(this.timer);
    this.scene = scene;
    this.onEnd = onEnd;
    scene.firstTick && scene.firstTick();
    this.setTimer();
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
        this.onEnd && this.onEnd();
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
