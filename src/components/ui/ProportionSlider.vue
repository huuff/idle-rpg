<template>
    <div>
        <p>{{label}}:</p>
        <div class="is-flex flex-direction-row">
            <input v-model="computedValue" type="range" min="0" max="1" step="0.01" class="mr-2" />
            <span>{{ Math.round(computedValue * 100) }}% {{ endLabel }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    label: string;
    endLabel?: string;
    value: number;
}>();

const emit = defineEmits<{
    (event: "update:value", value: number): void;
}>();

const computedValue = computed({
    get: () => props.value,
    set: (newVal: number) => emit("update:value", +newVal),
})
</script>
