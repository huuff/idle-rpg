<template>
<table class="table is-hoverable is-fullwidth is-unselectable">
  <thead>
    <th>Name</th>
    <th>Price</th>
    <th>Amount</th>
  </thead>
  <tbody>
    <tr v-for="item in Object.values(shop.inventory)"
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
import inventoryOps, { InventoryItem } from "@/items/inventory";
import { Item } from "@/items/item";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import { sellItem, Shop } from "@/locations/shop";

const props = defineProps<{
  shop: Shop;
}>();

const emit = defineEmits<{
  (event: "sold", itemName: string): void;
}>();

const { player, money } = storeToRefs(useMainStore());

function hasMoneyForItem(item: Item) {
  return money.value >= item.avgValue;
}

function buy(item: InventoryItem) {
  if (hasMoneyForItem(item)) {
    player.value.inventory = inventoryOps.plus(player.value.inventory, item)

    sellItem(props.shop, item.name);
    money.value -= item.avgValue;
  }
}
</script>
