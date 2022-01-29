<template>
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
import { ref } from "vue";
import { save, load, saveDataExists, deleteSave } from "@/save-load/save-load";
import { useTravelStore } from "@/travel/travel-store";
import { storeToRefs } from "pinia";
import ButtonColumn from "@/components/ui/ButtonColumn.vue";

const saveDataPresent = ref(saveDataExists());

const { mapStatus } = storeToRefs(useTravelStore());

</script>
