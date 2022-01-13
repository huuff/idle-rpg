<template>
<div class="hero is-fullheight is-primary is-bold">
  <div class="hero-body">
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box">
          <p class="title has-text-dark">Player</p>
          <span>Health</span>
          <animated-bar :current="player.currentHealth" :max="player.stats.maxHealth" />
          <span>Experience</span>
          <animated-bar :current="player.currentExp" :max="playerRequiredExp" class="is-info"/>
        </div>
        <div class="tile is-child box">
          <p class="title has-text-dark">Enemies</p>
          <template v-for="enemy in enemies" :key="enemy.name">
            <span>{{enemy.name}}</span>
            <animated-bar :current="enemy.currentHealth" :max="enemy.stats.maxHealth" />
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
import { reactive, computed } from "vue";
import { onUnmounted, onMounted } from "vue";
import { Actor } from "@/battle/actor";
import { BattleLogImpl } from "@/battle/battle-log";
import { BasicAttack } from "@/battle/basic-attack";
import { Battle, } from "@/battle/battle";
import { makeSlime } from "@/battle/monsters";
import { Ticker } from "@/ticker";
import { Stats } from "@/battle/stats";
import AnimatedBar from "./components/AnimatedBar.vue";

const basePlayerStats: Stats = {
    maxHealth: 50,
    strength: 12,
    agility: 8,
};
const player: Actor = reactive(new Actor("Player", basePlayerStats, [ new BasicAttack() ]));
const playerRequiredExp = computed(() => player.requiredExp());

const enemies = [
  reactive(makeSlime(1)),
  reactive(makeSlime(2)),
  reactive(makeSlime(3)),
];

const ticker = new Ticker(2);
const battleLog = reactive(new BattleLogImpl());
const battle = new Battle([ player ], enemies, battleLog);

onMounted(() => ticker.startBattle(battle, (result) => {
  console.log(result);
}));
onUnmounted(() => ticker.stop());
</script>
