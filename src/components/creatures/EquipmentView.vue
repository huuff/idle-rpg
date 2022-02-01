<template>
<div class="content">
  <p class="title has-text-dark mb-5"> {{ creature.name }}</p>
  <p class="subtitle mb-2" :class="loadColor">
    Load: {{ creatureLoad.current }}  /  {{ creatureLoad.max }}
  </p>
  <template v-for="(item, slotName) in Equipments.from(creature.inventory) "
    :key="slotName"
  >
    <template v-if="item">
      <strong>{{ capitalize(slotName) }}:</strong> {{ item.name }} <br/>
    </template>
  </template>
</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Creatures, { Creature } from "@/creatures/creature";
import capitalize from "lodash/capitalize";
import Equipments from "@/items/equipment";
import Loads from "@/items/load";

const props = defineProps<{
  creature: Creature;
}>();

const creatureLoad = computed(() => Creatures.load(props.creature));

const loadColor = computed(() => {
  const loadProportion = Loads.proportion(creatureLoad.value);
  if (loadProportion < 0.75)
    return "has-text-dark";
  else if (loadProportion <= 0.95)
    return "has-text-warning";
  else
    return "has-text-danger";
});

</script>
