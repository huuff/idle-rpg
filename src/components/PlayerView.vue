<template>
<tabbed-view :tabs="Tab" :tab-to-component="tabToComponent" :componentProps="componentProps" />
</template>

<script setup lang="ts">
import { computed, ComputedRef, Component } from "vue";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import TabbedView from "@/components/ui/TabbedView.vue";
import CreatureView from "@/components/CreatureView.vue";
import StatsView from "@/components/StatsView.vue";

const { player } = storeToRefs(useMainStore());

enum Tab {
  Main = "Main",
  Stats = "Stats",
}


const tabToComponent: ComputedRef<Record<Tab, Component>> = computed(() => ({
  [Tab.Main]: CreatureView,
  [Tab.Stats]: StatsView,
}));

const componentProps = computed(() => ({
  "creature": player.value
}));
</script>
