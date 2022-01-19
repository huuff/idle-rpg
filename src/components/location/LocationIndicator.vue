<template>
<div class="box">
  <template v-if="mapStatus.type === 'travelling'">
    <zone-progress :status="mapStatus"/> 
  </template>
  <template v-else-if="mapStatus.type === 'resting'">
    <p class="has-text-centered title has-text-dark">{{ mapStatus.at.name }}</p>
  </template>
</div>
</template>

<script setup lang="ts">
import { useTravelStore } from "@/travel/travel-store";
import { storeToRefs } from "pinia";
import ZoneProgress from "./ZoneProgress.vue";

const { mapStatus } = storeToRefs(useTravelStore());
</script>
