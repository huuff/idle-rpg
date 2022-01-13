<template>
<div class="hero is-fullheight is-primary is-bold">
  <div class="hero-body">
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box">
          <p class="title has-text-dark">Player</p>
          <p class="subtitle has-text-dark">Level {{ player.level }}</p>
          <span>Health</span>
          <health-bar :actor="player" />
          <span>Experience</span>
          <animated-bar :current="player.currentExp" :max="playerRequiredExp" class="is-info"/>
        </div>
        <div class="tile is-child box">
          <p class="title has-text-dark">Enemies</p>
          <template v-for="enemy in enemies" :key="enemy.name">
            <span>{{enemy.name}}</span>
            <health-bar :actor="enemy" />
          </template>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title has-text-dark">Battle Log</p>
          <ul>
            <li v-for="(msg, i) in battleLog.messages()" :key="`${msg}-${i}`">{{ msg }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, Ref } from "vue";
import { onUnmounted, onMounted } from "vue";
import { Actor } from "@/battle/actor";
import { BattleLogImpl } from "@/battle/battle-log";
import { BasicAttack } from "@/battle/basic-attack";
import { Battle, } from "@/battle/battle";
import { makeSlime } from "@/battle/monsters";
import { Ticker } from "@/ticker";
import { Stats } from "@/battle/stats";
import { randomInt } from "@/util/random";
import range from "@/util/range";
import AnimatedBar from "./components/AnimatedBar.vue";
import HealthBar from "./components/HealthBar.vue";

const basePlayerStats: Stats = {
    maxHealth: 50,
    strength: 12,
    agility: 8,
};

const playerProgression: Stats = {
    maxHealth: 5,
    strength: 2,
    agility: 1
};
const player: Actor = reactive(new Actor(
  "Player", 
  basePlayerStats, 
  [new BasicAttack()],
  playerProgression,
));
const playerRequiredExp = computed(() => player.requiredExp());

const ticker = new Ticker(2);
const battleLog = reactive(new BattleLogImpl());

let enemies: Ref<Actor[]> = ref([]);

function newEncounter() {
  enemies.value = range(randomInt(3)).map(i => makeSlime(i+1));
  return new Battle([ player ], enemies.value, battleLog);
}

function startBattle() {
  battleLog.clear();
  ticker.startBattle(newEncounter(), (_) => startBattle());
}

onMounted(() => startBattle());
onUnmounted(() => ticker.stop());
</script>
