import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { S2Tileset } from '../../core/tiles/S2Tileset';
import type { S2Tile } from '../../core/tiles/S2Tile';
import { Interface } from './ui';

export class Viewer {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private animationFrameId: number | null = null;

  private s2Tileset: S2Tileset | null = null;
  public refSphere: THREE.Mesh | null = null;
  public dirLight: THREE.DirectionalLight | null = null;

  public mouse: THREE.Vector2 = new THREE.Vector2();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  public hoveredTile: S2Tile | null = null;
  public isFocusMode: boolean = true;

  public interface: Interface;

  constructor(container: HTMLElement, baseUrl: string = '/scripts/texture-pipeline/tiles_out') {
    this.container = container;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    // Camera
    const { width, height } = container.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000000000);
    this.camera.position.set(0, 0, 5000000); // 5000 km out
    this.camera.up.set(0, 0, 1); // Z-up for planetary work usually

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;

    // Lights
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05); // Very dim ambient for space contrast
    this.scene.add(ambientLight);

    // Sunlight
    this.dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.dirLight.position.set(100, 10, 50); // Initial Sun position
    this.scene.add(this.dirLight);

    // Reference Sphere (Moon Size)
    // 1737400 radius
    // Reference Sphere (Moon Size)
    // 1737400 radius
    const geo = new THREE.IcosahedronGeometry(1737400, 4);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x444444,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    this.refSphere = new THREE.Mesh(geo, mat);
    this.refSphere.visible = false; // Hidden by default
    this.scene.add(this.refSphere);

    // Resize handler
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    // Initialize Tileset
    // Pointing to the generator output directly
    this.s2Tileset = new S2Tileset(this.scene, this.camera, baseUrl, this.renderer);

    // UI
    this.interface = new Interface(this.s2Tileset, this);
  }

  public start(): void {
    if (!this.animationFrameId) {
      if (this.isFocusMode) {
        this.setFocusMode(true);
      }
      this.animate();
    }
  }

  public setFocusMode(enabled: boolean): void {
    this.isFocusMode = enabled;
    if (enabled) {
      this.controls.target.set(0, 0, 0);
      this.controls.enablePan = false;
    } else {
      this.controls.enablePan = true;
      this.controls.zoomSpeed = 1.0;
      this.controls.minDistance = 0.1;
    }
  }

  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    if (this.isFocusMode) {
      // Force Center
      this.controls.target.set(0, 0, 0);

      // Adaptive Zoom Sensitivity
      const dist = this.camera.position.length();
      const R = 1737400; // Moon Radius

      // Dynamic Height Awareness
      let safetyBuffer = 100; // 100m default
      if (this.hoveredTile) {
        // Add tile max height + 100m buffer
        safetyBuffer = Math.max(100, this.hoveredTile.maxHeight + 100);
      }

      const alt = dist - R;

      // Surface Collision Prevention
      this.controls.minDistance = R + safetyBuffer;

      // Logarithmic Zoom Sensitivity
      // OrbitControls zoomSpeed is a multiplier.
      // We want it to get much slower as we approach the surface.
      // Since target is at center (R distance), we need very small speed to get small steps.
      if (alt < 200000) {
        // Linear fade from 1.0 (at 200km) down to 0.001 (at 0km)
        // This gives approximate constant time to impact perceptual feel?
        // Actually, let's just make it proportional to altitude ratio.
        const ratio = alt / 200000;
        this.controls.zoomSpeed = Math.max(0.001, Math.pow(ratio, 1.5));
      } else {
        this.controls.zoomSpeed = 1.0;
      }
    }

    this.controls.update();

    if (this.s2Tileset) {
      this.s2Tileset.update();
    }

    if (this.interface) {
      this.updateRaycasting();
      this.interface.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    const { width, height } = this.container.getBoundingClientRect();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private updateRaycasting(): void {
    if (!this.s2Tileset) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // We want to intersect with the tileset objects
    // The tileset adds sceneObjects to the scene
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    this.hoveredTile = null;
    if (intersects.length > 0) {
      // Find the first object that has a tile reference
      for (const intersect of intersects) {
        let obj: THREE.Object3D | null = intersect.object;
        while (obj) {
          if (obj.userData.tile) {
            this.hoveredTile = obj.userData.tile;
            return;
          }
          obj = obj.parent;
        }
      }
    }
  }
}
