<template>
<button
  class="button is-warning"
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

const props = defineProps<{
  shop: Shop;
}>();

const emit = defineEmits<{
  (event: "back"): void;
}>();

const store = useMainStore();

function buy(item: InventoryItem) {
  store.player.inventory.addItem(item);
  props.shop.inventory.removeItem(item.name);
  store.money-=item.avgValue;
}
</script>
