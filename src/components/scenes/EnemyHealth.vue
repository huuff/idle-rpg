<template>
<p class="title has-text-dark">Enemies</p>
<template v-for="enemy in enemies" :key="enemy.name">
  <span> {{enemy.name }} </span>
  <health-bar :creature="enemy" />
</template>
</template>

<script setup lang="ts">
import { Creature } from "@/creatures/creature";
import HealthBar from "../HealthBar.vue";

const props = defineProps<{
  enemies: Creature[];
}>();
</script>
