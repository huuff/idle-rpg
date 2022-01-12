<template>
<p>Test</p>
</template>

<script setup lang="ts">
import { onUnmounted, onMounted } from "vue";
import { Actor } from "@/battle/actor";
import { BasicAttack } from "@/battle/basic-attack";
import { Battle } from "@/battle/battle";

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
    strength: 4
  },
  actions: [ new BasicAttack() ]
}

const battle = new Battle([ player ], [ slime ]);

onMounted(() => battle.start())
onUnmounted(() => battle.stop());
</script>
