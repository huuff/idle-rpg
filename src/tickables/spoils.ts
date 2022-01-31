import { Tickable } from "@/ticking/async-ticker";
import Creatures, { Creature } from "@/creatures/creature";
import { Log } from "@/log";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import inventory, { Inventory, singleItem } from "@/items/inventory";
import { calculateChallenge } from "@/creatures/stats";
import { useBattleStore } from "@/battle-store";

// TODO: Make it work for several good guys

export class Spoils implements Tickable {
  private ticksHad = 0;

  constructor(
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
    const { player } = storeToRefs(useMainStore());
    const { enemies } = storeToRefs(useBattleStore());
    const totalExp = enemies.value
      .map(c => calculateChallenge(Creatures.stats(c)))
      .reduce((a, b) => a + b);
    player.value = Creatures.addExp(player.value, totalExp);
    this.log.messages.push(`You earned ${totalExp} totalExp`);
  }

  private shareDrops(): void {
    const { player } = storeToRefs(useMainStore());
    const { enemies } = storeToRefs(useBattleStore());
    const totalDrops = this.adjustByRarity(inventory.merge(...enemies.value.map(c => c.inventory)));

    player.value = Creatures.withInventory(player.value, inventory.merge(player.value.inventory, totalDrops));

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
          resultInventory = inventory.plus(resultInventory, singleItem(item));
        }
      }
    }
    return resultInventory;
  }
}
