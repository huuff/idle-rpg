import { Tickable } from "@/ticking/async-ticker";
import Creatures, { Creature } from "@/creatures/creature";
import { Log } from "@/log";
import { storeToRefs } from "pinia";
import Inventories, { Inventory, singleItem } from "@/items/inventory";
import { calculateChallenge } from "@/creatures/stats";
import { useCreaturesStore } from "@/creatures-store";

export class Spoils implements Tickable {
  private ticksHad = 0;
  private readonly winners: Creature[];
  private readonly losers: Creature[];

  constructor(
    winners: Creature[],
    losers: Creature[],
    private readonly log: Log,
  ){
    const { creatures } = useCreaturesStore();
    this.winners = winners.map(c => c.id).map(id => creatures[id]); 
    this.losers = losers.map(c => c.id).map(id => creatures[id]);

  }
  
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
      .map(c => calculateChallenge(Creatures.stats(c)))
      .reduce((a, b) => a + b);
    const expForEachWinner = totalExp / this.winners.length;
    for (const winner of this.winners) {
      winner.currentExp += expForEachWinner; // TODO: This won't increase levels
    }
    this.log.messages.push(`You earned ${totalExp} exp`);
  }

  private shareDrops(): void {
    const totalDrops = this.adjustByRarity(Inventories.merge(...this.losers.map(c => c.inventory)));

    const { player } = storeToRefs(useCreaturesStore());
    player.value.inventory = Inventories.merge(player.value.inventory, totalDrops)

    for (const item of Object.values(totalDrops)) {
      this.log.messages.push(`You found ${item.amount} ${item.name}`);
    }
  }

  // Makes it so drops are only dropped according to rarity
  // It throws a random for each item and if it's under the rarity
  // of the item, it's added to the final drops
  private adjustByRarity(drops: Inventory): Inventory {
    const resultInventory: Inventory = {};
    for (const item of Object.values(drops)) {
      for (let i = 0; i < item.amount; i++) {
        const randomValue = Math.random();
        if (randomValue < item.rarity) {
          Inventories.add(resultInventory, singleItem(item));
        }
      }
    }
    return resultInventory;
  }
}
