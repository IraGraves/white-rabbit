import * as THREE from 'three';
import { Logger } from '../utils/logger';

/**
 * @class CompositionManager
 * @description Manages the multi-layer rendering pipeline (Background, World, Foreground).
 *
 * Architecture:
 * - Layer 1: Background (Stars/Skybox) - Rendered FIRST, No Depth Write, Rotation Locked.
 * - Layer 2: World (Planets/Moons) - Rendered SECOND, Clear Depth, Logarithmic Depth.
 * - Layer 3: Foreground (Cockpit/Probes/UI) - Rendered LAST, Clear Depth, Linear Depth (simulated via tight near/far).
 */
export class CompositionManager {
  renderer: THREE.WebGLRenderer;
  worldCamera: THREE.PerspectiveCamera;

  // Scenes
  backgroundScene: THREE.Scene;
  worldScene: THREE.Scene;
  foregroundScene: THREE.Scene;

  // Cameras
  backgroundCamera: THREE.PerspectiveCamera;
  foregroundCamera: THREE.PerspectiveCamera;

  constructor(renderer: THREE.WebGLRenderer, worldCamera: THREE.PerspectiveCamera) {
    this.renderer = renderer;
    this.worldCamera = worldCamera;

    // 1. Background Layer
    this.backgroundScene = new THREE.Scene();
    this.backgroundCamera = worldCamera.clone();
    this.backgroundCamera.near = 1e-7; // Keep consistent with world for stars?
    this.backgroundCamera.far = 1e12; // Far enough for stars

    // 2. World Layer (We will assign the existing scene to this later or use this one)
    this.worldScene = new THREE.Scene();

    // 3. Foreground Layer
    this.foregroundScene = new THREE.Scene();
    this.foregroundCamera = worldCamera.clone();
    // Optimization for precision close up, but ensure enough depth for mission rendering
    this.foregroundCamera.near = 1e-10; // 30cm - Sufficient for 4m probe
    this.foregroundCamera.far = 1e6; // Increased from 1000 to prevent premature clipping

    // Disable auto-clear to allow manual composition
    this.renderer.autoClear = false;

    Logger.log('CompositionManager initialized');
  }

  /**
   * Syncs internal cameras with the main World camera.
   */
  updateCameras() {
    // 1. Background Camera: Matches Rotation, Position locked at 0,0,0
    this.backgroundCamera.quaternion.copy(this.worldCamera.quaternion);
    this.backgroundCamera.aspect = this.worldCamera.aspect;
    this.backgroundCamera.updateProjectionMatrix();
    this.backgroundCamera.position.set(0, 0, 0);

    // 2. Foreground Camera: Fully synced but locked to origin
    // Probes are positioned relative to the camera (ProbePos - CameraWorldPos)
    this.foregroundCamera.position.set(0, 0, 0);
    this.foregroundCamera.quaternion.copy(this.worldCamera.quaternion);
    this.foregroundCamera.aspect = this.worldCamera.aspect;
    this.foregroundCamera.updateProjectionMatrix();
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height);
    const aspect = width / height;

    this.worldCamera.aspect = aspect;
    this.worldCamera.updateProjectionMatrix();

    this.backgroundCamera.aspect = aspect;
    this.backgroundCamera.updateProjectionMatrix();

    this.foregroundCamera.aspect = aspect;
    this.foregroundCamera.updateProjectionMatrix();
  }

  /**
   * Main render loop.
   */
  render() {
    this.updateCameras();

    // 1. Clear Screen
    this.renderer.clear();

    // 2. Render Background
    // We want no depth write ideally, but since we render first, just standard render works.
    // Ensure background objects don't write generic deep depth?
    // Usually stars have depthWrite: false.
    this.renderer.render(this.backgroundScene, this.backgroundCamera);

    // 3. Render World
    this.renderer.clearDepth();
    this.renderer.render(this.worldScene, this.worldCamera);

    // 4. Render Foreground
    this.renderer.clearDepth();
    this.renderer.render(this.foregroundScene, this.foregroundCamera);
  }
}
