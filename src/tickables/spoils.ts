import { Tickable } from "@/ticking/async-ticker";
import { Creature } from "@/creatures/creature";
import { Log } from "@/log";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import inventory, { Inventory, singleInventoryItem } from "@/items/inventory";
import { calculateChallenge } from "@/creatures/stats";

export class Spoils implements Tickable {
  private ticksHad = 0;

  constructor(
    private readonly winners: Creature[],
    private readonly losers: Creature[],
    private readonly log: Log,
  ){}
  
  public tick(): void {
    if (this.ticksHad === 0) {
      this.shareExp();
    } else if (this.ticksHad === 1) {
      this.shareDrops();
    }
    this.ticksHad++;
  }

  public isOver(): boolean {
    return this.ticksHad >= 3;
  }

  private shareExp(): void {
    const totalExp = this.losers
      .map(c => calculateChallenge(c.stats))
      .reduce((a, b) => a + b);
    const expForEachWinner = totalExp / this.winners.length;
    for (const winner of this.winners) {
      winner.currentExp += expForEachWinner;
    }
    this.log.messages.push(`You earned ${totalExp} exp`);
  }

  private shareDrops(): void {
    const totalDrops = this.adjustByRarity(inventory.merge(...this.losers.map(c => c.inventory)));

    const { player } = storeToRefs(useMainStore());
    player.value.inventory = inventory.merge(player.value.inventory, totalDrops)

    for (const item of Object.values(totalDrops)) {
      this.log.messages.push(`You found ${item.amount} ${item.name}`);
    }
  }

  // Makes it so drops are only dropped according to rarity
  // It throws a random for each item and if it's under the rarity
  // of the item, it's added to the final drops
  private adjustByRarity(drops: Inventory): Inventory {
    let resultInventory: Inventory = {};
    for (const item of Object.values(drops)) {
      for (let i = 0; i < item.amount; i++) {
        const randomValue = Math.random();
        if (randomValue < item.rarity) {
          resultInventory = inventory.plus(resultInventory, singleInventoryItem(item));
        }
      }
    }
    return resultInventory;
  }
}
