<template>
<travel-view />

<button type="button" class="button is-primary" @click="emit('continue')">
  Continue
</button>

<button type="button" class="button is-secondary" @click="emit('retreat')">
  Retreat
</button>
</template>

<script setup lang="ts">
import TravelView from "./TravelView.vue";

const emit = defineEmits<{
  (event: "continue"): void;
  (event: "retreat"): void;
}>();
</script>
