<template>
  <p class="title has-text-dark">{{creature.name}}</p>
  <p class="subtitle has-text-dark">
    {{creature.jobClass.name}}, Level {{ creature.level }}
  </p>
  <span>Health</span>
  <health-bar :creature="creature" />
  <span>Experience</span>
  <animated-bar :current="creature.currentExp" :max="creature.requiredExp" class="is-info"/>
</template>

<script setup lang="ts">
import { Creature } from "@/creatures/creature";
import HealthBar from "@/components/creatures/HealthBar.vue";
import AnimatedBar from "@/components/AnimatedBar.vue";

const props = defineProps<{
  creature: Creature;
}>();
</script>
