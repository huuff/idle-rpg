<template>
<p class="title has-text-dark">Resting in {{ location.name }}</p>

<template v-if="currentView === View.Main">
  <div class="is-flex is-flex-direction-column">
    <button v-for="destination of possibleDestinations"
            :key="`${destination.through.name}-${destination.to.name}`"
            @click="goTo(destination)"
            class="button is-primary mb-2"
    >Go to {{ destination.to.name }}</button>

    <button 
      @click="sellSpoils"
      class="button is-info mb-2"
      >Sell Spoils</button>

    <button
      class="button is-link mb-2"
      @click="currentView = View.Shop"
    >Shop</button>
  </div>
</template>
<shop-view 
  v-else-if="currentView == View.Shop"
  :shop="shop"
  @back="currentView = View.Main"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref } from "vue";
import { TravelOption } from "@/map/game-map";
import { storeToRefs } from "pinia";
import { useTravelStore, } from "@/travel/travel-store";
import { useMainStore } from "@/store";
import { emptyShop } from "@/locations/shop";
import {Settlement} from "@/map/settlements";
import ShopView from "@/components/ShopView.vue";

const props = defineProps<{
  location: Settlement;
}>();

const travelStore = useTravelStore();
const { map }= storeToRefs(travelStore);
const { autoplay, player, money } = storeToRefs(useMainStore());

const possibleDestinations = computed(() => map.value.optionsFrom(props.location));

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

function sellSpoils() {
  money.value += player.value.inventory.stuffValue;
  player.value.inventory.removeStuff();
}

const shop = ref(emptyShop);

onMounted(() => {
  shop.value = props.location.createShop();
});

enum View {
  Main, Shop
}

const currentView: Ref<View> = ref(View.Main);
</script>
