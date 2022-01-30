import { AttackExecution, StealExecution, Execution, matchExecution, EscapeExecution, MoveExecution } from "./action-execution";
import inventory from "@/items/inventory";
import { Log } from "@/log";

function executeAttack(attack: AttackExecution, logger: Log): void {
    attack.target.currentHealth -= attack.damage;
    logger.messages.push(attack.description);
}

function executeSteal(steal: StealExecution, logger: Log): void {
    if (steal.item) {
        steal.originator.inventory = inventory.plus(
            steal.originator.inventory, 
            inventory.singleItem(steal.item),
        )
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
    move.originator.status.in = move.to;
    logger.messages.push(`${move.originator.name} moved to ${move.to.name}`);
}

function execute(execution: Execution, logger: Log): void {
    return matchExecution(execution,
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