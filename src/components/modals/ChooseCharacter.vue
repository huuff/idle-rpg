<template>
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-content">
    <div class="box">
      <p class="title has-text-dark">
        Choose a class
      </p>
      <div class="columns">
        <div class="column"
          v-for="jobClass in classes"
          :key="jobClass.name"
        >
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">
                {{ jobClass.name }}
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                Class description
              </div>
            </div>
            <footer class="card-footer">
              <a @click="createPlayer(jobClass)">Choose</a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { JobClass } from "@/creatures/job-class";
import { baseClasses } from "@/creatures/base-classes";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import { createCreature, human } from "@/creatures/species";

const { player } = storeToRefs(useMainStore());

const props = withDefaults(defineProps<{
  classes?: JobClass[];
}>(), {
  classes: () => baseClasses,
});

function createPlayer(jobClass: JobClass): void {
  player.value = createCreature(human, 1, jobClass);
}

</script>
