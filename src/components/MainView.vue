<template>
<div class="tabs">
<ul>
  <li v-for="tab in Tab"
      :key="tab"
      :class="{ 'is-active': tab === currentTab }"
  ><a @click="currentTab = tab">{{ tab }}</a></li>
</ul>
</div>
<template v-if="currentTab === Tab.Scene">
  <main-view />
</template>
<template v-else-if="currentTab === Tab.Inventory">
  <inventory-view :inventory="inventory" />
</template>
</template>

<script setup lang="ts">
// TODO: Dry this and `PlayerView` with a TabbedTile component
import { ref, computed } from "vue";
import { useSceneStore } from "@/scenes/scene-store";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import InventoryView from "./InventoryView.vue";

const { player } = useMainStore();

enum Tab {
  Scene = "Main",
  Inventory = "Inventory",
}

const currentTab = ref(Tab.Scene);
const { mainView } = storeToRefs(useSceneStore());

const inventory = computed(() => player.inventory);

const currentView = computed(() => {
  if (currentTab.value === Tab.Scene)
    return mainView;
  else if (currentTab.value === Tab.Inventory)
    return InventoryView;
  else
    throw new Error(`Tab ${currentTab.value} not handled in 'PlayerView'`);
})

</script>
