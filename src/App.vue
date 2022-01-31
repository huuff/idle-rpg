<template>
<notification-message />
<component :is="componentToShow" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import Creatures from "@/creatures/creature";
import Game from "@/components/Game.vue";
import ChooseCharacter from "@/components/modals/ChooseCharacter";
import NotificationMessage from "./components/NotificationMessage.vue";
import { useCreaturesStore } from "./creatures-store";

const { player } = storeToRefs(useCreaturesStore());

const componentToShow = computed(() => {
  if (!player.value || Creatures.isNoCreature(player.value))
    return ChooseCharacter;
  else
    return Game;
});
</script>
