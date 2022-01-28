<template>
<inventory-view :inventory="player.inventory" @clickItem="toggleEquipped"/>
</template>

<script setup lang="ts">
import { useMainStore } from '@/store';
import { storeToRefs } from 'pinia';
import equipment from '@/items/equipment';
import InventoryView from './inventory/InventoryView.vue';

const { player } = storeToRefs(useMainStore());

function toggleEquipped(itemName: string): void {
  const item = player.value.inventory[itemName];
  if (item && item.type === "equipment") {
    equipment.toggleEquipped(player.value, item.name);
  }
}
</script>
