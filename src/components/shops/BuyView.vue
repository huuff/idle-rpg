<template>
  <inventory-view 
    :inventory="shop.inventory"
    :is-clickable="hasMoneyForItem"
    @click-item="buy"/>
</template>

<script setup lang="ts">
import inventory from "@/items/inventory";
import { Item } from "@/items/item";
import { useMainStore } from "@/store";
import { useNotificationStore } from "@/notification/notification-store";
import { storeToRefs } from "pinia";
import { sellItem, Shop } from "@/locations/shop";
import InventoryView from "../inventory/InventoryView.vue";

const props = defineProps<{
  shop: Shop;
}>();

const notificationStore = useNotificationStore();

const { player, money } = storeToRefs(useMainStore());

function hasMoneyForItem(item: Item) {
  return money.value >= item.avgValue;
}

function buy(itemName: string) {
  const item = props.shop.inventory[itemName];
  if (hasMoneyForItem(item)) {
    player.value.inventory = inventory.plus(player.value.inventory, inventory.singleItem(item))

    sellItem(props.shop, item.name);
    money.value -= item.avgValue;
  } else {
    notificationStore.setNotification("not-enough-money");
  }
}
</script>
