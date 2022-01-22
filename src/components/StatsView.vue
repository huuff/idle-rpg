<template>
<div class="content">
  <p class="title has-text-dark"> {{ creature.name }} </p>
  <strong>Level:</strong> {{ creature.level }}  <br/>
  <strong>Species:</strong> {{ creature.species.name }} <br/>
  <strong>Class:</strong> {{ creature.jobClass.name }} <br/>
  <strong>Max Health:</strong> {{ creature.stats.maxHealth }} <br/>
  <strong>Strength:</strong> {{ creature.stats.strength }} <br/>
  <strong>Agility:</strong> {{ creature.stats.agility }} <br />
</div>
</template>

<script setup lang="ts">
import { Creature } from "@/creatures/creature";

const props = defineProps<{
  creature: Creature;
}>();
</script>
