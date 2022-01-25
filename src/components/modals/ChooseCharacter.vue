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
              <a class="card-footer-item"
                @click="createPlayer(jobClass)"
                >Choose</a>
            </footer>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label py-2">
          <label class="label is-normal">Name: </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded">
              <input class="input" type="text" v-model="playerName" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { JobClass } from "@/creatures/job-class";
import { baseClasses } from "@/creatures/base-classes";
import { useMainStore } from "@/store";
import { storeToRefs } from "pinia";
import { CreatureImpl } from "@/creatures/creature";
import { basicSpecies } from "@/creatures/basic-species";

const { player } = storeToRefs(useMainStore());
const playerName = ref("Player");

const props = withDefaults(defineProps<{
  classes?: JobClass[];
}>(), {
  classes: () => Object.values(baseClasses),
});

function createPlayer(jobClass: JobClass): void {
  player.value = new CreatureImpl({
    jobClass,
    name: playerName.value,
    species: basicSpecies["Human"],
  });
}

</script>
