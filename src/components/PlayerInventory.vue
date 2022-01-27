<template>
<inventory-view :inventory="player.inventory" @clickItem="toggleEquipped"/>
</template>

<script setup lang="ts">
import { useMainStore } from '@/store';
import { storeToRefs } from 'pinia';
import { isEquipment } from '@/items/item';
import equipment from '@/items/equipment';
import InventoryView from './inventory/InventoryView.vue';

const { player } = storeToRefs(useMainStore());

function toggleEquipped(itemName: string): void {
  const item = player.value.inventory[itemName];
  if (item && item.type === "equipment") {
    player.value.inventory = equipment.toggleEquipped(player.value.inventory, item.name);
  }
}
</script>
