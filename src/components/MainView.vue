<template>
<tabbed-view :tabs="Tab">
  <template v-slot:[Tab.Scene]>
    <main-view />
  </template>
  <template v-slot:[Tab.Inventory]>
    <inventory-view />
  </template>
  <template v-slot:[Tab.Settings]>
    <settings-view />
  </template>
</tabbed-view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSceneStore } from "@/scenes/scene-store";
import TabbedView from "@/components/ui/TabbedView.vue";
import InventoryView from "@/components/InventoryView.vue";
import SettingsView from "@/components/SettingsView.vue";

enum Tab {
  Scene = "Main",
  Inventory = "Inventory",
  Settings = "Settings",
}

const mainView = computed(() => useSceneStore().mainView);
</script>
