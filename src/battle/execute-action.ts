import { AttackExecution, StealExecution, Execution, matchExecution } from "./action-execution";
import inventory from "@/items/inventory";
import { Log } from "@/log";

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

export function execute(execution: Execution, logger: Log): void {
    return matchExecution(execution,
            (attack) => executeAttack(attack, logger),
            (steal) => executeSteal(steal, logger)
        );
}