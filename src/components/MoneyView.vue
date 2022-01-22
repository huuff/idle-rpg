<template>
<div class="box money-box py-1 px-2">
  <span class="icon-text">
    <span class="icon">
      <font-awesome-icon icon="coins" />
    </span>
    <span class="has-text-weight-semibold">{{ money }}</span>
  </span>
</div>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store";

const { money } = useMainStore();
</script>

<style>
.money-box {
  position: fixed;
  top: 0px;
  right: 20px;
  width: 120px;
}
</style>
