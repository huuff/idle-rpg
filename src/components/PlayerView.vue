<template>
<tabbed-view :tabs="Tab" :tab-to-component="tabToComponent" :componentProps="componentProps" />
</template>

<script setup lang="ts">
import { computed, ComputedRef, Component } from "vue";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import TabbedView from "@/components/ui/TabbedView.vue";
import CreatureStatus from "@/components/creatures/CreatureStatus.vue";
import StatsView from "@/components/creatures/StatsView.vue";
import EquipmentView from "@/components/creatures/EquipmentView.vue";

const { player } = storeToRefs(useMainStore());

enum Tab {
  Main = "Main",
  Stats = "Stats",
  Equipment = "Equipment",
}


const tabToComponent: ComputedRef<Record<Tab, Component>> = computed(() => ({
  [Tab.Main]: CreatureStatus,
  [Tab.Stats]: StatsView,
  [Tab.Equipment]: EquipmentView,
}));

const componentProps = computed(() => ({
  "creature": player.value
}));
</script>
