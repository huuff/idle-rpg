<template>
<animated-bar 
  :current="creature.currentHealth" 
  :max="creature.stats.maxHealth" 
  :class="`is-${color}`"
/>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Creature } from "@/creatures/creature";
import AnimatedBar from "@/components/AnimatedBar.vue";

const props = defineProps<{
  creature: Creature;
}>();

const color = computed(() => {
  if (props.creature.healthRatio < 0.1)
    return "danger";
  else if (props.creature.healthRatio < 0.25)
    return "warning";
  else
    return "primary";
});
</script>
