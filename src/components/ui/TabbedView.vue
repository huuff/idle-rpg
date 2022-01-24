<template>
<div class="tabs mb-2">
  <ul>
    <li v-for="tab in tabs"
        :key="tab"
        :class="{ 'is-active': tab === currentTab }"
    ><a @click="currentTab = tab">{{ tab }}</a></li>
  </ul>
</div>

<current-slot />
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from "vue";

const props = defineProps<{
  tabs: { [s: string]: string };
}>();

const currentTab = ref(props.tabs[Object.keys(props.tabs)[0]]);

const currentSlot = computed(() => {
  const slots = useSlots();
  return slots[currentTab.value];
})
</script>
