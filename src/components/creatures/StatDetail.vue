<template>
<strong> {{ name }}</strong> <span v-tippy="detailPopover">{{ value }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
    name: string;
    value: number;
    details?: { [name: string]: number};
}>(), {
    details: () => ({})
});

const detailPopover = computed(() => Object.entries(props.details)
    .map(([name, value]) => `${name}: +${value}`)
    .join("<br/>")
)
</script>