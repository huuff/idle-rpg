<template>
  <progress class="progress is-primary" :value="shownValue" :max="max">
    {{ current }}
  </progress>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { useMainStore } from "@/store";
import animejs from "animejs";

const props = defineProps<{
  current: number;
  max: number;
}>();

const shownValue = ref(props.current);
const { tickDuration } = useMainStore();

watch(() => props.current, (newValue) => animejs(({
  targets: shownValue,
  value: newValue,
  easing: "linear",
  autoplay: true,
  duration: tickDuration,
})));
</script>
