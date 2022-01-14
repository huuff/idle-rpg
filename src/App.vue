<template>
<div class="hero is-fullheight is-info is-bold">
  <div class="hero-body">
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box">
          <p class="title has-text-dark">Player</p>
          <p class="subtitle has-text-dark">Level {{ player.level }}</p>
          <span>Health</span>
          <health-bar :actor="player" />
          <span>Experience</span>
          <animated-bar :current="player.currentExp" :max="player.requiredExp" class="is-info"/>
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
          <current-scene-view /> 
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, computed, h } from "vue";
import { onUnmounted, onMounted } from "vue";
import { Actor } from "@/battle/actor";
import { BasicAttack } from "@/battle/basic-attack";
import { Battle, } from "@/battle/battle";
import { makeSlime } from "@/battle/monsters";
import { Ticker } from "@/ticker";
import { Rest } from "@/rest-scene";
import { Stats } from "@/battle/stats";
import { randomInt } from "@/util/random";
import { Scene } from "@/scene";
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
const ticker = new Ticker(2);

let enemies: Ref<Actor[]> = ref([]);

let currentScene: Ref<Scene | undefined> = ref(undefined);
const currentSceneView = () => h("div", {}, currentScene.value && currentScene.value.mainView());

function newEncounter() {
  enemies.value = range(randomInt(3)).map(i => makeSlime(i+1));
  return new Battle([ player ], enemies.value);
}

function nextScene() {
  currentScene.value = newEncounter();
  ticker.startScene(currentScene.value, () => {
    if (player.currentHealth <= 0) {
      return; // Game over
    } else if (player.healthRatio <= 0.15) {
      currentScene.value = new Rest(player);
      ticker.startScene(currentScene.value, nextScene);
    } else {
      nextScene();
    }
  });
}

onMounted(() => nextScene());
onUnmounted(() => ticker.stop());
</script>
