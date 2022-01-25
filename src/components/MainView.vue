<template>
<tabbed-view :tabs="Tab">
  <template v-slot:[Tab.Scene]>
    <main-view />
  </template>
  <template v-slot:[Tab.Inventory]>
    <inventory-view :inventory="player.inventory" />
  </template>
  <template v-slot:[Tab.Settings]>
    <settings-view />
  </template>
</tabbed-view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSceneStore } from "@/scenes/scene-store";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import TabbedView from "@/components/ui/TabbedView.vue";
import InventoryView from "@/components/InventoryView.vue";
import SettingsView from "@/components/SettingsView.vue";

const { player } = storeToRefs(useMainStore());

enum Tab {
  Scene = "Main",
  Inventory = "Inventory",
  Settings = "Settings",
}

const mainView = computed(() => useSceneStore().mainView);
</script>
