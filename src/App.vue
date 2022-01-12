<template>
<div class="hero is-fullheight is-primary is-bold">
  <div class="hero-body">
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box">
          <p class="title has-text-dark">Player</p>
          <actor-health :actor="player" />
        </div>
        <div class="tile is-child box">
          <p class="title has-text-dark">Two</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title has-text-dark">Battle Log</p>
          <ul>
            <li v-for="(msg, i) in battleLog" :key="`${msg}-${i}`">{{ msg }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { onUnmounted, onMounted } from "vue";
import { Actor } from "@/battle/actor";
import { BasicAttack } from "@/battle/basic-attack";
import { Battle } from "@/battle/battle";
import { makeSlime } from "@/battle/monsters";
import ActorHealth from "./components/ActorHealth.vue";

const player: Actor = reactive({
  name: "Player",
  currentHealth: 50,
  stats: {
    maxHealth: 50,
    strength: 12,
    agility: 8,
  },
  actions: [ new BasicAttack() ]
});

const battleLog = ref<string[]>([]);
const battle = new Battle([ player ], [ makeSlime(1), makeSlime(2), makeSlime(3) ], battleLog);

onMounted(() => battle.start())
onUnmounted(() => battle.stop());
</script>
