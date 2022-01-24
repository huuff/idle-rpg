<template>
<div style="height: 100%; min-height: 100%; position: relative">
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
  <progress 
    class="progress" 
    :max="ticksDuration"
    :value="ticksHad.value"
  ></progress>
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

<style scoped>
.progress {
  position: absolute;
  bottom: 10%;
}
</style>
