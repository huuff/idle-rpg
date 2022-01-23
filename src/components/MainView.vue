<template>
<tabbed-view :tabs="Tab" :tab-to-component="tabToComponent" :componentProps="props"/>
</template>

<script setup lang="ts">
import { computed, Component, ComputedRef } from "vue";
import { useSceneStore } from "@/scenes/scene-store";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import TabbedView from "@/components/ui/TabbedView.vue";
import InventoryView from "./InventoryView.vue";

const { player } = useMainStore();

enum Tab {
  Scene = "Main",
  Inventory = "Inventory",
}

const { mainView } = storeToRefs(useSceneStore());

const tabToComponent: ComputedRef<Record<Tab, Component>> = computed(() => ({
  [Tab.Scene]: mainView.value,
  [Tab.Inventory]: InventoryView,
}));

const props = computed(() => ({
  "inventory": player.inventory,
}));

</script>
