<template>
  <inventory-view
    :inventory="player.inventory"
    @click-item="sellOne"
  >
    <template #extraHeaders>
      <th>Sell all</th>
    </template>
    <template #extraCells="{ item }">
      <td>
        <a @click.stop="sellAll(item.name)">Sell All</a>
      </td>
    </template>
  </inventory-view>
</template>

<script setup lang="ts">
import inventoryOps from "@/items/inventory";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import InventoryView from "../inventory/InventoryView.vue";

const { money, player } = storeToRefs(useMainStore());

function sellAll(itemName: string): void {
  const item = player.value.inventory[itemName];
  money.value += item.amount * item.avgValue;
  player.value.inventory = inventoryOps.minus(player.value.inventory, item.name, item.amount)
}

function sellOne(itemName: string): void {
  const item = player.value.inventory[itemName];
  money.value += item.avgValue;
  player.value.inventory = inventoryOps.minus(player.value.inventory, item.name)
}
</script>
