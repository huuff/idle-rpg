<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content wide-modal">
      <div class="box">
        <p class="title has-text-dark">Choose a class</p>
        <div class="columns">
          <div class="column" v-for="jobClass in classes" :key="jobClass.name">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">{{ jobClass.name }}</p>
              </header>
              <div class="card-content">
                <div class="content">
                  <p class="has-text-centered">{{ jobClass.description }}</p>
                  <div>
                    <p class="has-text-weight-semibold">Equipment</p>
                    <ul>
                      <li
                        v-for="equipment in jobClass.baseEquipment ?? []"
                        :key="equipment.name"
                      >{{ equipment.name }}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <a class="card-footer-item" @click="createPlayer(jobClass)">Choose</a>
              </footer>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label py-2">
            <label class="label is-normal">Name:</label>
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
import { basicSpecies } from "@/creatures/basic-species";
import Creatures, { PLAYER_ID } from "@/creatures/creature";

const playerName = ref("Player");

const props = withDefaults(defineProps<{
  classes?: JobClass[];
}>(), {
  classes: () => Object.values(baseClasses),
});

function createPlayer(jobClass: JobClass): void {
  Creatures.birth({
    id: PLAYER_ID,
    jobClass,
    name: playerName.value,
    species: basicSpecies.human,
  });
}

</script>

<style scoped>
@media only screen and (max-width: 1000px) {
  .wide-modal {
    width: 100%;
  }
}
@media only screen and (min-width: 1000px) {
  .wide-modal {
    width: 65%;
  }
}
</style>
