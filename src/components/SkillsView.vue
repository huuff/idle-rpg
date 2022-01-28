<template>
<div v-for="skill in creature.skills"
     class="box"
     :key="skill.type"
>
    <div class="level">
        <div class="level-left">
            <div class="level-item">
                <div class="content">
                    <p class="title has-text-dark mb-4"> {{ skill.name }}</p>
                    <p class="subtitle has-text-dark"> {{ describeSkill(skill) }} </p>
                </div>
            </div>
        </div>
        <div class="level-right">
            <p class="subtitle level-item has-text-dark"> Level {{ skill.level }}</p>
        </div>
    </div>
    <progress class="progress is-info" :value="skill.progress" max="1" />
</div>
</template>

<script setup lang="ts">
import { Creature } from '@/creatures/creature';
import { describeSkill } from '@/skills/skill';

const props = defineProps<{
    creature: Creature;
}>();
</script>