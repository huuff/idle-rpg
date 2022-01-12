<template>
<div class="hero is-fullheight is-primary is-bold">
  <div class="hero-body">
    <div class="box column is-6 mx-auto">
      <ul>
        <li v-for="(msg, i) in battleLog" :key="`${msg}-${i}`">{{msg}}</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
    agility: 8,
  },
  actions: [ new BasicAttack() ]
}

const battleLog = ref<string[]>([]);
const battle = new Battle([ player ], [ makeSlime(1), makeSlime(2), makeSlime(3) ], battleLog);

onMounted(() => battle.start())
onUnmounted(() => battle.stop());
</script>
