<template>
<p class="title has-text-dark">Resting in {{ location.name }}</p>

<button v-for="destination of possibleDestinations"
        :key="destination.to.name"
        @click="goTo(destination)"
        class="button is-primary"
>Go to {{ destination.to.name }}</button>
</template>

<script setup lang="ts">
// TODO: Maybe button's keys should include zone if there are
// more than one path to somewhere
import { computed } from "vue";
import { MapLocation, TravelOption } from "@/map/game-map";
import { storeToRefs } from "pinia";
import { useTravelStore, } from "@/travel-store";
import { useMainStore } from "@/store";

const props = defineProps<{
  location: MapLocation;
}>();

const travelStore = useTravelStore();
const { map }= storeToRefs(travelStore);
const { autoplay } = storeToRefs(useMainStore());

const possibleDestinations = computed(() => map.value.optionsFrom(props.location));

function goTo(destination: TravelOption): void {
  if (autoplay.value === "enabled") {
    autoplay.value = destination;
  }

  // TODO: Depart action
  travelStore.mapStatus = {
    type: "travelling",
    from: props.location,
    to: destination.to,
    encounters: 0,
    through: destination.through(),
  }
}
</script>
