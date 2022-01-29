<template>
    <div v-for="skill in creature.skills" class="box" :key="skill.type">
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
        <div v-if="skill.type === 'escape'">
            <p>Escape at:</p>
            <div class="is-flex flex-direction-row">
                <input
                    v-model="escapeHealth"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    class="mr-2"
                />
                <span>{{ Math.round(escapeHealth * 100) }}% Health</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Creature } from '@/creatures/creature';
import Skills from '@/skills/skill';
import { useSettingsStore } from '@/settings-store';
import { storeToRefs } from 'pinia';

const props = defineProps<{
    creature: Creature;
}>();

const { escapeHealth } = storeToRefs(useSettingsStore());
</script>