<template>
<div class="is-flex is-flex-direction-column button-column">
  <slot></slot>
</div>
</template>

<style>
.button-column {
  width: 60%;
  margin: 1rem auto;
}

.button-column button {
  margin-bottom: 0.5rem;
}
</style>
