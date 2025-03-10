<template>
  <div class="app">
    <div id="canvas-container"></div>
    <div class="controls-hint">
      <div class="hint">Cliquez pour commencer</div>
      <div class="hint">Utilisez la souris pour regarder autour de vous</div>
      <div class="hint">WASD pour vous déplacer</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

let scene, camera, renderer, controls
let time = 0
let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let velocity = new THREE.Vector3()
let direction = new THREE.Vector3()
let isInsideHotel = true

const init = () => {
  // Création de la scène
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB) // Couleur du ciel

  // Création de la caméra
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 1.7, 0) // Hauteur des yeux

  // Création du renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  document.getElementById('canvas-container').appendChild(renderer.domElement)

  // Ajout des contrôles
  controls = new PointerLockControls(camera, document.body)
  controls.connect()

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
  const hotelGeometry = new THREE.BoxGeometry(10, 6, 8)
  const hotelMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.1
  })
  const hotel = new THREE.Mesh(hotelGeometry, hotelMaterial)
  hotel.position.set(0, 3, 0)
  hotel.castShadow = true
  hotel.receiveShadow = true
  scene.add(hotel)

  // Création de la porte
  const doorGeometry = new THREE.PlaneGeometry(2, 3)
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.8,
    metalness: 0.1
  })
  const door = new THREE.Mesh(doorGeometry, doorMaterial)
  door.position.set(0, 1.5, 4)
  door.castShadow = true
  door.receiveShadow = true
  scene.add(door)

  // Création des palmiers
  const createPalmTree = (x, z) => {
    // Tronc
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 8)
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunk.position.set(x, 2, z)
    trunk.castShadow = true
    trunk.receiveShadow = true
    scene.add(trunk)

    // Feuilles
    const leavesGeometry = new THREE.ConeGeometry(2, 4, 8)
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 })
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial)
    leaves.position.set(x, 5, z)
    leaves.castShadow = true
    leaves.receiveShadow = true
    scene.add(leaves)
  }

  // Ajout de plusieurs palmiers
  createPalmTree(-8, -5)
  createPalmTree(8, -5)
  createPalmTree(0, -8)
  createPalmTree(-12, -3)
  createPalmTree(12, -3)

  // Ajout de la lumière
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500
  directionalLight.shadow.camera.left = -100
  directionalLight.shadow.camera.right = 100
  directionalLight.shadow.camera.top = 100
  directionalLight.shadow.camera.bottom = -100
  scene.add(directionalLight)

  // Gestion des événements clavier
  document.addEventListener('click', function() {
    controls.lock()
  })

  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)

  // Animation
  const animate = () => {
    requestAnimationFrame(animate)
    time += 0.01

    // Animation des palmiers
    scene.children.forEach(child => {
      if (child.geometry instanceof THREE.ConeGeometry) {
        child.rotation.y = Math.sin(time + child.position.x) * 0.1
      }
    })

    // Gestion du mouvement
    if (controls.isLocked) {
      velocity.x -= velocity.x * 10.0 * 0.016
      velocity.z -= velocity.z * 10.0 * 0.016

      direction.z = Number(moveForward) - Number(moveBackward)
      direction.x = Number(moveRight) - Number(moveLeft)
      direction.normalize()

      if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * 0.016
      if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * 0.016

      controls.moveRight(-velocity.x * 0.016)
      controls.moveForward(-velocity.z * 0.016)

      // Vérification de la position pour la transition
      if (isInsideHotel && camera.position.z > 2) {
        isInsideHotel = false
        // Transition vers l'extérieur
        camera.position.set(0, 1.7, 3)
        camera.rotation.y = Math.PI
      }
    }

    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Gestion du redimensionnement
  window.addEventListener('resize', onWindowResize, false)
}

const onKeyDown = (event) => {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = true
      break
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true
      break
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true
      break
    case 'ArrowRight':
    case 'KeyD':
      moveRight = true
      break
  }
}

const onKeyUp = (event) => {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = false
      break
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false
      break
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false
      break
    case 'ArrowRight':
    case 'KeyD':
      moveRight = false
      break
  }
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
