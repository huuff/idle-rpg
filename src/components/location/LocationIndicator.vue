<template>
<div class="box">
  <template v-if="mapStatus.type === 'travelling'">
    <zone-progress :status="mapStatus as TravellingStatus"/> 
  </template>
  <template v-else-if="mapStatus.type === 'resting'">
    <p class="has-text-centered title has-text-dark">{{ mapStatus.in.name }}</p>
  </template>
</div>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import { TravellingStatus } from "@/map/map-status";
import ZoneProgress from "./ZoneProgress.vue";

const { mapStatus } = storeToRefs(useMainStore());
</script>
