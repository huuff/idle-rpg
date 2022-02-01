import { useMainStore } from "@/store";
import Creatures, { Creature, } from "@/creatures/creature";
import { calculateTurns } from "./turns";
import Executions from "./action-execution";
import Execute from "./execute-action";
import { Tickable } from "@/ticking/async-ticker";
import {Scene} from "@/scenes/scene";
import {makeBattleScene} from "@/scenes/battle-scene";
import { renameCreatures } from "@/creatures/rename-creatures";
import { gameOver } from "@/game-over";
import { Spoils } from "@/tickables/spoils";
import { defaultBattleDecisionMaker } from "./battle-decision-maker";
import { isEmpty } from "lodash";
import { BattleArea } from "./battle-area";
import BattleStatuses, { CreatureWithStatus } from "./battle-status";
import { normalCreaturesToStored } from "@/creatures-store";

function allDead(creatures: Creature[]) {
  return creatures.every(c => !Creatures.isAlive(c));
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
    renameCreatures(badGuys);
    BattleStatuses.setupTeams(goodGuys, badGuys, this.areas);
    this.badGuys = normalCreaturesToStored(badGuys) as CreatureWithStatus[]; // TODO?
    this.goodGuys = normalCreaturesToStored(goodGuys) as CreatureWithStatus[];
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
    const aliveGoodGuys = this.goodGuys.filter(Creatures.isAlive);
    const aliveBadGuys = this.badGuys.filter(Creatures.isAlive);

    if (isEmpty(this.turns))
      this.turns = calculateTurns([ ...aliveGoodGuys, ...aliveBadGuys]);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attacker = this.turns.pop()!;
    const rivals = this.badGuys.includes(attacker)
     ? aliveGoodGuys 
     : aliveBadGuys;

    const execution = defaultBattleDecisionMaker(
      attacker,
      rivals,
      this.areas);

    Execute.execute(execution, this.log);

    if (Executions.isEscape(execution)) {
      if (execution.success)
        this.result = "escaped";
    } else if (Executions.isAttack(execution)){
      if (execution.target.currentHealth <= 0) {
        this.turns = this.turns.filter(Creatures.isAlive);
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
