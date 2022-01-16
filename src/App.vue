<template>
<div class="hero is-fullheight is-info is-bold">
  <div class="hero-body">
    <div class="container">
      <zone-progress />
      <div class="tile is-ancestor">
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
  </div>
</div>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { Ticker } from "@/ticker";
import { useMainStore } from "@/store";
import AnimatedBar from "./components/AnimatedBar.vue";
import HealthBar from "./components/HealthBar.vue";
import ZoneProgress from "./components/location/ZoneProgress.vue";
import { AutoTraveller } from "./autotraveller";

const store = useMainStore();
const { 
  player, 
  scene,
  sceneMainView: mainView,
  sceneSecondaryView: secondaryView,
  } = storeToRefs(store);

const ticker = new Ticker();
const autoplay = new AutoTraveller();

watch(scene, () => {
  ticker.startScene(scene.value, autoplay.changeStatus.bind(autoplay));
})

/*onMounted(() => ticker.startScene(currentScene.value, autoplay.changeStatus.bind(autoplay)));*/
onUnmounted(() => ticker.stop());
</script>
