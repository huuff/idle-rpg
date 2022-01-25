import stats, { Stats, zeroStats } from "@/creatures/stats";
import { Inventory } from "./inventory";
import { EquipmentSlot, EquipmentItem, isEquipment } from "./item";
import { keyBy, uniq } from "lodash";

export type EquipmentSlots = {[slot in EquipmentSlot]: EquipmentItem};

export interface Equipment {
  readonly equipped: EquipmentItem[];
  readonly slots: {[slot in EquipmentSlot]: EquipmentItem};
  readonly totalStats: Stats;
  toggleEquipped: (itemName: string) => void;
}

export class EquipmentImpl {
  
  constructor(private readonly inventory: Inventory) {}

  // STUCK: Why is this not narrowing?
  private get items(): EquipmentItem[] {
    return Object.values(this.inventory).filter(isEquipment) as EquipmentItem[];
  }

  public get equipped(): EquipmentItem[] {
    return this.items.filter(i => i.isEquipped);
  }

  public get slots(): EquipmentSlots {
    const slotsTaken = this.equipped.map(e => e.slot);
    if (slotsTaken.length !== uniq(slotsTaken).length) {
      throw new Error(`Some slot has more than one item in: ${JSON.stringify(slotsTaken)}`)
    }

    return keyBy(this.equipped, e => e.slot) as EquipmentSlots;
  }

  public get totalStats(): Stats {
    return this.equipped
      .map(i => i.stats)
      .reduce((acc, s) => stats.plus(acc, s), zeroStats)
      ;
  }

  public toggleEquipped(itemName: string): void {
    const item = this.items.find(i => i.name === itemName);
    if (!item) {
      throw new Error(`Trying to toggle equipped on non-present item ${itemName}`);
    }
    
    const wasEquipped = item.isEquipped;

    const itemAtSameSlot = this.slots[item.slot];
    if (itemAtSameSlot) {
      itemAtSameSlot.isEquipped = false;
    }

    item.isEquipped = !wasEquipped;
  }
}

