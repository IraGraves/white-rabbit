import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

import { S2Tile, TILE_STATE } from './S2Tile';
import { TileFrame } from './TileFrame';
import { RequestScheduler } from './RequestScheduler';

export class S2Tileset {
  public rootTiles: S2Tile[] = [];
  public baseUrl: string;
  public scene: THREE.Scene;
  public camera: THREE.Camera;

  public scheduler: RequestScheduler;

  // Loaders
  private gltfLoader: GLTFLoader;

  // Config
  public maxScreenSpaceError: number = 16;

  // Stats
  public stats = {
    loaded: 0,
    visible: 0,
    refined: 0, // Hidden parents
    memory: 0,
    culledHorizon: 0,
    culledFrustum: 0,
    culledSSE: 0, // Leaf by error
  };

  // Optimization: Reusable objects
  private frustum: THREE.Frustum = new THREE.Frustum();
  private guardFrustum: THREE.Frustum = new THREE.Frustum(); // Slightly larger for pre-fetching
  private projScreenMatrix: THREE.Matrix4 = new THREE.Matrix4();

  public debug = {
    showBoundingBoxes: false,
    wireframe: false,
    globalContentScale: 1.0,
    colorByLevel: false,
  };

  public persistence = {
    priorityLoadLevel: 0,
    cancellationThreshold: 0,
    unloadThreshold: 2,
  };

