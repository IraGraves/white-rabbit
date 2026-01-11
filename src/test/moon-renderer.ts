import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TilesRenderer } from '3d-tiles-renderer';

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  10,
  10000000
);
camera.position.set(0, 0, 4000000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container')?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
sunLight.position.set(1, 1, 1);
scene.add(sunLight);

// --- 3D Tiles Setup ---
const basePath = import.meta.env.BASE_URL || '/';
const safeBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
const tilesetUrl = `${safeBasePath}assets/textures/LOD/moon/tileset.json`;

console.warn('🌕 [TEST] Loading Tileset:', tilesetUrl);

const tilesRenderer = new TilesRenderer(tilesetUrl);
tilesRenderer.setCamera(camera);
tilesRenderer.setResolutionFromRenderer(camera, renderer);

// Draco Configuration
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(`${safeBasePath}draco/gltf/`);

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Register handlers for B3DM loading
// @ts-ignore
tilesRenderer.manager.addHandler(/\.gltf$/, gltfLoader);
// @ts-ignore
tilesRenderer.manager.addHandler(/\.glb$/, gltfLoader);
// @ts-ignore
tilesRenderer.manager.addHandler(/\.b3dm$/, gltfLoader);

// Properties for forced visibility
tilesRenderer.errorTarget = 1.0;
tilesRenderer.group.frustumCulled = false;
// @ts-ignore
tilesRenderer.displayActiveTiles = true; // Built-in box visualizer

// SCALE UP: The tileset root is unit-sized (radius ~1.0-1.5),
// so we scale it by the Moon's radius to match meters.
tilesRenderer.group.scale.setScalar(1737100);

scene.add(tilesRenderer.group);

// --- Reference Sphere ---
const refGeo = new THREE.SphereGeometry(1737100, 32, 32);
const refMat = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
  transparent: true,
  opacity: 0.3,
});
const refMesh = new THREE.Mesh(refGeo, refMat);
scene.add(refMesh);

console.warn('🌕 [TEST] Added 1737km reference sphere (green)');

// Hooks for Debugging
const statsElement = document.getElementById('stats');
// @ts-ignore
tilesRenderer.onLoadTileSet = (tileset) => {
  console.warn('🌕 [TEST] Tileset LOADED:', tileset);
  const root = tilesRenderer.root;
  if (root) {
    console.warn('🌕 [TEST] Root Tile Bounding Volume:', JSON.stringify(root.boundingVolume));
    console.warn('🌕 [TEST] Tileset Geometric Error:', tileset.geometricError);

    // RECURSIVE SCALE FIX:
    // The geometric errors in the tileset are likely for the unit-sized model (e.g. error = 1.0).
    // Since we scaled the group by 1.7M, we must scale the geometric error by 1.7M too,
    // otherwise the renderer thinks the tiles are mathematically "perfect enough" efficiently
    // instantly and refuses to refine them.
    const stack = [root];
    while (stack.length > 0) {
      const t = stack.pop();
      if (t.geometricError > 0) {
        t.geometricError *= 1737100;
      }
      if (t.children) stack.push(...t.children);
    }

    // Force visibility
    Object.defineProperty(root, '__inFrustum', {
      get: () => true,
      set: () => {},
      configurable: true,
    });
    Object.defineProperty(root, '__visible', {
      get: () => true,
      set: () => {},
      configurable: true,
    });
    Object.defineProperty(root, '__active', { get: () => true, set: () => {}, configurable: true });
    // @ts-ignore
    root.geometricError = 1e12; // Massive error to force children? No wait, small error stops traversal. Large error continues?
    // ERROR LOGIC: Error / Distance. If result > target (1.0), we refine.
    // So LARGE geometricError (1e12) / Distance (4e6) = 250,000 > 1.0 -> REFINE!
    // So 1e12 is correct.

    console.warn('🌕 [TEST] ROOT DETAILS:', {
      refine: root.refine, // ADD or REPLACE
      content: root.content,
      children: root.children ? root.children.length : 0,
      extras: root.extras,
    });
  }
};

