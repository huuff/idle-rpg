<template>
<div class="tabs">
  <ul>
    <li v-for="tab in tabs"
        :key="tab"
        :class="{ 'is-active': currentTab === tab}"
    ><a @click="currentTab = tab">{{ capitalize(tab) }}</a>
    </li>
  </ul>
</div>
<div>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>Name</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr 
        v-for="item in filteredItems" 
        :key="item.name"
        :class="{ 'is-selected': isEquipped(item) }"
        >
        <td>{{ item.name }}</td>
        <td>{{ item.amount}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Inventory } from "@/items/inventory";
import capitalize from "lodash/capitalize";
import {Item} from "@/items/item";

const props = defineProps<{
  inventory: Inventory
}>();

const tabs = [ "all", "stuff", "equipment" ];
const currentTab = ref("all");

const filteredItems = computed(() => {
  if (currentTab.value === "all")
    return props.inventory.items;
  else if (currentTab.value === "stuff")
    return props.inventory.items.filter(i => i.type === "stuff");
  else if (currentTab.value === "equipment")
    return props.inventory.items.filter(i => i.type === "equipment");
  else 
    throw new Error(`Tab ${currentTab.value} not handled in 'InventoryView'`);
})

function isEquipped(item: Item): boolean {
  return item.type === "equipment" && item.isEquipped;
}
</script>
