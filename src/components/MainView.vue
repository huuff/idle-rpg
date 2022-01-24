<template>
<tabbed-view :tabs="Tab">
  <template v-slot:[Tab.Scene]>
    <main-view />
  </template>
  <template v-slot:[Tab.Inventory]>
    <inventory-view :inventory="player.inventory" />
  </template>
</tabbed-view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSceneStore } from "@/scenes/scene-store";
import { useMainStore } from "@/store";
import TabbedView from "@/components/ui/TabbedView.vue";
import InventoryView from "./InventoryView.vue";

const { player } = useMainStore();

enum Tab {
  Scene = "Main",
  Inventory = "Inventory",
}

const mainView = computed(() => useSceneStore().mainView);
</script>
