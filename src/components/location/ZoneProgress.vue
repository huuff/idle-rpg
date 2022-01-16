<template>
  <div v-if="currentZone"
    class="box columns is-vcentered">
    <span class="is-size-4 has-text-weight-semibold column is-2"> 
      {{ currentZone.name }} 
    </span>
    <div class="column is-9">
      <ul class="steps is-horizontal">
        <li v-for="i in range(currentZone.stageNumber)"
            :key="`${currentZone.name}-${i}`"
            class="steps-segment"
            :class="{ 'is-active': currentStage === i}"
            >
          <span class="steps-marker" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: I'd like to mark the way to the next stage
// but there's no way with bulma-o-steps, so maybe I
// should implement my own following this
// https://ishadeed.com/article/stepper-component-html-css/
import { computed } from "vue";
import { range } from "@/util/range";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import {TravellingStatus} from "@/map/map-status";

const { mapStatus } = storeToRefs(useMainStore());

const currentZone = computed(() => {
  if (mapStatus.value.type === "travelling") {
    return mapStatus.value.through;
  } else {
    return undefined;
  }
})

const currentStage = computed(() => {
  if (currentZone.value) {
    const encounters = (mapStatus.value as TravellingStatus).encounters;
    return currentZone.value.stageFromEncounterNumber(encounters)
  } else {
    return undefined;
  }
})

</script>
