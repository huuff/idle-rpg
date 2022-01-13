<template>
  <progress class="progress is-primary" :value="shownValue" :max="actor.stats.maxHealth">
    {{ actor.currentHealth }}
  </progress>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { Actor } from "@/battle/actor";
import animejs from "animejs";

const props = defineProps<{
  actor: Actor;
}>();

const shownValue = ref(props.actor.currentHealth);

watch(() => props.actor.currentHealth, (newValue) => animejs(({
  targets: shownValue,
  value: newValue,
  easing: "linear",
  autoplay: true,
})));
</script>
