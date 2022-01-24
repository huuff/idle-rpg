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
    <buy-view :inventory="shop.inventory" />
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
import { sellableValue, removeSellable } from "@/items/selling";
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
  removeSellable(player.value.inventory);
}
</script>