  public performance = {
    maxActiveDownloads: 6,
    maxCacheSize: 300, // Lowered from 1000 to prevent OOM
    unloadTimeFrames: 1000, // ~16 seconds @ 60fps
    guardFrustumRatio: 1.2, // 20% wider than screen
  };

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    baseUrl: string,
    renderer: THREE.WebGLRenderer
  ) {
    this.scene = scene;
    this.camera = camera;
    this.baseUrl = baseUrl;

    this.scheduler = new RequestScheduler();

    // Setup Loaders
    this.gltfLoader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.gltfLoader.setDRACOLoader(dracoLoader);

    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath(
      'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/libs/basis/'
    );
    ktx2Loader.detectSupport(renderer);
    this.gltfLoader.setKTX2Loader(ktx2Loader);

    this.initRoots();
  }

  private initRoots() {
    // Create 6 root tiles for S2 faces
    // Root geometric error from tileset.json (Face Level)
    const rootErr = 434350.0; // max_r * 0.25 for Moon (1737400m)

    // Initialize root tiles for all 6 faces of the S2 cube
    for (let i = 0; i < 6; i++) {
      const face = i;
      const rootTile = new S2Tile(this, null, face, 0, 0, 0, rootErr);

      // PRECISE HORIZON OCCLUSION POINT (V)
      // For a root face, the angular radius is acos(1/sqrt(3)) = 54.7356 deg.
      // We must also account for Moon's max terrain (~11km).
      // V = (R + maxH) / cos(theta)
      const R_moon = 1737400;
      const maxH = 11000;
      const cosTheta = 1.0 / Math.sqrt(3.0);
      const vDist = (R_moon + maxH) / cosTheta;
      rootTile.occPoint = rootTile.obb.center.clone().normalize().multiplyScalar(vDist);

      rootTile.isSubtreeRoot = true;
      // No longer scheduling or loading subtrees here.
      // Traverse will handle it based on SSE and visibility.
      this.rootTiles.push(rootTile);
    }
  }

  public frameCount: number = 0;
  private lruCache: Set<S2Tile> = new Set();

  public update() {
    this.frameCount++;

    // Reset frame stats (loaded and memory are persistent)
    this.stats.visible = 0;
    this.stats.refined = 0;
    this.stats.culledHorizon = 0;
    this.stats.culledFrustum = 0;
    this.stats.culledSSE = 0;

    // Update Frustum (Once per frame)
    this.projScreenMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix);

    // Update Guard Frustum (Scaled Projection)
    const ratio = this.performance.guardFrustumRatio;
    const guardProj = this.camera.projectionMatrix.clone();
    if (ratio !== 1.0) {
      guardProj.elements[0] /= ratio;
      guardProj.elements[5] /= ratio;
    }
    const guardMatrix = new THREE.Matrix4().multiplyMatrices(
      guardProj,
      this.camera.matrixWorldInverse
    );
    this.guardFrustum.setFromProjectionMatrix(guardMatrix);

    // Traverse
    for (const root of this.rootTiles) {
      this.traverse(root);
    }

    // Cleanup LRU (every 30 frames approx)
    if (this.frameCount % 30 === 0) {
      this.cleanup();
    }
  }

  private cleanup() {
    const tilesToRemove: S2Tile[] = [];
    const threshold = this.frameCount - this.performance.unloadTimeFrames;

    // 1. Time-based Cleanup
    for (const tile of this.lruCache) {
      if (tile.zoom <= this.persistence.unloadThreshold) continue;
      if (tile.lastVisitedFrame < threshold) {
        tilesToRemove.push(tile);
      }
    }

    // 2. Size-based Cleanup (Hard Limit)
    const effectiveCacheSize = this.stats.loaded - tilesToRemove.length;
    let overLimit = effectiveCacheSize - this.performance.maxCacheSize;

    if (overLimit > 0) {
      for (const tile of this.lruCache) {
        if (overLimit <= 0) break;
        if (tilesToRemove.includes(tile)) continue;
        if (tile.zoom <= this.persistence.unloadThreshold) continue;

        // NEVER evict tiles that were visited/visible in the current frame
        if (tile.lastVisitedFrame === this.frameCount) continue;

        tilesToRemove.push(tile);
        overLimit--;
      }
    }

    for (const tile of tilesToRemove) {
      this.scheduler.cancel(tile);
      tile.dispose();
      this.lruCache.delete(tile);
      this.stats.loaded--;
    }
  }

  public dispose() {
    this.scheduler.clear();
    for (const root of this.rootTiles) {
      this.disposeRecursive(root);
    }
    this.rootTiles = [];
    this.lruCache.clear();
    this.stats.loaded = 0;
    this.stats.visible = 0;
  }

  private disposeRecursive(tile: S2Tile) {
    for (const child of tile.children) {
      this.disposeRecursive(child);
    }
    tile.dispose();
  }

  private traverse(tile: S2Tile, depth: number = 0, visibleAllowed: boolean = true): boolean {
    tile.lastVisitedFrame = this.frameCount;

    // Subtree Readiness
    if (tile.isSubtreeRoot && !tile.subtreeParser) {
      tile.loadSubtree();
      visibleAllowed = false;
    }

    if (depth > 100) {
      console.warn('S2Tileset: Max recursion depth reached');
      return false;
    }

    // Horizon Culling
    if (this.isHorizonOccluded(tile)) {
      this.setTileVisible(tile, false);
      this.stats.culledHorizon++;
      if (tile.zoom > this.persistence.cancellationThreshold) this.scheduler.cancel(tile);
      return false;
    }

    // Frustum Culling
    const inFrustum = this.isInFrustum(tile, this.frustum);
    const inGuard = inFrustum || this.isInFrustum(tile, this.guardFrustum);

    if (!inGuard) {
      this.setTileVisible(tile, false);
      this.stats.culledFrustum++;
      if (tile.zoom > this.persistence.cancellationThreshold) this.scheduler.cancel(tile);
      return false;
    }

    if (!inFrustum) {
      visibleAllowed = false;
    }

    // Screen Space Error
    const sse = this.computeScreenSpaceError(tile);

    if (sse <= this.maxScreenSpaceError) {
      const priority = inFrustum ? sse : 1.0;
      const rendered = this.renderTile(tile, visibleAllowed, priority);
      if (!rendered) {
        this.stats.culledSSE++;
      }
      return rendered;
    } else {
      // Needs refinement
      if (tile.children.length === 0) {
        this.createChildren(tile);
      }

      if (tile.children.length > 0) {
        let readyToRefine = true;
        if (visibleAllowed) {
          for (const child of tile.children) {
            if (this.isHorizonOccluded(child)) continue;
            if (!this.isInFrustum(child, this.guardFrustum)) continue;
            if (child.state !== TILE_STATE.LOADED && child.state !== TILE_STATE.FAILED) {
              readyToRefine = false;
              break;
            }
          }
        } else {
          readyToRefine = true; // Pass through invisible status
        }

        const passVisibility = visibleAllowed && readyToRefine;
        let anyChildRendered = false;
        for (const child of tile.children) {
          const childRendered = this.traverse(child, depth + 1, passVisibility);
          if (childRendered) {
            anyChildRendered = true;
          }
        }

        if (passVisibility && anyChildRendered) {
          this.setTileVisible(tile, false);
          if (tile.state === TILE_STATE.LOADED) {
            this.stats.refined++;
          }
          return true;
        } else {
          const priority = inFrustum ? sse : 1.0;
          const rendered = this.renderTile(tile, visibleAllowed, priority);
          return rendered;
        }
      } else {
        const priority = inFrustum ? sse : 1.0;
        const rendered = this.renderTile(tile, visibleAllowed, priority);
        return rendered;
      }
    }
  }

  private createChildren(tile: S2Tile) {
    const nextZoom = tile.zoom + 1;
    const startX = tile.x * 2;
    const startY = tile.y * 2;
    const nextErr = tile.geometricError / 2;

    for (let i = 0; i < 4; i++) {
      const x = startX + (i % 2);
      const y = startY + Math.floor(i / 2);
      const subtreeLevels = 5;
      const isNewSubtree = nextZoom % subtreeLevels === 0;

      let available = false;
      if (isNewSubtree) {
        available = tile.checkNewSubtreeAvailability(x, y, nextZoom);
      } else {
        available = tile.checkChildAvailability(x, y, nextZoom);
      }

      if (available) {
        const meta = tile.getChildMetadata(x, y, nextZoom);
        let minH = -10000;
        let maxH = 10000;
        let occPoint: THREE.Vector3 | null = null;

        if (meta) {
          if (meta.minHeight !== undefined) minH = meta.minHeight;
          if (meta.maxHeight !== undefined) maxH = meta.maxHeight;
          if (meta.occPoint) occPoint = meta.occPoint;
        }

        const child = new S2Tile(
          this,
          tile,
          tile.face,
          nextZoom,
          x,
          y,
          nextErr,
          minH,
          maxH,
          occPoint
        );

        if (isNewSubtree) {
          child.isSubtreeRoot = true;
        }
        tile.children.push(child);
      }
    }
  }

  private renderTile(tile: S2Tile, visibleAllowed: boolean = true, priority: number = 0): boolean {
    if (!tile.checkContentAvailability()) {
      return false;
    }

    if (tile.state === TILE_STATE.UNLOADED) {
      this.scheduler.schedule(tile, priority);
      return false;
    }

    if (tile.state === TILE_STATE.LOADED) {
      this.setTileVisible(tile, visibleAllowed);

      // Update LRU position: remove and re-add to put at the "back" (MRU)
      this.lruCache.delete(tile);
      this.lruCache.add(tile);

      if (visibleAllowed) {
        this.stats.visible++;
        if (this.stats.visible > 5000) {
          throw new Error('S2Tileset Loop runaway: >5000 visible tiles');
        }
        return true;
      }
      return false;
    }

    return false;
  }

  private setTileVisible(tile: S2Tile, visible: boolean) {
    if (tile.sceneObject) {
      tile.sceneObject.visible = visible;

      tile.sceneObject.traverse((obj: THREE.Object3D) => {
        if ((obj as THREE.Mesh).isMesh && (obj as THREE.Mesh).material) {
          const mesh = obj as THREE.Mesh;
          const material = mesh.material;
          const wireframe = this.debug.wireframe;
          if (Array.isArray(material)) {
            material.forEach((m) => {
              (m as THREE.MeshStandardMaterial).wireframe = wireframe;
            });
          } else {
            (material as THREE.MeshStandardMaterial).wireframe = wireframe;
          }
        }
      });

      if (visible && !tile.sceneObject.parent) {
        this.scene.add(tile.sceneObject);
      } else if (!visible && tile.sceneObject.parent) {
        this.scene.remove(tile.sceneObject);
      }
    }

    if (this.debug.showBoundingBoxes && visible) {
      if (!tile.userData.debugFrame) {
        const frame = new TileFrame(tile);
        this.scene.add(frame);
        tile.userData.debugFrame = frame;
      }
    } else {
      if (tile.userData.debugFrame) {
        this.scene.remove(tile.userData.debugFrame);
        tile.userData.debugFrame = undefined;
      }
    }
  }

  private isHorizonOccluded(tile: S2Tile): boolean {
    if (!tile.occPoint) return false;
    const R = 1737400.0;
    const distCamSq = this.camera.position.lengthSq();
    if (distCamSq < R * R) return false;

    const distCam = Math.sqrt(distCamSq);
    const distOcc = tile.occPoint.length();

    // Precise Horizon Occlusion (Cozzi / Cesium)
    // A point V occludes all points in its associated bundle if
    // the angle between Cam and V is greater than the sum of
    // their respective horizon angles to the sphere.
    const angleCam = Math.acos(R / distCam);
    const angleOcc = Math.acos(Math.min(1.0, R / distOcc));
    const limitAngle = angleCam + angleOcc;

    const dot = this.camera.position.dot(tile.occPoint);
    const cosTheta = dot / (distCam * distOcc);

    return cosTheta < Math.cos(limitAngle);
  }

  private isInFrustum(tile: S2Tile, frustum: THREE.Frustum): boolean {
    const planes = frustum.planes;
    const center = tile.obb.center;
    const halfSize = tile.obb.halfSize;
    const rotation = tile.obb.rotation;
    const e = rotation.elements;
    const xAxis = new THREE.Vector3(e[0], e[1], e[2]);
    const yAxis = new THREE.Vector3(e[3], e[4], e[5]);
    const zAxis = new THREE.Vector3(e[6], e[7], e[8]);

    for (let i = 0; i < 6; i++) {
      const plane = planes[i];
      const normal = plane.normal;
      const r =
        Math.abs(normal.dot(xAxis) * halfSize.x) +
        Math.abs(normal.dot(yAxis) * halfSize.y) +
        Math.abs(normal.dot(zAxis) * halfSize.z);
      const d = plane.distanceToPoint(center);
      if (d + r < 0) return false;
    }
    return true;
  }

  private computeScreenSpaceError(tile: S2Tile): number {
    const closestPoint = new THREE.Vector3();
    tile.obb.clampPoint(this.camera.position, closestPoint);
    const distance = closestPoint.distanceTo(this.camera.position);
    if (distance <= 0) return 999999;
    if (!(this.camera instanceof THREE.PerspectiveCamera)) return 0;

    const height = window.innerHeight;
    const sse =
      (tile.geometricError * height) /
      (2 * distance * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2));
    return sse;
  }

  public loadTileContent(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(url, resolve, undefined, reject);
    });
  }

  public onTileLoaded(tile: S2Tile) {
    this.stats.loaded++;
    console.log('Loaded tile', tile.id);
  }
}
