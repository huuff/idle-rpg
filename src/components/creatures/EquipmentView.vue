<template>
<div class="content">
  <p class="title has-text-dark mb-5"> {{ creature.name }}</p>
  <p class="subtitle mb-2" :class="loadColor">
    Load: {{ equipment.totalLoad(equipment.from(creature.inventory)) }}
    /
    {{ stats.maxLoad(creature.stats.strength) }}
  </p>
  <template v-for="(item, slotName) in equipment.from(creature.inventory) "
    :key="slotName"
  >
    <template v-if="item">
      <strong>{{ capitalize(slotName) }}:</strong> {{ item.name }}
    </template>
  </template>
</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Creature } from "@/creatures/creature";
import capitalize from "lodash/capitalize";
import equipment from "@/items/equipment";
import stats from "@/creatures/stats";

const props = defineProps<{
  creature: Creature;
}>();

const loadColor = computed(() => {
  if (props.creature.loadCapacity < 0.75)
    return "has-text-dark";
  else if (props.creature.loadCapacity <= 0.95)
    return "has-text-warning";
  else
    return "has-text-danger";
});

</script>
