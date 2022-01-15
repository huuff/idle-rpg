import { Ref } from "vue";
import { Scene } from "@/scene";
import { Creature } from "@/creatures/creature";
import { useMainStore } from "@/store";
import { Rest } from "@/rest-scene";
import {Zone} from "./zones/zone";
import {Ticker} from "./ticker";
import {Settlement} from "./settlements/settlement";
import { SceneLog } from "./scene-log";

export class SceneChanger {
  private readonly player: Creature;
  private readonly log: SceneLog;

  // TODO: Too many dependencies!
  // Maybe some of these should be in the pinia store?
  constructor(
    private readonly currentScene: Ref<Scene | undefined>,
    private readonly currentZone: Ref<Zone>,
    private readonly currentSettlement: Ref<Settlement>,
    private readonly ticker: Ticker,
  ) {
    const store = useMainStore();
    this.log = store.log as SceneLog;
    this.player = store.player;
  }

  public changeScene() {
    const nextScene = this.nextScene();

    if (nextScene instanceof Rest) {
      this.log.push(`You feel a little tired, so you return to ${this.currentSettlement.value.name} to rest`);
      setTimeout(() => {
        this.log.clear();
        this.currentScene.value = nextScene;
        this.ticker.startScene(nextScene, this.changeScene.bind(this))
      }, 1500)
    } else if (nextScene){
      this.log.clear();
      this.currentScene.value = nextScene;
      this.ticker.startScene(nextScene, this.changeScene.bind(this));
    } else {
      return;
    }
  }
  
  private nextScene(): Scene | undefined {
    if (this.player.currentHealth <= 0) {
      return; // Game over
    } else if (this.player.healthRatio <= 0.50) {
      return new Rest();
    } else {
      return this.currentZone.value.newEncounter(); 
    }
  }
}
