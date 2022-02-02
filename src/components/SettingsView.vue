<template>
<div class="has-text-centered">
  <label>
    <input type="checkbox" v-model="autosaveEnabled" />
    Autosave <span v-if="autosaveEnabled">(Last save: <span class="has-text-weight-semibold">{{ lastSave ?? "not yet" }}</span>)</span>
  </label>
</div>
<button-column>
  <button 
    type="button" 
    class="button is-primary"
    @click="save(); saveDataPresent = true"
    :disabled="mapStatus.type !== 'resting'"
  >Save</button>
  <button
    type="button"
    class="button is-info"
    :disabled="!saveDataPresent"
    @click="load"
  >Load</button>
  <button
    type="button"
    class="button is-danger"
    :disabled="!saveDataPresent"
    @click="deleteSave(); saveDataPresent = false"
  >Delete</button>
</button-column>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { save, load, saveDataExists, deleteSave } from "@/save-load/save-load";
import { useTravelStore } from "@/travel/travel-store";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/settings-store";
import ButtonColumn from "@/components/ui/ButtonColumn.vue";

const saveDataPresent = ref(saveDataExists());

const { mapStatus } = storeToRefs(useTravelStore());
const { autosave } = storeToRefs(useSettingsStore());

const autosaveEnabled = computed({
  get: () => autosave.value.isEnabled,
  set: (newVal: boolean) => {
    if (newVal) {
      autosave.value.start();
    } else {
      autosave.value.stop();
    }
  }
})

const lastSave = computed(() => autosave.value.lastSave);
</script>
