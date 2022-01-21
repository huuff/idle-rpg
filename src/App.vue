<template>
  <div class="container game-container">
    <location-indicator />
    <div class="tile is-ancestor tiles-contents">
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box">
          <p class="title has-text-dark">Player</p>
          <p class="subtitle has-text-dark">Level {{ player.level }}</p>
          <span>Health</span>
          <health-bar :creature="player" />
          <span>Experience</span>
          <animated-bar :current="player.currentExp" :max="player.requiredExp" class="is-info"/>
        </div>
        <div v-if="secondaryView" class="tile is-child box">
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
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store";
import { useSceneStore } from "@/scenes/scene-store";
import AnimatedBar from "./components/AnimatedBar.vue";
import HealthBar from "./components/HealthBar.vue";
import LocationIndicator from "@/components/location/LocationIndicator.vue";

const { player, } = storeToRefs(useMainStore());
const { mainView, secondaryView } = storeToRefs(useSceneStore());

</script>

<style>
body, body, #app {
  height: 100vh;
  background-color: hsl(204, 86%, 53%);
}

.game-container {
  height: 90vh;
  padding: 10vh 0;
}

.tiles-contents {
  height: 100%;
}
</style>
