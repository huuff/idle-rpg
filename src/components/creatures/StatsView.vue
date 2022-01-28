<template>
<div class="content">
  <p class="title has-text-dark my-1"> {{ creature.name }} </p>
  <stat-detail name="Level" :value="creature.level" /> <br />
  <strong>Species:</strong> {{ creature.species.name }} <br/>
  <strong>Class:</strong> {{ creature.jobClass.name }} <br/>
  <stat-detail 
    name="Max Health"
    :value="creature.stats.maxHealth"
    :details="getDetails('maxHealth')"
  /> <br />
  <stat-detail
    name="Strength"
    :value="creature.stats.strength"
    :details="getDetails('strength')"
  /> <br/>
  <stat-detail
    name="Agility"
    :value="creature.stats.agility"
    :details="getDetails('agility')"
  /> <br />
</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Creature } from "@/creatures/creature";
import StatDetail from "./StatDetail.vue";
import equipment from "@/items/equipment";
import stats from "@/creatures/stats";

const props = defineProps<{
  creature: Creature;
}>();

const equipmentStats = computed(() => equipment.stats(props.creature.equipment));
const classStats = computed(() => stats.calculateByLevel(props.creature.jobClass, props.creature.level));
const speciesStats = computed(() => stats.calculateByLevel(props.creature.species, props.creature.level));

function getDetails(statName: keyof typeof props.creature.stats) {
  return {
    Equipment: equipmentStats.value[statName],
    Class: classStats.value[statName],
    Species: speciesStats.value[statName],
  }
}
</script>
