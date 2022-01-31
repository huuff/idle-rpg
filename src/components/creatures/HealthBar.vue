<template>
<animated-bar 
  :current="creature.currentHealth" 
  :max="Creatures.stats(creature).maxHealth" 
  :class="`is-${color}`"
/>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Creatures, { Creature } from "@/creatures/creature";
import AnimatedBar from "@/components/AnimatedBar.vue";

const props = defineProps<{
  creature: Creature;
}>();

const color = computed(() => {
  if (Creatures.healthRatio(props.creature) < 0.1)
    return "danger";
  else if (Creatures.healthRatio(props.creature) < 0.25)
    return "warning";
  else
    return "primary";
});
</script>
