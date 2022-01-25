<template>
<button
  class="button is-info mr-1"
  @click="sellSpoils"
>Sell stuff</button>
<button
  class="button is-warning mr-1"
  @click="emit('back')"
  >Go back</button>

<tabbed-view :tabs="Tab">
  <template v-slot:[Tab.Buy]>
    <buy-view :inventory="shop.inventory" @sold="soldItem" />
  </template>
  <template v-slot:[Tab.Sell]>
    <sell-view :inventory="player.inventory" />
  </template>
</tabbed-view>
</template>

<script setup lang="ts">
import { Shop } from "@/locations/shop";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import { sellableValue, withoutSellable } from "@/items/selling";
import inventory from "@/items/inventory";
import TabbedView from "@/components/ui/TabbedView.vue";
import BuyView from "./BuyView.vue";
import SellView from "./SellView.vue";

const props = defineProps<{
  shop: Shop;
}>();

const emit = defineEmits<{
  (event: "back"): void;
}>();

const { player, money } = storeToRefs(useMainStore());

enum Tab {
  Buy = "Buy",
  Sell = "Sell",
}

function sellSpoils() {
  money.value += sellableValue(player.value.inventory);
  player.value.inventory = withoutSellable(player.value.inventory);
}

function soldItem(itemName: string) {
  // whoops I'll think about that later
  // eslint-disable-next-line 
  props.shop.inventory = inventory.minus(props.shop.inventory, itemName);
}
</script>
