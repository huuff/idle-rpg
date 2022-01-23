<template>
<p class="title has-text-dark">Resting in {{ location.name }}</p>

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
</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MapLocation, TravelOption } from "@/map/game-map";
import { storeToRefs } from "pinia";
import { useTravelStore, } from "@/travel/travel-store";
import { useMainStore } from "@/store";

const props = defineProps<{
  location: MapLocation;
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
  money.value += player.value.inventory.totalValue;
  player.value.inventory.empty();
}
</script>
