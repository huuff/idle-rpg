<template>
  <progress class="progress-is-primary" :value="actor.currentHealth" :max="actor.stats.maxHealth">
    {{ actor.currentHealth }}
  </progress>
</template>

<script setup lang="ts">
import { Actor } from "@/battle/actor";

const props = defineProps<{
  actor: Actor;
}>();
</script>
