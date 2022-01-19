<template>
<p class="title has-text-dark">Resting in {{ location.name }}</p>

<button v-for="destination of possibleDestinations"
        :key="`${destination.through.name}-${destination.to.name}`"
        @click="goTo(destination)"
        class="button is-primary"
>Go to {{ destination.to.name }}</button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MapLocation, TravelOption } from "@/map/game-map";
import { storeToRefs } from "pinia";
import { useTravelStore, } from "@/travel/travel-store";
import { useMainStore } from "@/store";
import { Ticker } from "@/ticking/ticker";
import { Travel } from "@/travel/travel";
import { autoTravel } from "@/travel/autotraveller";
import { makeRest } from "@/rest";

const props = defineProps<{
  location: MapLocation;
}>();

const travelStore = useTravelStore();
const { map }= storeToRefs(travelStore);
const { autoplay, player } = storeToRefs(useMainStore());

const possibleDestinations = computed(() => map.value.optionsFrom(props.location));

function goTo(destination: TravelOption): void {
  if (autoplay.value === "enabled") {
    autoplay.value = destination;
  }

  new Ticker({
    tickable: new Travel(autoTravel),
    callback: () => new Ticker({ tickable: makeRest(player.value) })
  });
  travelStore.takeAction({
    type: "depart",
    to: destination.to,
    through: destination.through(),
  })
}
</script>
