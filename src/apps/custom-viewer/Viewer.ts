import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { S2Tileset } from '../../core/tiles/S2Tileset';
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

  public interface: Interface;

  constructor(container: HTMLElement, baseUrl: string = '/scripts/texture-pipeline/tiles_out') {
    this.container = container;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    // Camera
    const { width, height } = container.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100000000);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(1, 1, 1);
    this.scene.add(dirLight);

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

    // Initialize Tileset
    // Pointing to the generator output directly
    this.s2Tileset = new S2Tileset(this.scene, this.camera, baseUrl, this.renderer);

    // UI
    this.interface = new Interface(this.s2Tileset, this);
  }

  public start(): void {
    if (!this.animationFrameId) {
      this.animate();
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

    this.controls.update();

    if (this.s2Tileset) {
      this.s2Tileset.update();
    }

    if (this.interface) {
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
}
