<template>
<button-column>
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
</button-column>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { save, load, existsSaveData, deleteSave } from "@/save-load/save-load";
import ButtonColumn from "@/components/ui/ButtonColumn.vue";

const saveDataPresent = computed(() => existsSaveData());

</script>
