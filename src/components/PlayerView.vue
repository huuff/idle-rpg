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
import EquipmentView from "@/components/EquipmentView.vue";

const { player } = storeToRefs(useMainStore());

enum Tab {
  Main = "Main",
  Stats = "Stats",
  Equipment = "Equipment",
}


const tabToComponent: ComputedRef<Record<Tab, Component>> = computed(() => ({
  [Tab.Main]: CreatureView,
  [Tab.Stats]: StatsView,
  [Tab.Equipment]: EquipmentView,
}));

const componentProps = computed(() => ({
  "creature": player.value
}));
</script>
