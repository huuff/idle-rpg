<template>
  <div class="card" id="autoplay-menu">
    <header class="card-header">
      <p class="card-header-title">Autoplay</p>
      <button class="card-header-icon" @click="expanded = !expanded">
        <span class="icon">
          <font-awesome-icon :icon="expanded ? 'angle-down' : 'angle-up'" />
        </span>
      </button>
    </header>
    <div v-if="expanded" class="card-content">
      <div class="is-flex is-flex-direction-column">
        <label class="checkbox mb-3">
          <input type="checkbox" v-model="checkbox" />
          Autoplay
          <span v-if="isEngaged" class="has-text-weight-semibold">{{ objective }}</span>
        </label>
        <div>
          <p>Retreat at:</p>
          <div class="is-flex flex-direction-row">
            <input  v-model="retreatHealth"
            type="range" 
            min="0" max="1" 
            step="0.01" 
            class="mr-2"
            />
            <span>{{ Math.round(retreatHealth * 100) }}% Health</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/settings-store";
import { TravelOption } from "@/map/game-map";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faAngleUp, faAngleDown);

const expanded = ref(false);

const { autoplay, retreatHealth } = storeToRefs(useSettingsStore());

const checkbox = computed({
  get: () => autoplay.value !== "disabled",
  set: (newVal: boolean) => {
    autoplay.value = newVal ? "enabled" : "disabled";
  }
});

const isEngaged = computed(() => autoplay.value !== "disabled" && autoplay.value !== "enabled");

const objective = computed(() => {
  if (isEngaged.value) {
    const destination = (autoplay.value as TravelOption);
    return `Go to ${destination.to.name}`;
  } else {
    return "";
  }
});
</script>

<style scoped>
#autoplay-menu {
  position: fixed;
  left: 2rem;
  bottom: 0px;
  width: 20rem;
}
</style>