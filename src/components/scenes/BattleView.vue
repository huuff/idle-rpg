<template>
<p class="title has-text-dark">Battle log</p>
<ul>
  <li v-for="(msg, i) in battleLog.messages"
    :key="`${msg}-${i}`"
  >
    {{ msg }}
  </li>
</ul>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store";

const { battleLog } = useMainStore();

</script>
