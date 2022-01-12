<template>
<p>Test</p>
</template>

<script setup lang="ts">
import { onUnmounted, onMounted } from "vue";
import { Actor } from "@/battle/actor";
import { BasicAttack } from "@/battle/basic-attack";
import { Battle } from "@/battle/battle";
import { makeSlime } from "@/battle/monsters";

const player: Actor = {
  name: "Player",
  currentHealth: 50,
  stats: {
    maxHealth: 50,
    strength: 12,
  },
  actions: [ new BasicAttack() ]
}

const battle = new Battle([ player ], [ makeSlime(1), makeSlime(2), makeSlime(3) ]);

onMounted(() => battle.start())
onUnmounted(() => battle.stop());
</script>
