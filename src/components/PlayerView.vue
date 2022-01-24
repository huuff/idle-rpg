<template>
<tabbed-view :tabs="Tab">
  <template v-slot:[Tab.Main]>
    <creature-status :creature="player" />
  </template>
  <template v-slot:[Tab.Stats]>
    <stats-view :creature="player" />
  </template>
  <template v-slot:[Tab.Equipment]>
    <equipment-view :creature="player" />
  </template>
</tabbed-view>
</template>

<script setup lang="ts">
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
</script>
