<template>
<div class="hero is-fullheight is-info is-bold">
  <div class="hero-body">
    <div class="container">
      <zone-progress v-if="currentZone" :current-zone="currentZone" />
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
          <div v-if="currentScene?.secondaryView" class="tile is-child box">
            <secondary-view />
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child box">
            <main-view /> 
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, } from "vue";
import { onUnmounted, onMounted } from "vue";
import { Ticker } from "@/ticker";
import { Rest } from "@/rest-scene";
import { Scene } from "@/scene";
import { Zone, createPlains } from "@/zones/zone";
import { useMainStore } from "@/store";
import AnimatedBar from "./components/AnimatedBar.vue";
import HealthBar from "./components/HealthBar.vue";
import ZoneProgress from "./components/ZoneProgress.vue";

const { player } = useMainStore();
const ticker = new Ticker(3, 1000);

const currentScene: Ref<Scene | undefined> = ref(undefined);
const mainView = () => currentScene.value && currentScene.value.mainView();
const secondaryView = () => currentScene.value && currentScene.value.secondaryView && currentScene.value.secondaryView();

let currentZone: Zone = reactive(createPlains()) as Zone; 

function nextScene() {
  currentScene.value = currentZone?.newEncounter();
  // TODO: A starting scene would prevent currentScene
  // from ever being undefined. I can use this one to
  // choose a class
  ticker.startScene(currentScene.value!, () => {
    if (player.currentHealth <= 0) {
      return; // Game over
    } else if (player.healthRatio <= 0.20) {
      currentScene.value = new Rest();
      currentZone = reactive(createPlains()) as Zone;
      ticker.startScene(currentScene.value, nextScene);
    } else {
      nextScene();
    }
  });
}

onMounted(() => nextScene());
onUnmounted(() => ticker.stop());
</script>
