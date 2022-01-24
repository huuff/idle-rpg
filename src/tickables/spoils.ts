import { Tickable } from "@/ticking/async-ticker";
import { Creature } from "@/creatures/creature";
import { Log } from "@/log";
import { useMainStore } from "@/store";
import {InventoryImpl} from "@/items/inventory";

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
      .map(c => c.stats.challenge)
      .reduce((a, b) => a + b);
    const expForEachWinner = totalExp / this.winners.length;
    for (const winner of this.winners) {
      winner.currentExp += expForEachWinner;
    }
    this.log.messages.push(`You earned ${totalExp} exp`);
  }

  private shareDrops(): void {
    const totalDrops = this.losers
      .map(c => c.inventory)
      .reduce((acc, inv) => acc.merge(inv), new InventoryImpl()).items;
    const { player } = useMainStore();
    player.inventory.adds(Object.values(totalDrops));

    for (const item of Object.values(totalDrops)) {
      this.log.messages.push(`You found ${item.amount} ${item.name}`);
    }
  }
}
