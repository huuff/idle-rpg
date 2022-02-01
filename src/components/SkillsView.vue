<template>
    <div v-for="skill in Creatures.skills(creature)" class="box" :key="skill.type">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <div class="content">
                        <p class="title has-text-dark mb-4">{{ skill.name }}</p>
                        <p class="subtitle has-text-dark">{{ Skills.describe(skill) }}</p>
                    </div>
                </div>
            </div>
            <div class="level-right">
                <p class="subtitle level-item has-text-dark">Level {{ skill.level }}</p>
            </div>
        </div>
        <progress class="progress is-info" :value="skill.progress" max="1" />
        <proportion-slider v-if="skill.type === 'escape'"
            label="Escape at"
            end-label="Health"
            v-model:value="escapeHealth"
        />
    </div>
</template>

<script setup lang="ts">
import Creatures, { Creature } from '@/creatures/creature';
import Skills from '@/skills/skill';
import { useSettingsStore } from '@/settings-store';
import { storeToRefs } from 'pinia';
import ProportionSlider from './ui/ProportionSlider.vue';

const props = defineProps<{
    creature: Creature;
}>();

const { escapeHealth } = storeToRefs(useSettingsStore());
</script>