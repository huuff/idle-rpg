<template>
<notification-message />
<component :is="componentToShow" />
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Creatures from "@/creatures/creature";
import Game from "@/components/Game.vue";
import ChooseCharacter from "@/components/modals/ChooseCharacter.vue";
import NotificationMessage from "./components/NotificationMessage.vue";
import { useCreaturesStore } from "./creatures-store";
import startAutolevel from "@/autolevel";
import { saveDataExists, load } from "@/save-load/save-load";

const { player } = storeToRefs(useCreaturesStore());

const componentToShow = computed(() => {
  if (!player.value || Creatures.isNoCreature(player.value))
    return ChooseCharacter;
  else
    return Game;
});

onMounted(() => {
  startAutolevel()

  if (saveDataExists()) {
    load();
  }
});
</script>
