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
  <table class="table is-fullwidth is-hoverable is-unselectable">
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
        :class="{ 
          'is-selected': isEquipped(item),
          'is-clickable': item.type === 'equipment',
          }"
        @click="toggleEquipped(item)"
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
import capitalize from "lodash/capitalize";
import {Item} from "@/items/item";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store";
import equipmentOps from "@/items/equipment";

const { player } = storeToRefs(useMainStore());

const tabs = [ "all", "stuff", "equipment" ];
const currentTab = ref("all");

const filteredItems = computed(() => {
  const items = Object.values(player.value.inventory);
  if (currentTab.value === "all")
    return items;
  else if (currentTab.value === "stuff")
    return items.filter(i => i.type === "stuff");
  else if (currentTab.value === "equipment")
    return items.filter(i => i.type === "equipment");
  else 
    throw new Error(`Tab ${currentTab.value} not handled in 'InventoryView'`);
})

function isEquipped(item: Item): boolean {
  return item.type === "equipment" && (item.isEquipped === true);
}

function toggleEquipped(item: Item): void {
  if (item.type === "equipment") {
    player.value.inventory = equipmentOps.toggleEquipped(player.value.inventory, item.name);
  }
}
</script>
