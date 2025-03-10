export const SCENE_CONFIG = {
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    position: { x: 0, y: 1.7, z: 0 }
  },
  renderer: {
    antialias: true,
    alpha: true,
    shadowMap: {
      enabled: true,
      type: 'PCFSoftShadowMap'
    },
    toneMapping: 'ACESFilmicToneMapping',
    toneMappingExposure: 1.2
  },
  lights: {
    ambient: {
      color: 0xffffff,
      intensity: 0.7
    },
    directional: {
      color: 0xffffff,
      intensity: 1.5,
      position: { x: 5, y: 10, z: 5 },
      shadow: {
        mapSize: { width: 2048, height: 2048 },
        camera: {
          near: 0.5,
          far: 500,
          left: -100,
          right: 100,
          top: 100,
          bottom: -100
        }
      }
    },
    hemisphere: {
      skyColor: 0xffffff,
      groundColor: 0x444444,
      intensity: 0.6,
      position: { x: 0, y: 20, z: 0 }
    }
  }
} 