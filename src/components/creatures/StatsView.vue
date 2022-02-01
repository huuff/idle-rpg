<template>
<div class="content">
  <p class="title has-text-dark my-1"> {{ creature.name }} </p>
  <stat-detail name="Level" :value="creature.level" /> <br />
  <strong>Species:</strong> {{ creature.species.name }} <br/>
  <strong>Class:</strong> {{ creature.jobClass.name }} <br/>
  <stat-detail 
    name="Max Health"
    :value="totalStats.maxHealth"
    :details="getDetails('maxHealth')"
  /> <br />
  <stat-detail
    name="Strength"
    :value="totalStats.strength"
    :details="getDetails('strength')"
  /> <br/>
  <stat-detail
    name="Agility"
    :value="totalStats.agility"
    :details="getDetails('agility')"
  /> <br />
</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Creatures, { Creature } from "@/creatures/creature";
import StatDetail from "./StatDetail.vue";
import Equipments from "@/items/equipment";
import StatsOps from "@/creatures/stats";

const props = defineProps<{
  creature: Creature;
}>();

const equipmentStats = computed(() => Equipments.stats(Creatures.equipment(props.creature)));
const classStats = computed(() => StatsOps.calculateByLevel(props.creature.jobClass, props.creature.level));
const speciesStats = computed(() => StatsOps.calculateByLevel(props.creature.species, props.creature.level));

const totalStats = computed(() => Creatures.stats(props.creature));

function getDetails(statName: keyof typeof totalStats.value) {
  return {
    Equipment: equipmentStats.value[statName],
    Class: classStats.value[statName],
    Species: speciesStats.value[statName],
  }
}
</script>
