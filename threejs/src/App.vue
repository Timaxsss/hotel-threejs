<template>
  <div class="app">
    <SceneContainer />
  </div>
</template>

<script setup>
import SceneContainer from './components/SceneContainer.vue'
</script>

<style>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
