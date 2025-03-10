<template>
  <div class="scene-container">
    <div id="canvas-container"></div>
    <div class="controls-hint">
      <div class="hint">Click to start</div>
      <div class="hint">Use mouse to look around</div>
      <div class="hint">WASD to move</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { BeachScene } from '../scenes/BeachScene'

const scene = ref(null)

onMounted(() => {
  const container = document.getElementById('canvas-container')
  scene.value = new BeachScene(container)
})

onBeforeUnmount(() => {
  if (scene.value) {
    scene.value.dispose()
  }
})
</script>

<style scoped>
.scene-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.controls-hint {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  z-index: 2;
}

.hint {
  margin: 5px 0;
}
</style> 