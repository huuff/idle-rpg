<template>
<table class="table is-hoverable is-fullwidth is-unselectable">
  <thead>
    <th>Name</th>
    <th>Price</th>
    <th>Amount</th>
  </thead>
  <tbody>
    <tr v-for="item in inventory.items"
        :class="{
          'is-clickable': hasMoneyForItem(item)
        }"
        :key="item.name"
        @click="buy(item)"
    >
      <td>{{ item.name }}</td>
      <td>{{ item.avgValue }}</td>
      <td>{{ item.amount }}</td>
    </tr>
  </tbody>
</table>
</template>

<script setup lang="ts">
import { Inventory, InventoryItem, singleInventoryItem } from "@/items/inventory";
import { Item } from "@/items/item";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";

const props = defineProps<{
  inventory: Inventory;
}>();

const { player, money } = storeToRefs(useMainStore());

function hasMoneyForItem(item: Item) {
  return money.value >= item.avgValue;
}

function buy(item: InventoryItem) {
  if (hasMoneyForItem(item)) {
    player.value.inventory.add(singleInventoryItem(item));
    props.inventory.remove(item.name);
    money.value -= item.avgValue;
  }
}
</script>
