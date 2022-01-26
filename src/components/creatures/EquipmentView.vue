<template>
<div class="content">
  <p class="title has-text-dark mb-2"> {{ creature.name }}</p>
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
import { Creature } from "@/creatures/creature";
import capitalize from "lodash/capitalize";
import equipment from "@/items/equipment";

const props = defineProps<{
  creature: Creature;
}>();

</script>
