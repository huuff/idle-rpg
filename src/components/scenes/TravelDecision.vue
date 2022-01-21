<template>
<div class="is-flex is-flex-direction-column is-justify-content-space-between" style="height: 100%; min-height: 100%;">
  <div>
    <travel-view />

    <button 
      type="button"
      class="button is-primary"
      @click="emit('continue')"
    >Continue</button>

    <button 
      type="button" 
      class="button is-secondary" 
      @click="emit('retreat')"
    >Retreat</button>
  </div>
  <div>
    <progress 
      class="progress" 
      :max="ticksDuration"
      :value="ticksHad.value"
    ></progress>
  </div>
</div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import TravelView from "./TravelView.vue";

const props = defineProps<{
  ticksDuration: number;
  ticksHad: Ref<number>;
}>();

const emit = defineEmits<{
  (event: "continue"): void;
  (event: "retreat"): void;
}>();

</script>
