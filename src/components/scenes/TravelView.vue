<template>
<p class="title has-text-dark">Travel log</p>
<ul>
  <li v-for="(msg, i) in travelLog.messages"
    :key="`${msg}-${i}`"
  >
    {{ msg }}
  </li>
</ul>
</template>

<script setup lang="ts">
// FUTURE: Literally the same as the battle view, well see in the future if there's anything else I need to put here
import { useMainStore } from "@/store";

const { travelLog } = useMainStore();
</script>
