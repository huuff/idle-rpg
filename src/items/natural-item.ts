import inventory, { Inventory, InventoryItem } from "./inventory";
import { cloneDeep } from "lodash";

// A natural item is an item that some species has at birth.
// It has a frequency so some instances of that species might not have it.
// If it also has an amount, a die is rolled for each one with the chance of appearing of
// its frequency
export type NaturalItem = InventoryItem & { frequency: number };

function toInventoryItem(naturalItem: NaturalItem): InventoryItem {
    const result = cloneDeep(naturalItem);
    result.amount = 0;

    for (let i = 0; i <= naturalItem.amount; i++) {
        const probability = Math.random();
        if (probability <= naturalItem.frequency) {
            result.amount++;
        }
    }
    
    return result;
}

function toInventory(naturalItems: NaturalItem[]): Inventory {
    return inventory.plus({}, naturalItems.map(toInventoryItem));
}

export default {
    toInventoryItem,
    toInventory,
}