<template>
  <div class="columns is-vcentered">
    <span class="is-size-3 has-text-weight-semibold column is-2 has-text-centered mt-3"> 
      {{ from.name }} 
    </span>
    <div class="column is-8">
      <p class="has-text-centered is-size-5 has-text-weight-semibold"> {{ zone.name }} </p>
      <ul class="steps is-horizontal">
        <li v-for="i in range(zone.stageNumber)"
            :key="`${zone.name}-${i}`"
            class="steps-segment"
            :class="{ 'is-active': currentStage === i}"
            >
          <span class="steps-marker" />
        </li>
      </ul>
    </div>
    <span class="is-size-3 has-text-weight-semibold column is-2 has-text-centered mt-3"> 
      {{ to.name }} 
    </span>
  </div>
</template>

<script setup lang="ts">
// TODO: I'd like to mark the way to the next stage
// but there's no way with bulma-o-steps, so maybe I
// should implement my own following this
// https://ishadeed.com/article/stepper-component-html-css/
// TODO: Looks ugly on a smaller viewport, use flexbox instead of columns
import { computed, toRefs } from "vue";
import { range } from "@/util/range";
import {TravellingStatus} from "@/map/map-status";

const props = defineProps<{
  status: TravellingStatus;
}>();

const { 
  through: zone,
  to,
  from,
  encounters
} = toRefs(props.status)

const currentStage = computed(() => zone.value
  .stageFromEncounterNumber(encounters.value));

</script>
