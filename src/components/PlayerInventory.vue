<template>
<inventory-view :inventory="player.inventory" @clickItem="toggleEquipped"/>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/notification/notification-store';
import { storeToRefs } from 'pinia';
import equipment from '@/items/equipment';
import InventoryView from './inventory/InventoryView.vue';
import { useCreaturesStore } from '@/creatures-store';

const { player } = storeToRefs(useCreaturesStore());
const notificationStore = useNotificationStore();

function toggleEquipped(itemName: string): void {
  const item = player.value.inventory[itemName];
  if (item && item.type === "equipment") {
    const result = equipment.toggleEquipped(player.value, item.name);
    if (result === "overload") {
      notificationStore.setNotification(result);
    }
  }
}
</script>
