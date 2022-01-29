<template>
<p class="title has-text-dark">Resting in {{ location.name }}</p>

<template v-if="currentView === View.Main">
  <button-column>
    <button v-for="destination of possibleDestinations"
            :key="`${destination.through.name}-${destination.to.name}`"
            @click="goTo(destination)"
            class="button is-primary mb-2"
    >Go to {{ destination.to.name }}</button>

    <button
      class="button is-link mb-2"
      @click="currentView = View.Shop"
    >Shop</button>
  </button-column>
</template>
<shop-view 
  v-else-if="currentView == View.Shop"
  :shop="shop"
  @back="currentView = View.Main"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref } from "vue";
import { optionsFrom, TravelOption } from "@/map/game-map";
import { storeToRefs } from "pinia";
import { useTravelStore, } from "@/travel/travel-store";
import { createShop, emptyShop } from "@/locations/shop";
import {Settlement} from "@/map/settlements";
import ShopView from "@/components/shops/ShopView.vue";
import ButtonColumn from "@/components/ui/ButtonColumn.vue";
import { useSettingsStore } from "@/settings-store";

const props = defineProps<{
  location: Settlement;
}>();

const travelStore = useTravelStore();
const { map }= storeToRefs(travelStore);
const { autoplay } = storeToRefs(useSettingsStore());

const possibleDestinations = computed(() => optionsFrom(map.value, props.location));

function goTo(destination: TravelOption): void {
  if (autoplay.value === "enabled") {
    autoplay.value = destination;
  }

  travelStore.takeAction({
    type: "depart",
    to: destination.to,
    through: destination.through,
  });
}

const shop = ref(emptyShop);

onMounted(() => {
  shop.value = createShop(props.location.shop)
});

enum View {
  Main, Shop
}

const currentView: Ref<View> = ref(View.Main);
</script>
