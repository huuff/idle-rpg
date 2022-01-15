<template>
  <div class="box columns is-vcentered">
    <span class="is-size-4 has-text-weight-semibold column is-2"> 
      {{ currentZone.name }} 
    </span>
    <div class="column is-9">
      <ul class="steps is-horizontal">
        <li v-for="i in nrange(currentZone.stageNumber)"
            :key="`${currentZone.name}-${i}`"
            class="steps-segment"
            :class="{ 'is-active': currentZone.currentStage === i}"
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
import { Zone } from "@/zones/zone";
import { nrange } from "@/util/range";

const props = defineProps<{
  currentZone: Zone;
}>();

</script>
