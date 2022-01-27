<template>
<strong> {{ name }}</strong> <span v-tippy="detailPopover">{{ value }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
    name: string;
    value: number;
    details?: { [name: string]: number | undefined};
}>(), {
    details: () => ({})
});

const detailPopover = computed(() => Object.entries(props.details)
    .filter(([_, value]) => value)
    .map(([name, value]) => `${name}: +${value}`)
    .join("<br/>")
)
</script>