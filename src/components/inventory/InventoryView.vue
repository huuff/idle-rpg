<template>
    <div class="tabs">
        <ul>
            <li
                v-for="filter in filters"
                :key="filter"
                :class="{ 'is-active': currentFilter === filter }"
            ><a @click="currentFilter = filter"
            >{{ capitalize(filter) }}</a></li>
        </ul>
    </div>
    <div>
        <table class="table is-fullwidth is-hoverable is-unselectable">
            <thead>
                <th>Name</th>
                <th>Amount</th>
                <th>Value</th>
                <th>Weight</th>
                <template v-if="currentFilter === 'equipment'">
                    <th>Max Health</th>
                    <th>Strength</th>
                    <th>Agility</th>
                </template>
                <slot name="extraHeaders"></slot>
            </thead>
            <tbody>
                <tr
                    v-for="item in filtered"
                    :key="item.name"
                    :class="{
                         'is-selected': item.type === 'equipment' && item.isEquipped,
                         'is-clickable': !isClickable || isClickable(item)
                    }"
                    @click="emit('clickItem', item.name)"
                >
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.avgValue }}</td>
                    <td>{{ item.weight }}</td>
                    <template v-if="
                        currentFilter === 'equipment'
                        && item.type === 'equipment'
                        ">
                        <td>{{ item.stats?.maxHealth }}</td>
                        <td>{{ item.stats?.strength }}</td>
                        <td>{{ item.stats?.agility }}</td>
                    </template>
                    <slot name="extraCells" :item="item"></slot>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from "vue";
import { Item } from "@/items/item";
import { InventoryItem } from "@/items/inventory";
import { Inventory } from "@/items/inventory";
import { capitalize } from "lodash";

const props = defineProps<{
    inventory: Inventory;
    isClickable?: (item: InventoryItem) => boolean;
}>();

const emit = defineEmits<{
    (event: "clickItem", itemName: string): void;
}>();

type Filter = "all" | Item["type"];

const filters: Filter[] = ["all", "stuff", "equipment"];

const currentFilter: Ref<Filter> = ref("all");

const filtered = computed(() => {
    if (currentFilter.value === "all") {
        return Object.values(props.inventory);
    } else {
        return Object.values(props.inventory).filter(i => i.type === currentFilter.value);
    }
})

</script>