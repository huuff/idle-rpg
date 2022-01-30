<template>
<notification-message />
<component :is="componentToShow" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import { isNoCreature } from "@/creatures/creature";
import Game from "@/components/Game.vue";
import ChooseCharacter from "@/components/modals/ChooseCharacter";
import NotificationMessage from "./components/NotificationMessage.vue";

const { player } = storeToRefs(useMainStore());

const componentToShow = computed(() => {
  if (isNoCreature(player.value))
    return ChooseCharacter;
  else
    return Game;
});
</script>
