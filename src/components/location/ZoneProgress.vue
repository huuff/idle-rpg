<template>
  <p class="has-text-centered is-size-5 has-text-weight-semibold"> {{ zone.name }} </p>
  <div class="columns is-vcentered is-flex-direction-row is-align-items-center">
    <span class="is-size-3 has-text-weight-semibold mx-1"> 
      {{ from.name }} 
    </span>
    <div class="is-flex-grow-1 mx-3 mt-2">
      <ul class="steps is-horizontal">
        <li v-for="i in range(zone.stages.length)"
            :key="`${zone.name}-${i}`"
            class="steps-segment"
            :class="{ 'is-active': currentStage === i}"
            >
          <span class="steps-marker" />
        </li>
      </ul>
    </div>
    <span class="is-size-3 has-text-weight-semibold mx-1"> 
      {{ to.name }} 
    </span>
  </div>
</template>

<script setup lang="ts">
// TODO: I'd like to mark the way to the next stage
// but there's no way with bulma-o-steps, so maybe I
// should implement my own following this
// https://ishadeed.com/article/stepper-component-html-css/
import { computed, } from "vue";
import { range } from "@/util/range";
import {TravellingStatus} from "@/map/map-status";
import Zones from "@/zones/zone";

const props = defineProps<{
  status: TravellingStatus;
}>();

const zone = computed(() => props.status.through);
const to = computed(() => props.status.to);
const from = computed(() => props.status.from);

const currentStage = computed(() => {
  if (!Zones.isComplete(zone.value, props.status.steps)) 
    return Zones.currentStage(zone.value, props.status.steps).index;
  else
    return undefined;
});

</script>
