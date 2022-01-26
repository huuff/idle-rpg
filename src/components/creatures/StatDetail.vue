<template>
<strong> {{ name }}</strong> <span>{{ value }}</span>
    <span v-if="details.equipment"
        class="mx-2 has-text-danger">+{{details.equipment}} </span>
    <span v-if="details.jobClass"
        class="mx-2 has-text-info"
    >+{{details.jobClass}} </span>
    <span v-if="details.species"
        class="mx-2 has-text-success"
    >+{{details.species}} </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

export type DetailsProp = {
    equipment?: number;
    jobClass?: number;
    species?: number
}

const props = withDefaults(defineProps<{
    name: string;
    value: number;
    details?: DetailsProp;
}>(), {
    details: () => ({})
});
</script>