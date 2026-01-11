import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TilesRenderer } from '3d-tiles-renderer';
// @ts-ignore
import { QuantizedMeshPlugin } from '3d-tiles-renderer/src/three/plugins/QuantizedMeshPlugin.js';

console.warn('✅ TEST SCRIPT STARTED (vSanitized)');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(10, 2, 0); 
scene.add(dirLight);

const MOON_RADIUS = 1737100;
const EARTH_RADIUS = 6378137;

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1000,
  100000000
);
camera.position.set(0, 0, 10000000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container')?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axes = new THREE.AxesHelper(MOON_RADIUS * 1.5);
scene.add(axes);

// --- Static Tileset ---
const basePath = import.meta.env.BASE_URL || '/';
const tilesetUrl = `${basePath}moon-tileset.json`;

const tilesRenderer = new TilesRenderer(tilesetUrl);
tilesRenderer.setCamera(camera);
tilesRenderer.setResolutionFromRenderer(camera, renderer);
tilesRenderer.lruCache.minSize = 2500;
tilesRenderer.lruCache.maxSize = 3500;
tilesRenderer.errorTarget = 6; 

tilesRenderer.onDownloadError = (err) => {
    console.warn('⚠️ Download Error handled:', err);
};

const plugin = new QuantizedMeshPlugin();
tilesRenderer.registerPlugin(plugin);

if ((plugin as any).loader) {
    const loader = (plugin as any).loader;
    loader.ellipsoid = {
        radius: new THREE.Vector3(MOON_RADIUS, MOON_RADIUS, MOON_RADIUS),
        getCartographicToPosition: function(lat: number, lon: number, height: number, target: THREE.Vector3) {
            const r = MOON_RADIUS + height;
            target.set(
                r * Math.cos(lat) * Math.cos(lon), 
                r * Math.cos(lat) * Math.sin(lon), 
                r * Math.sin(lat)
            );
            return target;
        }
    };
}

const texLoader = new THREE.TextureLoader();

function getTileId(uri: string) {
    const match = uri.match(/\/(\d+)\/(\d+)\/(\d+)\.terrain/);
    if (!match) return 'UNKNOWN';
    return `L${match[1]}-X${match[2]}-Y${match[3]}`;
}

// Helper to scrub NaNs before they crash Three.js
function cleanGeometry(geom: THREE.BufferGeometry) {
    const pos = geom.attributes.position;
    if (!pos) return;
    
    const arr = pos.array;
    let fixed = 0;
    
    for (let i = 0; i < arr.length; i++) {
        if (Number.isNaN(arr[i] as number)) {
            arr[i] = 0; 
            fixed++;
        }
    }
    
    if (fixed > 0) {
        console.warn(`🧹 Sanitized ${fixed} NaNs in tile.`);
        pos.needsUpdate = true;
        geom.computeBoundingSphere(); 
    }
}

function analyzeGeometry(geom: THREE.BufferGeometry, id: string) {
    const pos = geom.attributes.position;
    if (!pos) return;
    
    let minR = Infinity;
    let maxR = -Infinity;
    const vertexCount = pos.count;

    const v = new THREE.Vector3();
    for (let i = 0; i < vertexCount; i++) {
        v.fromBufferAttribute(pos, i);
        const r = v.length();
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
    }

    const delta = maxR - minR;
    const isEarthScale = minR > 5000000;
    const scaleLabel = isEarthScale ? 'EARTH' : 'MOON';
    
    console.warn(`📊 TILE [${id}]: Verts=${vertexCount}, Range=${minR.toFixed(0)}->${maxR.toFixed(0)} (Δ${delta.toFixed(0)}m) [${scaleLabel}]`);
}

function applyTexture(mesh: THREE.Mesh, uri: string) {
    const match = uri.match(/\/(\d+)\/(\d+)\/(\d+)\.terrain/);
    if (!match) return;

    let [, zStr, xStr, yStr] = match;
    let z = parseInt(zStr);
    let x = parseInt(xStr);
    let y = parseInt(yStr);

    const imgZ = z + 1;
    const textureUrl = `/assets/textures/LOD/moon/imagery/${imgZ}/${x}/${y}.png`;

    if (mesh.userData.textureUrl === textureUrl) return;
    mesh.userData.textureUrl = textureUrl;

    texLoader.load(textureUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        mesh.material = new THREE.MeshStandardMaterial({
            map: tex, roughness: 1.0, metalness: 0.0, side: THREE.DoubleSide
        });
    }, undefined, () => {
        (mesh.material as THREE.MeshStandardMaterial).color.setHex(0xaaaaaa);
    });
}

function patchGeometry(geom: THREE.BufferGeometry) {
  // If we don't have bounding sphere, compute it (safe now due to cleanGeometry)
  if (!geom.boundingSphere) geom.computeBoundingSphere();
  if (!geom.boundingSphere) return; 

  const center = geom.boundingSphere.center;
  const posAttr = geom.attributes.position;
  if (!posAttr || posAttr.count === 0) return;

  const isEarthScale = center.length() > 5000000;
  
  if (isEarthScale) {
      const vec = new THREE.Vector3();
      
      for (let i = 0; i < posAttr.count; i++) {
          vec.fromBufferAttribute(posAttr, i);
          const len = vec.length();
          
          if (len < 10000) continue; 

          let h = len - EARTH_RADIUS; 
          
          // --- HEIGHT EXAGGERATION (5x) ---
          h = h * 5.0; 
          
          const newLen = MOON_RADIUS + h;
          
          const ratio = newLen / len;
          vec.multiplyScalar(ratio);
          
          if (Number.isNaN(vec.x)) continue;

          posAttr.setXYZ(i, vec.x, vec.y, vec.z);
      }
      
      posAttr.needsUpdate = true;
      geom.computeVertexNormals();
      geom.computeBoundingSphere();
  } 
}

// Polling Loop
function scanAndPatchTiles() {
    tilesRenderer.visibleTiles.forEach((tile: any) => {
        const scene = tile.cached.scene;
        if (scene) {
            const uri = tile.content ? tile.content.uri : '';
            const id = uri ? getTileId(uri) : 'ROOT';

            scene.traverse((obj: any) => {
                if (obj.isMesh) {
                    if (obj.userData.processed) return;
                    
                    // 1. Sanitize (CRITICAL FIX)
                    cleanGeometry(obj.geometry);

                    // 2. Analyze
                    analyzeGeometry(obj.geometry, id);

                    // 3. Patch
                    patchGeometry(obj.geometry);

                    // 4. Texture
                    if (uri) applyTexture(obj, uri);

                    // 5. Wireframe (RED)
                    const wiregeo = new THREE.WireframeGeometry(obj.geometry);
                    const wire = new THREE.LineSegments(wiregeo, new THREE.LineBasicMaterial({
                        color: 0xff0000, 
                        transparent: true,
                        opacity: 0.5,
                        depthTest: false 
                    }));
                    obj.add(wire);

                    obj.userData.processed = true;
                }
            });
        }
    });
}

scene.add(tilesRenderer.group);

let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  tilesRenderer.update();
  scanAndPatchTiles();
  renderer.render(scene, camera);
  
  frame++;
  if (frame % 60 === 0) {
      const stats = tilesRenderer.stats;
      console.log(`STATS: D=${stats.downloading} P=${stats.parsing} V=${stats.visible}`);
  }
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  tilesRenderer.setResolutionFromRenderer(camera, renderer);
});
