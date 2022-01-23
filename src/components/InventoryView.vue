<template>
<div class="content">
  <ul>
    <li v-for="item in inventory.items"
      :key="item.name"
    >
      <strong>{{ item.name }}:</strong> {{ item.amount}}
    </li>
  </ul>
</div>
</template>

<script setup lang="ts">
import { Inventory } from "@/items/inventory";

const props = defineProps<{
  inventory: Inventory
}>();
</script>
