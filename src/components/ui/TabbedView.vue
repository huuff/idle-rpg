<template>
<div class="tabs">
  <ul>
    <li v-for="tab in tabs"
        :key="tab"
        :class="{ 'is-active': tab === currentTab }"
    ><a @click="currentTab = tab">{{ tab }}</a></li>
  </ul>
</div>

<component :is="currentComponent" v-bind="componentProps"/>
</template>

<script setup lang="ts">
import { Component, ref, computed } from "vue";

const props = defineProps<{
  tabs: { [s: string]: string };
  tabToComponent: { [s: string]: Component};
  componentProps?: { [s: string]: any };
}>();

const currentTab = ref(props.tabs[Object.keys(props.tabs)[0]]);

const currentComponent = computed(() => {
  return props.tabToComponent[currentTab.value];
});
</script>
