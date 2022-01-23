<template>
<label class="checkbox">
  <input type="checkbox" v-model="checkbox"/>
  Autoplay <span v-if="isEngaged" class="has-text-weight-semibold"> {{ objective }} </span>
</label>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store";
import { TravelOption } from "@/map/game-map";

const { autoplay } = storeToRefs(useMainStore());

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
