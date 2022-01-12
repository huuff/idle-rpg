<template>
<p>Test</p>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";
import { Actor } from "@/battle/actor";
import { BasicAttack } from "@/battle/basic-attack";
import { choose } from "@/util/choose";

const player: Actor = {
  name: "Player",
  currentHealth: 100,
  stats: {
    maxHealth: 100,
    strength: 12,
  },
  actions: [ new BasicAttack() ]
}

const slime: Actor = {
  name: "Slime",
  currentHealth: 20,
  stats: {
    maxHealth: 20,
    strength: 8
  },
  actions: [ new BasicAttack() ]
}

const game = setInterval(() => {
  const executor = choose([ player, slime ]);
  const target = executor === player ? slime : player;
  choose(executor.actions).execute(executor, target);
}, 1000)

onUnmounted(() => clearInterval(game));
</script>
