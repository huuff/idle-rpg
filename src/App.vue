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
          <p class="title has-text-dark">Enemies</p>
          <template v-for="enemy in enemies" :key="enemy.name">
            <span>{{enemy.name}}</span>
            <actor-health :actor="enemy" />
          </template>
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

const enemies = [
  reactive(makeSlime(1)),
  reactive(makeSlime(2)),
  reactive(makeSlime(3)),
];

const battleLog = ref<string[]>([]);
const battle = new Battle([ player ], enemies, battleLog);

onMounted(() => battle.start())
onUnmounted(() => battle.stop());
</script>
