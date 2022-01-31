import Executions, {
    AttackExecution,
    StealExecution,
    Execution,
    EscapeExecution,
    MoveExecution
} from "./action-execution";
import BattleStatuses, { BattleStatus } from "./battle-status";
import BattleAreas from "./battle-area";
import inventory from "@/items/inventory";
import { Log } from "@/log";
import { useCreaturesStore } from "@/creatures-store";

function executeAttack(attack: AttackExecution, logger: Log): void {
    const { creatures } = useCreaturesStore();
    const target = creatures[attack.target.id];
    target.currentHealth -= attack.damage;
    logger.messages.push(attack.description);
}

function executeSteal(steal: StealExecution, logger: Log): void {
    const { creatures } = useCreaturesStore();
    const thief = creatures[steal.originator.id];
    if (steal.item) {
        thief.inventory = inventory.plus(thief.inventory, inventory.singleItem(steal.item))
    }

    logger.messages.push(steal.description);
}

function executeEscape(escape: EscapeExecution, logger: Log): void {
    if (escape.success)
        logger.messages.push("You escape the battle!");
    else
        logger.messages.push("You try to escape the battle but have no success!");
}

function executeMove(move: MoveExecution, logger: Log): void {
    const { creatures } = useCreaturesStore();
    const creature = creatures[move.originator.id];
    creature.battleStatus = BattleStatuses.match<BattleStatus>(
        creature.battleStatus!, //TODO
        (still) => ({
            type: "moving",
            from: still.in,
            to: move.to,
            steps: 0,
        }),
        (moving) => {
            const distance = BattleAreas.distance(moving.from.coordinates, moving.to.coordinates);
            if (moving.steps < distance) {
                return { ...moving, steps: moving.steps+1 };
            } else {
                return {
                    type: "still",
                    in: moving.to,
                }
            }
        }
    )
    
    const nextStatus = creature.battleStatus;
    if (BattleStatuses.isMoving(nextStatus)) 
        logger.messages.push(`${move.originator.name} moved towards ${nextStatus.to.name}`);
    else if (BattleStatuses.isStill(nextStatus))
        logger.messages.push(`${move.originator.name} arrived at ${nextStatus.in.name}`)
}

function execute(execution: Execution, logger: Log): void {
    return Executions.match(execution,
        (attack) => executeAttack(attack, logger),
        (steal) => executeSteal(steal, logger),
        (escape) => executeEscape(escape, logger),
        (move) => executeMove(move, logger),
    );
}

export default {
    executeEscape,
    executeAttack,
    executeMove,
    executeSteal,
    execute,
}