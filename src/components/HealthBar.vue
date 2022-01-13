<template>
<animated-bar 
  :current="actor.currentHealth" 
  :max="actor.stats.maxHealth" 
  :class="`is-${color}`"
/>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Actor } from "@/battle/actor";
import AnimatedBar from "@/components/AnimatedBar.vue";

const props = defineProps<{
  actor: Actor;
}>();

const color = computed(() => {
  if (props.actor.healthRatio < 0.1)
    return "danger";
  else if (props.actor.healthRatio < 0.25)
    return "warning";
  else
    return "primary";
});
</script>
