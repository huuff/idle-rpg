<template>
<tabbed-view :tabs="Tab">
  <template v-slot:[Tab.Scene]>
    <main-view />
  </template>
  <template v-slot:[Tab.Inventory]>
    <player-inventory />
  </template>
  <template v-slot:[Tab.Skills]>
    <skills-view :creature="player" />
  </template>
  <template v-slot:[Tab.Settings]>
    <settings-view />
  </template>
</tabbed-view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSceneStore } from "@/scenes/scene-store";
import { useCreaturesStore } from "@/creatures-store";
import { storeToRefs } from "pinia";
import TabbedView from "@/components/ui/TabbedView.vue";
import PlayerInventory from "@/components/PlayerInventory.vue";
import SettingsView from "@/components/SettingsView.vue";
import SkillsView from "./SkillsView.vue";

enum Tab {
  Scene = "Main",
  Inventory = "Inventory",
  Skills = "Skills",
  Settings = "Settings",
}

const { player } = storeToRefs(useCreaturesStore());

const mainView = computed(() => useSceneStore().mainView);
</script>
