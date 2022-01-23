<template>
  <money-view />
  <div class="container game-container">
    <location-indicator />
    <div class="tile is-ancestor tiles-contents">
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box tabbed-tile">
          <player-view />
        </div>
        <div v-if="secondaryView" class="tile is-child box scroll-tile">
          <secondary-view />
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child box scroll-tile">
          <main-view /> 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSceneStore } from "@/scenes/scene-store";
import PlayerView from "@/components/PlayerView.vue";
import LocationIndicator from "@/components/location/LocationIndicator.vue";
import MoneyView from "@/components/MoneyView.vue";

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

.tabbed-tile {
  padding-top: 0 !important;
}

.scroll-tile {
  overflow-y: scroll;
}
</style>
