<template>
<table class="table is-fullwidth is-hoverable is-unselectable">
  <thead>
    <th>Name</th>
    <th>Value</th>
    <th>Amount</th>
    <th>Sell All</th>
  </thead>
  <tbody>
    <tr
      v-for="item in inventory.items"
      :key="item.name"
      class="is-clickable"
      @click="sellOne(item)"
    >
      <td> {{ item.name }}</td>
      <td> {{ item.avgValue }}</td>
      <td> {{ item.amount }}</td>
      <td><a @click.stop="sellAll(item)">Sell All</a></td>
    </tr>
  </tbody>
</table>


</template>

<script setup lang="ts">
import { Inventory, InventoryItem } from "@/items/inventory";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";

const props = defineProps<{
  inventory: Inventory;
}>();

const { money } = storeToRefs(useMainStore());

function sellAll(item: InventoryItem): void {
  money.value += item.amount * item.avgValue;
  props.inventory.remove(item.name, item.amount);
}

function sellOne(item: InventoryItem): void {
  money.value += item.avgValue;
  props.inventory.remove(item.name);
}
</script>
