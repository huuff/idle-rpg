import { reactive } from "vue";
import { useMainStore } from "@/store";
import { Creature, } from "@/creatures/creature";
import { chooseRandom } from "@/util/random";
import { calculateTurns } from "./turns";
import { makeExecution} from "./action-execution";
import { execute } from "./execute-action";
import { Tickable } from "@/ticking/async-ticker";
import {Scene} from "@/scenes/scene";
import {makeBattleScene} from "@/scenes/battle-scene";
import { renameCreatures } from "@/creatures/rename-creatures";
import { gameOver } from "@/game-over";
import { Spoils } from "@/tickables/spoils";
import { defaultBattleDecisionMaker } from "./battle-decision-maker";
import { isEmpty } from "lodash";

function allDead(creatures: Creature[]) {
  return creatures.every(c => !c.isAlive);
}

export type BattleResult = "lost" | "won" | "escaped";

export class Battle implements Tickable {
  public readonly scene: Scene;
  public readonly badGuys: Creature[];
  public result: BattleResult | undefined;
  private readonly log = useMainStore().battleLog;
  private turns: Creature[];
  
  constructor(
    public readonly goodGuys: Creature[],
    badGuys: Creature[],
  ) {
    this.log.clear();
    this.badGuys = reactive(renameCreatures(badGuys));
    this.turns = calculateTurns([...this.goodGuys, ...this.badGuys]);
    this.scene = makeBattleScene(this.badGuys);
  }

  public firstTick(): void {
    const enemyNames = this.badGuys
                        .map(a => a.name)
                        .join(", ");
    this.log.messages.push(`${enemyNames} appear!`);
  }

  public tick(): void {
    const aliveGoodGuys = this.goodGuys.filter(a => a.isAlive);
    const aliveBadGuys = this.badGuys.filter(a => a.isAlive);

    if (isEmpty(this.turns))
      this.turns = calculateTurns([ ...aliveGoodGuys, ...aliveBadGuys]);

    const attacker = this.turns.pop()!;
    const rivals = this.badGuys.includes(attacker)
     ? aliveGoodGuys 
     : aliveBadGuys;

    const action = defaultBattleDecisionMaker(attacker, rivals);

    if (action.type === "escape") {
      this.result = "escaped";
      return;
    }

    const target = chooseRandom(rivals);
    const execution = makeExecution(action, attacker, target);
    execute(execution, this.log);

    if (target.currentHealth <= 0) {
      this.turns = this.turns.filter(a => a.isAlive);
      this.log.messages.push(`${attacker.name} killed ${target.name}!`)
    }
  }
  
  public isOver(): boolean {
    return allDead(this.goodGuys) || allDead(this.badGuys) || !!this.result;
  }

  public lastTick(): void | Tickable {
    if (allDead(this.goodGuys)) {
      this.result = "lost";
      this.log.messages.push("You lost!");
    } else if (allDead(this.badGuys)) {
      this.result = "won";
      this.log.messages.push("You won!");
      return new Spoils(this.goodGuys, this.badGuys, this.log);
    } else if (this.result === "escaped") {
      this.log.messages.push("You escape the battle");
    } else {
      throw new Error("Called Battle's `endTick` but no end condition is reached!");
    }
  }

  public onEnd(): void {
    if (allDead(this.goodGuys)) {
      gameOver();
    }
  }
}
