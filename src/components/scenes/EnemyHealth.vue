<template>
<p class="title has-text-dark">Enemies</p>
<template v-for="enemy in enemies" :key="enemy.name">
  <span> {{enemy.name }} </span>
  <health-bar :actor="enemy" />
</template>
</template>

<script setup lang="ts">
import { Actor } from "@/battle/actor";
import HealthBar from "../HealthBar.vue";

const props = defineProps<{
  enemies: Actor[];
}>();
</script>
