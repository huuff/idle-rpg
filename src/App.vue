<template>
<component :is="componentToShow" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import { isNoCreature } from "@/creatures/creature";
import Game from "@/Game.vue";
import ChooseCharacter from "@/components/modals/ChooseCharacter";

const { player } = storeToRefs(useMainStore());

const componentToShow = computed(() => {
  if (isNoCreature(player.value))
    return ChooseCharacter;
  else
    return Game;
});
</script>
