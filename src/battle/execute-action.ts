import { AttackExecution, StealExecution, Execution, matchExecution, EscapeExecution, MoveExecution } from "./action-execution";
import inventory from "@/items/inventory";
import { Move } from "./battle-action";
import { Log } from "@/log";

// TODO: as bag-of-functions

export function executeAttack(attack: AttackExecution, logger: Log): void {
    attack.target.currentHealth -= attack.damage;
    logger.messages.push(attack.description);
}

export function executeSteal(steal: StealExecution, logger: Log): void {
    if (steal.item) {
        steal.originator.inventory = inventory.plus(
            steal.originator.inventory, 
            inventory.singleItem(steal.item),
        )
    }
    
    logger.messages.push(steal.description);
}

export function executeEscape(escape: EscapeExecution, logger: Log): void {
    if (escape.success)
        logger.messages.push("You escape the battle!");
    else
        logger.messages.push("You try to escape the battle but have no success!");
}

export function executeMove(move: MoveExecution, logger: Log): void {
    move.originator.status.in = move.to;
    logger.messages.push(`${move.originator.name} moved to ${move.to.name}`);
}

export function execute(execution: Execution, logger: Log): void {
    return matchExecution(execution,
            (attack) => executeAttack(attack, logger),
            (steal) => executeSteal(steal, logger),
            (escape) => executeEscape(escape, logger),
            (move) => executeMove(move, logger),
        );
}