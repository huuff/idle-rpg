<template>
  <div class="box columns is-vcentered">
    <span class="is-size-4 has-text-weight-semibold column is-2"> 
      {{ currentZone.name }} 
    </span>
    <div class="column is-9">
      <ul class="steps is-horizontal">
        <li v-for="i in nrange(currentZone.stages)"
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
import { Zone } from "@/zones/zone";
import { nrange } from "@/util/range";

const props = defineProps<{
  currentZone: Zone;
}>();

</script>