// @ts-ignore
tilesRenderer.onLoadModel = (model, tile) => {
  console.warn('🌕 [TEST] Model LOADED for tile:', tile);
  model.traverse((c: any) => {
    if (c.isMesh) {
      c.frustumCulled = false;
      // Force bright material
      c.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        depthTest: false,
        depthWrite: false,
      });
    }
  });
};

// @ts-ignore
tilesRenderer.onError = (err) => console.error('🌕 [TEST] Error:', err);

// --- Debug Helpers ---
const axesHelper = new THREE.AxesHelper(3000000);
scene.add(axesHelper);

// Simple Red Test Cube (1000km wide) to verify depth buffer/scale
const boxGeo = new THREE.BoxGeometry(1000000, 1000000, 1000000);
const boxMat = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
  transparent: true,
  opacity: 0.5,
});
const debugBox = new THREE.Mesh(boxGeo, boxMat);
scene.add(debugBox);
console.warn('🌕 [TEST] Added 1000km Red Test Cube at Origin');

// --- Periodic Diagnostics ---
setInterval(() => {
  const root = tilesRenderer.root;

  // FORCE PATCH: Ensure error is scaled even if onLoadTileSet missed it
  // FORCE PATCH: Ensure error is scaled even if onLoadTileSet missed it
  // We need to traverse ALL loaded tiles, not just root and immediate children.
  if (root) {
    const stack = [root];
    while (stack.length > 0) {
      const t = stack.pop();

      // Scale if it looks unscaled (< 1000) AND has a valid error
      // Note: Some tiles might have 0 error (leafs), we skip those.
      // We check < 5000 just to be safe (root is 3.45, children might be smaller)
      if (t.geometricError !== undefined && t.geometricError > 0 && t.geometricError < 5000) {
        // console.warn('🌕 [TEST] Patching tile error at depth ???', t.geometricError);
        t.geometricError *= 1737100;
      }

      // Continue traversal
      if (t.children && t.children.length > 0) {
        for (const child of t.children) {
          stack.push(child);
        }
      }
    }
  }

  // LOG DETAILS (Moved here because onLoadTileSet might have been missed)
  // LOG DETAILS: Search for first content
  if (root) {
    let depth = 0;
    let curr = root;
    while (curr && !curr.content && curr.children && curr.children.length > 0) {
      curr = curr.children[0];
      depth++;
    }

    console.warn('🌕 [TEST] FIRST CONTENT SEARCH:', {
      depthFound: depth,
      hasContent: !!(curr && curr.content),
      // @ts-ignore
      contentUri: curr ? (curr.content ? curr.content.uri : 'N/A') : 'N/A',
      geometricError: curr ? curr.geometricError : 'N/A',
      isLeaf: !curr.children || curr.children.length === 0,
    });
  }

  const statsInfo = {
    activeTiles: tilesRenderer.activeTiles.size,
    visibleTiles: tilesRenderer.visibleTiles.size,
    loadingState: (tilesRenderer as any).__loadingState, // 0: Loaded, 1: Loading, 2: Parsing
    cameraPos: camera.position.toArray().map((v) => Math.round(v)),
    groupScale: tilesRenderer.group.scale.toArray(),
    frustumCulled: tilesRenderer.group.frustumCulled,
    rootGeometricError: root ? root.geometricError : 'N/A',
    rootBox: root ? (root.boundingVolume ? root.boundingVolume : 'No Vol') : 'No Root',
  };

  console.warn('🌕 [TEST-STATS]', JSON.stringify(statsInfo, null, 2));
}, 3000);

// Adjust Camera
camera.far = 100000000; // 100 Million meters
camera.near = 1000; // 1 km
camera.updateProjectionMatrix();

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  tilesRenderer.update();

  // Update Stats
  if (statsElement) {
    // @ts-ignore
    const activeCount = tilesRenderer.activeTiles?.size ?? 0;
    // @ts-ignore
    const visibleCount = tilesRenderer.visibleTiles?.size ?? 0;
    statsElement.innerText = `
            Active Tiles: ${activeCount}
            Visible Tiles: ${visibleCount}
            Camera Dist: ${camera.position.length().toFixed(0)}
            Root Loaded: ${!!tilesRenderer.root}
        `;
  }

  renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  tilesRenderer.setResolutionFromRenderer(camera, renderer);
});
