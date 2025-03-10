import * as THREE from 'three'
import { SCENE_CONFIG } from '../config/scene'
import { ControlsManager } from '../utils/controls'

export class BeachScene {
  constructor(container) {
    this.container = container
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x87CEEB)
    
    this.setupCamera()
    this.setupRenderer()
    this.setupControls()
    this.setupLights()
    this.createEnvironment()
    this.setupEventListeners()
    
    this.time = 0
    this.animate()
  }

  setupCamera() {
    const { fov, near, far, position } = SCENE_CONFIG.camera
    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far)
    this.camera.position.set(position.x, position.y, position.z)
  }

  setupRenderer() {
    const { antialias, alpha, shadowMap, toneMapping, toneMappingExposure } = SCENE_CONFIG.renderer
    this.renderer = new THREE.WebGLRenderer({ antialias, alpha })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = shadowMap.enabled
    this.renderer.shadowMap.type = THREE[shadowMap.type]
    this.renderer.toneMapping = THREE[toneMapping]
    this.renderer.toneMappingExposure = toneMappingExposure
    this.container.appendChild(this.renderer.domElement)
  }

  setupControls() {
    this.controls = new ControlsManager(this.camera, document.body)
  }

  setupLights() {
    const { ambient, directional, hemisphere } = SCENE_CONFIG.lights

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(ambient.color, ambient.intensity)
    this.scene.add(ambientLight)

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(directional.color, directional.intensity)
    directionalLight.position.set(directional.position.x, directional.position.y, directional.position.z)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = directional.shadow.mapSize.width
    directionalLight.shadow.mapSize.height = directional.shadow.mapSize.height
    directionalLight.shadow.camera.near = directional.shadow.camera.near
    directionalLight.shadow.camera.far = directional.shadow.camera.far
    directionalLight.shadow.camera.left = directional.shadow.camera.left
    directionalLight.shadow.camera.right = directional.shadow.camera.right
    directionalLight.shadow.camera.top = directional.shadow.camera.top
    directionalLight.shadow.camera.bottom = directional.shadow.camera.bottom
    this.scene.add(directionalLight)

    // Hemisphere Light
    const hemisphereLight = new THREE.HemisphereLight(
      hemisphere.skyColor,
      hemisphere.groundColor,
      hemisphere.intensity
    )
    hemisphereLight.position.set(hemisphere.position.x, hemisphere.position.y, hemisphere.position.z)
    this.scene.add(hemisphereLight)
  }

  createEnvironment() {
    this.createOcean()
    this.createBeach()
    this.createHotel()
    this.createPalmTrees()
    this.createBeachFurniture()
  }

  createOcean() {
    const oceanGeometry = new THREE.PlaneGeometry(100, 100, 50, 50)
    const oceanMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0077be,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      envMapIntensity: 1.0
    })
    this.ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)
    this.ocean.rotation.x = -Math.PI / 2
    this.ocean.position.y = -0.1
    this.ocean.receiveShadow = true
    this.scene.add(this.ocean)
  }

  createBeach() {
    const beachGeometry = new THREE.PlaneGeometry(30, 30, 50, 50)
    const beachMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf4d03f,
      roughness: 0.9,
      metalness: 0.1,
      clearcoat: 0.1,
      clearcoatRoughness: 0.9,
      side: THREE.DoubleSide,
      envMapIntensity: 0.3
    })
    this.beach = new THREE.Mesh(beachGeometry, beachMaterial)
    this.beach.rotation.x = -Math.PI / 2
    this.beach.position.y = 0
    this.beach.receiveShadow = true
    this.scene.add(this.beach)
  }

  createHotel() {
    const hotelGeometry = new THREE.BoxGeometry(10, 6, 8)
    const hotelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.7,
      envMapIntensity: 0.5
    })
    this.hotel = new THREE.Mesh(hotelGeometry, hotelMaterial)
    this.hotel.position.set(0, 3, 0)
    this.hotel.castShadow = true
    this.hotel.receiveShadow = true
    this.scene.add(this.hotel)

    // Door
    const doorGeometry = new THREE.PlaneGeometry(2, 3)
    const doorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8b4513,
      roughness: 0.8,
      metalness: 0.1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.7,
      envMapIntensity: 0.5
    })
    this.door = new THREE.Mesh(doorGeometry, doorMaterial)
    this.door.position.set(0, 1.5, 4)
    this.door.castShadow = true
    this.door.receiveShadow = true
    this.scene.add(this.door)
  }

  createPalmTrees() {
    const createPalmTree = (x, z) => {
      // Trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 16)
      const trunkMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8b4513,
        roughness: 0.9,
        metalness: 0.1,
        clearcoat: 0.3,
        clearcoatRoughness: 0.7,
        envMapIntensity: 0.3
      })
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
      trunk.position.set(x, 2, z)
      trunk.castShadow = true
      trunk.receiveShadow = true
      this.scene.add(trunk)

      // Leaves
      const leavesGeometry = new THREE.ConeGeometry(2, 4, 16)
      const leavesMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x228b22,
        roughness: 0.8,
        metalness: 0.1,
        clearcoat: 0.2,
        clearcoatRoughness: 0.8,
        envMapIntensity: 0.3
      })
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial)
      leaves.position.set(x, 5, z)
      leaves.castShadow = true
      leaves.receiveShadow = true
      this.scene.add(leaves)
    }

    createPalmTree(-8, -5)
    createPalmTree(8, -5)
    createPalmTree(0, -8)
    createPalmTree(-12, -3)
    createPalmTree(12, -3)
  }

  createBeachFurniture() {
    const createBeachChair = (x, z) => {
      // Chair base
      const chairGeometry = new THREE.BoxGeometry(2, 0.1, 0.5)
      const chairMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
      })
      const chair = new THREE.Mesh(chairGeometry, chairMaterial)
      chair.position.set(x, 0.5, z)
      chair.castShadow = true
      chair.receiveShadow = true
      this.scene.add(chair)

      // Chair backrest
      const backrestGeometry = new THREE.BoxGeometry(2, 0.1, 0.5)
      const backrest = new THREE.Mesh(backrestGeometry, chairMaterial)
      backrest.position.set(x, 1, z - 0.5)
      backrest.rotation.x = Math.PI / 4
      backrest.castShadow = true
      backrest.receiveShadow = true
      this.scene.add(backrest)
    }

    const createUmbrella = (x, z) => {
      // Umbrella pole
      const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8)
      const poleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
      })
      const pole = new THREE.Mesh(poleGeometry, poleMaterial)
      pole.position.set(x, 1, z)
      pole.castShadow = true
      pole.receiveShadow = true
      this.scene.add(pole)

      // Umbrella top
      const topGeometry = new THREE.ConeGeometry(1.5, 1, 8)
      const topMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        roughness: 0.5,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
      })
      const top = new THREE.Mesh(topGeometry, topMaterial)
      top.position.set(x, 2, z)
      top.castShadow = true
      top.receiveShadow = true
      this.scene.add(top)
    }

    createBeachChair(-5, -10)
    createBeachChair(5, -10)
    createBeachChair(0, -12)
    createUmbrella(-5, -10)
    createUmbrella(5, -10)
    createUmbrella(0, -12)
  }

  setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.time += 0.01

    // Animate ocean
    this.ocean.position.y = -0.1 + Math.sin(this.time * 2) * 0.1

    // Animate palm trees
    this.scene.children.forEach(child => {
      if (child.geometry instanceof THREE.ConeGeometry) {
        child.rotation.y = Math.sin(this.time + child.position.x) * 0.1
      }
    })

    // Update controls
    this.controls.update(this.time)
    this.controls.checkTransition(this.camera)

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize)
    
    // Dispose of geometries and materials
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose()
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })

    // Dispose of renderer
    this.renderer.dispose()
    
    // Clear scene
    this.scene.clear()
  }
} 