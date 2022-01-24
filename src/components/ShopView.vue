<template>
<button
  class="button is-info mr-1"
  @click="sellSpoils"
>Sell stuff</button>
<button
  class="button is-warning mr-1"
  @click="emit('back')"
  >Go back</button>
<table class="table is-hoverable is-fullwidth">
  <thead>
    <th>Name</th>
    <th>Price</th>
    <th>Amount</th>
  </thead>
  <tbody>
    <tr v-for="item in shop.inventory.items"
        class="is-clickable"
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
import { Shop } from "@/locations/shop";
import { InventoryItem } from "@/items/inventory";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";

const props = defineProps<{
  shop: Shop;
}>();

const emit = defineEmits<{
  (event: "back"): void;
}>();

const { player, money } = storeToRefs(useMainStore());

function buy(item: InventoryItem) {
  player.value.inventory.addItem(item);
  props.shop.inventory.removeItem(item.name);
  money.value -= item.avgValue;
}

function sellSpoils() {
  money.value += player.value.inventory.stuffValue;
  player.value.inventory.removeStuff();
}
</script>
