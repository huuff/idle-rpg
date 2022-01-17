<template>
<div class="hero is-fullheight is-info is-bold">
  <div class="hero-body">
    <div class="container">
      <location-indicator />
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
import LocationIndicator from "@/components/location/LocationIndicator.vue";
import { AutoTraveller } from "./autotraveller";
import { Rest } from "@/rest";
import {useTravelStore} from "./travel-store";

const { 
  player, 
  sceneMainView: mainView,
  sceneSecondaryView: secondaryView,
  battle,
  } = storeToRefs(useMainStore());

const { mapStatus } = storeToRefs(useTravelStore());

const ticker = new Ticker();
const autotraveller = new AutoTraveller();

watch(mapStatus, (newValue) => {
  if (newValue.type === "resting") {
    battle.value = undefined;
    ticker.start(new Rest(), () => {}); // eslint-disable-line
  } else {
    battle.value = newValue.through.newEncounter(newValue.encounters);
    ticker.start(battle.value!, autotraveller.updateStatus.bind(autotraveller));
  }
});

onUnmounted(() => ticker.stop());
</script>
