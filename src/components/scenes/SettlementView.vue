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
import { useMainStore, } from "@/store";
import {RestingStatus} from "@/map/map-status";

const props = defineProps<{
  location: MapLocation;
}>();

const store = useMainStore();
const { map, } = storeToRefs(store);

const possibleDestinations = computed(() => map.value.optionsFrom(props.location));

function goTo(destination: TravelOption): void {
  store.setMapStatus({
    type: "travelling",
    from: (store.mapStatus as RestingStatus).in,
    to: destination.to,
    encounters: 0,
    through: destination.through(),
  })
}
</script>
