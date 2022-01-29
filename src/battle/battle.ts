import { reactive } from "vue";
import { useMainStore } from "@/store";
import { Creature, } from "@/creatures/creature";
import { calculateTurns } from "./turns";
import { isEscapeExecution} from "./action-execution";
import { execute } from "./execute-action";
import { Tickable } from "@/ticking/async-ticker";
import {Scene} from "@/scenes/scene";
import {makeBattleScene} from "@/scenes/battle-scene";
import { renameCreatures } from "@/creatures/rename-creatures";
import { gameOver } from "@/game-over";
import { Spoils } from "@/tickables/spoils";
import { defaultBattleDecisionMaker } from "./battle-decision-maker";
import { isEmpty } from "lodash";
import Skills from "@/skills/skill";
import BattleAreas, { BattleArea } from "./battle-area";
import BattleStatuses, { CreatureWithStatus } from "./battle-status";

function allDead(creatures: Creature[]) {
  return creatures.every(c => !c.isAlive);
}

export type BattleResult = "lost" | "won" | "escaped";

export class Battle implements Tickable {
  public readonly scene: Scene;
  public readonly badGuys: CreatureWithStatus[];
  public readonly goodGuys: CreatureWithStatus[];
  public result: BattleResult | undefined;
  private readonly log = useMainStore().battleLog;
  private turns: CreatureWithStatus[];
  
  constructor(
    goodGuys: Creature[],
    badGuys: Creature[],
    private readonly areas: BattleArea[],
  ) {
    this.log.clear();
    this.badGuys = reactive(renameCreatures(badGuys)
    .map(c => BattleStatuses.initialStatus(c, this.areas)));
    this.goodGuys = goodGuys
    .map(c => BattleStatuses.initialStatus(c, this.areas));
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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attacker = this.turns.pop()!;
    const rivals = this.badGuys.includes(attacker)
     ? aliveGoodGuys 
     : aliveBadGuys;

    const execution = defaultBattleDecisionMaker(attacker, rivals);

    execute(execution, this.log);

    if (isEscapeExecution(execution)) {
      if (execution.success)
        this.result = "escaped";
    } else {
      if (execution.target.currentHealth <= 0) {
        this.turns = this.turns.filter(a => a.isAlive);
        this.log.messages.push(`${attacker.name} killed ${execution.target.name}!`)
      }
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
    }
  }

  public onEnd(): void {
    if (allDead(this.goodGuys)) {
      gameOver();
    }
  }
}
