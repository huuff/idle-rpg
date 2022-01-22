import { Tickable } from "@/ticking/async-ticker";
import { Creature } from "@/creatures/creature";
import { Log } from "@/log";
import { countByType } from "@/util/count-types";
import { useMainStore } from "@/store";
import { flattenItems } from "@/items/inventory";

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
      winner.adjustLevel(); // TODO: Maybe a currentExp setter could adjust level?
    }
    this.log.messages.push(`You earned ${totalExp} exp`);
  }

  private shareDrops(): void {
    const totalDrops = flattenItems(this.losers.flatMap(c => c.inventory.items()));
    const { player } = useMainStore();
    player.inventory.addItems(totalDrops);

    const itemsByType = countByType(totalDrops, (item) => item.name);
    for (const itemName of Object.keys(itemsByType)) {
      const amount = itemsByType[itemName];
      this.log.messages.push(`You found ${amount} ${itemName}`);
    }
  }
}
