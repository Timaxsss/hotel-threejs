import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

export class ControlsManager {
  constructor(camera, domElement) {
    this.controls = new PointerLockControls(camera, domElement)
    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    this.velocity = new THREE.Vector3()
    this.direction = new THREE.Vector3()
    this.isInsideHotel = true

    this.setupEventListeners()
  }

  setupEventListeners() {
    document.addEventListener('click', () => this.controls.lock())
    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onKeyDown(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = true
        break
      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = true
        break
      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = true
        break
      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = true
        break
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = false
        break
      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = false
        break
      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = false
        break
      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = false
        break
    }
  }

  update(time) {
    if (this.controls.isLocked) {
      this.velocity.x -= this.velocity.x * 10.0 * 0.016
      this.velocity.z -= this.velocity.z * 10.0 * 0.016

      this.direction.z = Number(this.moveForward) - Number(this.moveBackward)
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft)
      this.direction.normalize()

      if (this.moveForward || this.moveBackward) {
        this.velocity.z -= this.direction.z * 400.0 * 0.016
      }
      if (this.moveLeft || this.moveRight) {
        this.velocity.x -= this.direction.x * 400.0 * 0.016
      }

      this.controls.moveRight(-this.velocity.x * 0.016)
      this.controls.moveForward(-this.velocity.z * 0.016)
    }

    this.controls.update()
  }

  checkTransition(camera) {
    if (this.isInsideHotel && camera.position.z > 2) {
      this.isInsideHotel = false
      camera.position.set(0, 1.7, 3)
      camera.rotation.y = Math.PI
    }
  }
} 