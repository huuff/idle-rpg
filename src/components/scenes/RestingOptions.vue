<template>
<label class="checkbox">
  <input type="checkbox" v-model="autoplay"/>
  Autoplay
</label>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store";

const { autoplay } = useMainStore();
</script>
