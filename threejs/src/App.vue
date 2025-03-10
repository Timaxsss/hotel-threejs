<template>
  <div class="app">
    <div id="canvas-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let scene, camera, renderer, controls

const init = () => {
  // Création de la scène
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB) // Couleur du ciel

  // Création de la caméra
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 5, 10)
  camera.lookAt(0, 0, 0)

  // Création du renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  document.getElementById('canvas-container').appendChild(renderer.domElement)

  // Ajout des contrôles
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 5
  controls.maxDistance = 20
  controls.maxPolarAngle = Math.PI / 2

  // Création de l'océan
  const oceanGeometry = new THREE.PlaneGeometry(100, 100)
  const oceanMaterial = new THREE.MeshStandardMaterial({
    color: 0x0077be,
    metalness: 0.3,
    roughness: 0.2,
    side: THREE.DoubleSide
  })
  const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)
  ocean.rotation.x = -Math.PI / 2
  ocean.position.y = -0.1
  ocean.receiveShadow = true
  scene.add(ocean)

  // Création de la plage
  const beachGeometry = new THREE.PlaneGeometry(30, 30)
  const beachMaterial = new THREE.MeshStandardMaterial({
    color: 0xf4d03f,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide
  })
  const beach = new THREE.Mesh(beachGeometry, beachMaterial)
  beach.rotation.x = -Math.PI / 2
  beach.position.y = 0
  beach.receiveShadow = true
  scene.add(beach)

  // Création de l'hôtel
  const hotelGeometry = new THREE.BoxGeometry(5, 3, 4)
  const hotelMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.1
  })
  const hotel = new THREE.Mesh(hotelGeometry, hotelMaterial)
  hotel.position.set(0, 1.5, 0)
  hotel.castShadow = true
  hotel.receiveShadow = true
  scene.add(hotel)

  // Création des palmiers
  const createPalmTree = (x, z) => {
    // Tronc
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3, 8)
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunk.position.set(x, 1.5, z)
    trunk.castShadow = true
    trunk.receiveShadow = true
    scene.add(trunk)

    // Feuilles
    const leavesGeometry = new THREE.ConeGeometry(1.5, 3, 8)
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 })
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial)
    leaves.position.set(x, 4, z)
    leaves.castShadow = true
    leaves.receiveShadow = true
    scene.add(leaves)
  }

  // Ajout de plusieurs palmiers
  createPalmTree(-5, -3)
  createPalmTree(5, -3)
  createPalmTree(0, -5)

  // Ajout de la lumière
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  // Animation
  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Gestion du redimensionnement
  window.addEventListener('resize', onWindowResize, false)
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  init()
})
</script>

<style>
.app {
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
</style>
