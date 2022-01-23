<template>
<div class="content">
  <p class="title has-text-dark mb-2"> {{ creature.name }}</p>
  <template v-for="(item, slotName) in creature.equipment.slots "
    :key="slotName"
  >
    <strong>{{ capitalize(slotName) }}:</strong> {{ item.name }}
  </template>
</div>
</template>

<script setup lang="ts">
import { Creature } from "@/creatures/creature";
import capitalize from "lodash/capitalize";

const props = defineProps<{
  creature: Creature;
}>();

</script>
