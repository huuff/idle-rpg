<template>
<div class="is-flex is-flex-direction-column">
  <button 
    type="button" 
    class="button is-primary"
    @click="save(); $forceUpdate()"
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
    @click="deleteSave(); $forceUpdate()"
  >Delete</button>
</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { save, load, existsSaveData, deleteSave } from "@/save-load/save-load";

const saveDataPresent = computed(() => existsSaveData());

</script>
