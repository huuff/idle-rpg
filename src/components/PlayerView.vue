<template>
<div class="tabs">
<ul>
  <li v-for="tab in Tab" 
      :key="tab"
      :class="{ 'is-active': tab === currentTab }"
  ><a @click="currentTab = tab">{{ tab }}</a></li>
</ul>
</div>
<component :is="currentView" :creature="player" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useMainStore } from "@/store";
import CreatureView from "@/components/CreatureView.vue";
import StatsView from "@/components/StatsView.vue";

const { player } = useMainStore();

enum Tab {
  Main = "Main",
  Stats = "Stats",
}

const currentTab = ref(Tab.Main);

const currentView = computed(() => {
  if (currentTab.value === Tab.Main)
    return CreatureView;
  else if (currentTab.value === Tab.Stats)
    return StatsView
  else
    throw new Error(`Tab ${currentTab.value} not handled in 'PlayerView'`);
})
</script>
