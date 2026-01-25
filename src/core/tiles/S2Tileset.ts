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
  public maxScreenSpaceErrorHysteresis: number = 1.2; // 20% leeway

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
    showNormals: false,
    showOccPoints: false,
    consoleOutput: false,
    enableHorizonCulling: true,
    horizonCullSafetyFactor: 1.05,
  };

  public persistence = {
    priorityLoadLevel: 0,
    cancellationThreshold: 0,
    unloadThreshold: 2,
  };

  public performance = {
    maxActiveDownloads: 6,
    maxCacheSize: 400,
    unloadTimeFrames: 300, // ~5 seconds @ 60fps
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

    this.loadTileset();
  }

  private async loadTileset() {
    try {
      const response = await fetch(`${this.baseUrl}/tileset.json`);
      const json = await response.json();

      const children = json.root.children as any[];
      if (!children || children.length === 0) {
        console.error('Invalid tileset.json: No children found');
        return;
      }

      for (const child of children) {
        // Identify Face from URI (content/{face}/...)
        const uri = child.content.uri as string;
        const faceMatch = uri.match(/content\/(\d)\//);
        if (!faceMatch) continue;
        const face = parseInt(faceMatch[1]);

        const error = child.geometricError;

        // Read Heights from Region [W, S, E, N, min, max]
        let minH = -10000;
        let maxH = 10000;
        if (child.boundingVolume?.region?.length >= 6) {
          minH = child.boundingVolume.region[4];
          maxH = child.boundingVolume.region[5];
        }

        // Read OccPoint from Extras and Swizzle to Scene Coordinates (Y-up)
        let occPoint: THREE.Vector3 | null = null;
        if (child.extras?.occPoint) {
          const [ex, ey, ez] = child.extras.occPoint;
          console.log(`[Debug Roots] Face ${face} JSON occPoint: [${ex}, ${ey}, ${ez}]`);
          // S2Geometry Swizzle: x->x, y->-z, z->y  (Wait, S2Geometry was x, z, -y)
          // let x = 0, y = 0, z = 0; -> target.set(x, z, -y)
          // So Scene X = ECEF X
          // Scene Y = ECEF Z
          // Scene Z = -ECEF Y
          occPoint = new THREE.Vector3(ex, ez, -ey);
        } else {
          console.warn(`[Debug Roots] Face ${face} MISSING occPoint in extras!`);
        }

        const rootTile = new S2Tile(this, null, face, 0, 0, 0, error, minH, maxH, occPoint);
        // If occPoint was missing, S2Tile might calculate a default, but we expect it in JSON now.
        rootTile.isSubtreeRoot = true;

        this.rootTiles.push(rootTile);
      }

      // Sort roots by face index just to be deterministic
      this.rootTiles.sort((a, b) => a.face - b.face);
    } catch (e) {
      console.error('Failed to load tileset.json', e);
      // Fallback to hardcoded if JSON load fails?
      // For now, let's assume it works or fail hard to alert dev.
      // But maybe we should keep the fallback logic just in case?
      // User said "storing in tileset... so they never have to be calculated".
      // So assuming JSON is the source of truth.
      this.initRootsFallback();
    }
  }

  public handleContextRestore() {
    console.warn('S2Tileset: WebGL Context Restored. Clearing state...');
    this.scheduler.clear();

    // Drop all old references. We cannot safely dispose() them because
    // they reference the OLD context, and trying to delete them in the NEW context
    // might throw INVALID_OPERATION or be undefined.
    // The browser automatically wipes VRAM on context loss, so we just need
    // to clear our JS references.
    this.rootTiles = [];
    this.lruCache.clear();
    this.stats.loaded = 0;
    this.stats.visible = 0;
    this.stats.memory = 0;

    // Restart
    this.loadTileset();
  }

  private initRootsFallback() {
    console.warn('Using fallback root initialization');
    const rootErr = 434350.0;
    for (let i = 0; i < 6; i++) {
      const rootTile = new S2Tile(this, null, i, 0, 0, 0, rootErr);
      // Manually calculate OccPoint as before (copied logic)
      const R_moon = 1737400;
      const maxH = 11000;
      const cosTheta = 1.0 / Math.sqrt(3.0);
      const vDist = (R_moon + maxH) / cosTheta;
      // Note: rootTile.obb uses S2Geometry values which are swizzled.
      // So this calculation is compatible with Scene Coordinates.
      if (rootTile.obb) {
        rootTile.occPoint = rootTile.obb.center.clone().normalize().multiplyScalar(vDist);
      }
      rootTile.isSubtreeRoot = true;
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

      // Safety: Never unload a tile that was visited in the last few seconds
      // OR a tile that is currently marked as visible.
      const isStillVisible = tile.sceneObject && tile.sceneObject.visible;
      if (isStillVisible) continue;

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

        // Protection: Never unload a visible tile to satisfy the limit
        // as this would cause immediate reloading (thrashing).
        if (tile.sceneObject && tile.sceneObject.visible) continue;

        tilesToRemove.push(tile);
        overLimit--;
      }
    }

    for (const tile of tilesToRemove) {
      this.scheduler.cancel(tile);

      // BUG FIX: Only decrement loaded count if the tile was actually loaded.
      // LRU contains Unloaded/Loading tiles too.
      if (tile.state === TILE_STATE.LOADED) {
        this.stats.loaded--;
      }

      tile.dispose();
      this.lruCache.delete(tile);
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
    // Refresh LRU state for ANY tile we visit in the current frame
    tile.lastVisitedFrame = this.frameCount;
    this.lruCache.delete(tile);
    this.lruCache.add(tile);

    // Ensure debug visuals are updated even if tile is culled later
    tile.updateDebugVisuals();

    // Subtree Readiness
    if (tile.isSubtreeRoot && !tile.subtreeParser) {
      tile.loadSubtree();
    }

    if (depth > 100) {
      console.warn('S2Tileset: Max recursion depth reached');
      return false;
    }

    // Horizon Culling
    if (this.isHorizonOccluded(tile)) {
      this.setTileVisible(tile, false, true);
      this.stats.culledHorizon++;
      if (tile.zoom > this.persistence.cancellationThreshold) this.scheduler.cancel(tile);
      return false;
    }

    // Frustum Culling
    const inFrustum = this.isInFrustum(tile, this.frustum);
    const inGuard = inFrustum || this.isInFrustum(tile, this.guardFrustum);

    if (!inGuard) {
      this.setTileVisible(tile, false, true);
      this.stats.culledFrustum++;
      if (tile.zoom > this.persistence.cancellationThreshold) this.scheduler.cancel(tile);
      return false;
    }

    if (!inFrustum) {
      // visibleAllowed = false; // [FIX] Allow rendering in Guard Frustum to prevent edge holes
    }

    // Screen Space Error
    const sse = this.computeScreenSpaceError(tile);

    // Hysteresis: only stop refining if error is significantly below threshold
    // and we are NOT already refined.
    const isRefined = tile.children.some((c) => c.sceneObject || c.children.length > 0);
    const threshold = isRefined
      ? this.maxScreenSpaceError / this.maxScreenSpaceErrorHysteresis
      : this.maxScreenSpaceError;

    const shouldRefine = sse > threshold;

    if (!shouldRefine) {
      if (tile.state === TILE_STATE.LOADED && tile.sceneObject) {
        const rendered = this.renderTile(tile, visibleAllowed, sse);
        // Only cancel children if they are NOT in the guard frustum (still useful for pre-fetch)
        for (const child of tile.children) {
          if (!this.isInFrustum(child, this.guardFrustum) || this.isHorizonOccluded(child)) {
            this.scheduler.cancel(child);
          }
        }
        if (!rendered) {
          this.stats.culledSSE++;
        }
        return rendered;
      } else {
        // We aren't loaded yet, so we can't refine even if we want to.
        // The parent will keep showing us while we load.
        this.scheduler.schedule(tile, sse);
        return false;
      }
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
        let allVisibleChildrenRendered = true;
        let anyChildRendered = false;

        for (const child of tile.children) {
          const childRendered = this.traverse(child, depth + 1, passVisibility);
          if (childRendered) {
            anyChildRendered = true;
          }

          if (passVisibility) {
            // STRICT CHECK: Since we now render guard tiles, we expect them to be ready.
            const inGuardFrame = this.isInFrustum(child, this.guardFrustum);
            const inMainFrustum = this.isInFrustum(child, this.frustum); // Add this back if we need it
            const occluded = this.isHorizonOccluded(child);

            // LOGIC FIX:
            // We only care if an off-screen tile is LOADED (which we checked in readyToRefine).
            // We do NOT care if it is RENDERED, because it might be culled (visibleAllowed=false).
            // So we only block if it's in the MAIN FRUSTUM and not rendered.
            if (inGuardFrame && !occluded) {
              if (inMainFrustum && !childRendered) {
                allVisibleChildrenRendered = false;
              }
            }
          }
        }

        if (passVisibility && allVisibleChildrenRendered && anyChildRendered) {
          this.setTileVisible(tile, false, false); // NOT RECURSIVE: allow children to show
          if (tile.state === TILE_STATE.LOADED) {
            this.stats.refined++;
          }
          return true;
        } else {
          const priority = inFrustum ? sse : 1.0;
          const rendered = this.renderTile(tile, visibleAllowed, priority);

          // XOR VISIBILITY FIXED: FORCE HIDE CHILDREN
          if (rendered && visibleAllowed) {
            for (const child of tile.children) {
              this.setTileVisible(child, false, true); // Recursive hide
            }
          }

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
      this.setTileVisible(tile, visibleAllowed, !visibleAllowed);

      if (visibleAllowed) {
        this.stats.visible++;
        if (this.stats.visible > 5000) {
          throw new Error('S2Tileset Loop runaway: >5000 visible tiles');
        }
        tile.update();
        return true;
      }
      return false;
    }

    return false;
  }

  private setTileVisible(tile: S2Tile, visible: boolean, recursive: boolean = false) {
    if (tile.sceneObject) {
      tile.sceneObject.visible = visible;

      // RECURSIVE HIDE: Only if culled, hide the whole branch
      if (!visible && recursive) {
        for (const child of tile.children) {
          this.setTileVisible(child, false, true);
        }
      }

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

  public findTile(
    face: number,
    zoom: number,
    x: number,
    y: number
  ): { tile: S2Tile | null; closest?: S2Tile; reason?: string } {
    const search = (tiles: S2Tile[]): S2Tile | null => {
      for (const t of tiles) {
        if (t.face === face && t.zoom === zoom && t.x === x && t.y === y) return t;
        const res = search(t.children);
        if (res) return res;
      }
      return null;
    };

    const tile = search(this.rootTiles);
    if (tile) return { tile };

    // If not found, find the deepest existing parent
    let current: S2Tile | undefined = this.rootTiles.find((t) => t.face === face);
    if (!current) return { tile: null, reason: 'Face root not loaded' };

    for (let z = current.zoom; z < zoom; z++) {
      if (this.isHorizonOccluded(current!))
        return { tile: null, closest: current, reason: `Clipped at L${z} (Horizon)` };
      if (!this.isInFrustum(current!, this.frustum))
        return { tile: null, closest: current, reason: `Clipped at L${z} (Frustum)` };

      const sse = this.computeScreenSpaceError(current!);
      // Hysteresis: only stop refining if error is significantly below threshold
      // and we are NOT already refined.
      const isRefined = current!.children.some((c) => c.sceneObject || c.children.length > 0);
      const threshold = isRefined
        ? this.maxScreenSpaceError / this.maxScreenSpaceErrorHysteresis
        : this.maxScreenSpaceError;

      const shouldRefine = sse > threshold;

      if (!shouldRefine)
        return { tile: null, closest: current, reason: `Stopped at L${z} (SSE Met)` };

      const shift = zoom - z - 1;
      const targetChildX = (x >> shift) & 1;
      const targetChildY = (y >> shift) & 1;

      // Find the specific child that leads to the target
      const child: S2Tile | undefined = current!.children.find((c) => {
        // This is a bit complex, let's use the local quadtree index
        const localX = c.x % 2;
        const localY = c.y % 2;
        return localX === targetChildX && localY === targetChildY;
      });

      if (!child)
        return {
          tile: null,
          closest: current,
          reason: `Not created at L${z + 1} (Refinement Pending)`,
        };
      current = child;
    }

    return { tile: null, closest: current, reason: 'Traversed but not found' };
  }

  public getTileStatus(tile: S2Tile) {
    const R = 1737400.0;
    const distCamSq = this.camera.position.lengthSq();
    const distCam = Math.sqrt(distCamSq);
    const distOcc = tile.occPoint ? tile.occPoint.length() : 0;

    const angleCam = Math.acos(R / Math.max(R, distCam));
    const angleOcc = tile.occPoint ? Math.acos(Math.min(1.0, R / Math.max(0.1, distOcc))) : 0;
    const limitAngle = angleCam + angleOcc;

    const dot = tile.occPoint ? this.camera.position.dot(tile.occPoint) : 0;
    const cosTheta = distCam * distOcc > 0 ? dot / (distCam * distOcc) : 0;
    const theta = Math.acos(Math.min(1.0, Math.max(-1.0, cosTheta)));

    const inFrustum = this.isInFrustum(tile, this.frustum);
    const horizonCulled = this.isHorizonOccluded(tile);
    const sse = this.computeScreenSpaceError(tile);
    // Hysteresis: only stop refining if error is significantly below threshold
    // and we are NOT already refined.
    const isRefined = tile.children.some((c) => c.sceneObject || c.children.length > 0);
    const threshold = isRefined
      ? this.maxScreenSpaceError / this.maxScreenSpaceErrorHysteresis
      : this.maxScreenSpaceError;

    const sseMet = sse <= threshold;

    let reason = 'Visible / Active';
    if (horizonCulled) reason = 'HORIZON';
    else if (!inFrustum) reason = 'FRUSTUM';
    else if (sseMet) reason = 'SSE MET (STOP)';
    else if (tile.state === TILE_STATE.LOADING) reason = 'LOADING...';
    else if (tile.state === TILE_STATE.FAILED) reason = 'FAILED (CHECK 404/NETWORK)';
    else if (tile.state === TILE_STATE.UNLOADED) reason = 'UNLOADED (WAITING)';

    return {
      id: `${tile.face}/${tile.zoom}/${tile.x}/${tile.y}`,
      frustumCulled: !inFrustum,
      horizonCulled,
      sse: sse.toFixed(2),
      sseThreshold: this.maxScreenSpaceError,
      sseMet,
      reason,
      distCam: distCam.toFixed(0),
      distOcc: distOcc.toFixed(0),
      angleCamDeg: ((angleCam * 180) / Math.PI).toFixed(2),
      angleOccDeg: ((angleOcc * 180) / Math.PI).toFixed(2),
      limitAngleDeg: ((limitAngle * 180) / Math.PI).toFixed(2),
      thetaDeg: ((theta * 180) / Math.PI).toFixed(2),
      isLoaded: tile.state === TILE_STATE.LOADED,
      hasMesh: !!tile.sceneObject,
      numChildren: tile.children.length,
      sceneVisible: tile.sceneObject ? tile.sceneObject.visible : false,
      isRefined: tile.children.some((c) => c.sceneObject !== null || c.children.length > 0),
    };
  }

  private isHorizonOccluded(tile: S2Tile): boolean {
    if (!this.debug.enableHorizonCulling) return false;
    if (!tile.occPoint || !tile.useHorizonCulling) return false;
    const R = 1737400.0;

    // Use world position in case camera is nested
    const camPos = new THREE.Vector3();
    this.camera.getWorldPosition(camPos);

    const distCamSq = camPos.lengthSq();
    // Safety check for being inside the planet
    if (distCamSq < R * R) return false;

    const distCam = Math.sqrt(distCamSq);
    const distOcc = tile.occPoint.length();

    // Safety: division by zero or NaN
    if (distCam === 0 || distOcc === 0 || Number.isNaN(distCam) || Number.isNaN(distOcc))
      return false;

    // Precise Horizon Occlusion (Cozzi / Cesium)
    const angleCam = Math.acos(R / distCam);
    const angleOcc = Math.acos(Math.min(1.0, R / distOcc));

    // Correction for Tile Width (Angular Size)
    // We treat the tile as a sphere at the OccPoint.
    // The radius is the OBB extent.
    // Use exact math (asin) + configurable safety factor for precision.
    const tileRadius = tile.obb.halfSize.length();
    const safetyFactor = this.debug.horizonCullSafetyFactor;
    const angleSize = Math.asin(Math.min(1.0, tileRadius / distOcc)) * safetyFactor;

    // Rigorous Limit: Horizon + HeightBuffer + BoundingSphereAngularRadius
    const limitAngle = angleCam + angleOcc + angleSize;

    const dot = camPos.dot(tile.occPoint);
    const cosTheta = dot / (distCam * distOcc);

    // If limitAngle is very small or NaN, avoid false positives
    if (Number.isNaN(limitAngle)) return false;

    const shouldCull = cosTheta < Math.cos(limitAngle);

    /*
    if (shouldCull) {
      if (Math.random() < 0.05) {
        console.warn(`[HorizonDebug] Culling ${tile.id}`);
      }
    }
    */

    return shouldCull;

    if (shouldCull) {
      // Log a sample of culled tiles to debug
      if (Math.random() < 0.05) {
        console.warn(`[HorizonDebug] Culling ${tile.id}`);
        // Calculate theta only for debug logging to avoid unused var in prod
        const theta = Math.acos(Math.max(-1.0, Math.min(1.0, cosTheta)));
        console.warn(
          `  Deg: Cam=${THREE.MathUtils.radToDeg(angleCam).toFixed(1)}, Limit=${THREE.MathUtils.radToDeg(limitAngle).toFixed(1)} (Size=${THREE.MathUtils.radToDeg(effectiveAngleSize).toFixed(1)}), Theta=${THREE.MathUtils.radToDeg(theta).toFixed(1)}`
        );
      }
    }

    return shouldCull;
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

  public loadTileContent(url: string, signal?: AbortSignal): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      const onAbort = () => reject(new Error('Aborted'));
      if (signal?.aborted) return onAbort();
      signal?.addEventListener('abort', onAbort);

      this.gltfLoader.load(
        url,
        (gltf) => {
          signal?.removeEventListener('abort', onAbort);
          resolve(gltf);
        },
        undefined,
        (err) => {
          signal?.removeEventListener('abort', onAbort);
          reject(err);
        }
      );
    });
  }

  public onTileLoaded(tile: S2Tile) {
    this.stats.loaded++;
    if (this.debug.consoleOutput) {
      console.log('Loaded tile', tile.id);
    }
  }

  public checkSeams() {
    console.log('--- Seam Check Started (Brute Force Closest Edge) ---');
    const loadedTiles = Array.from(this.lruCache).filter(
      (t) => t.state === TILE_STATE.LOADED && t.sceneObject
    );
    console.log(`Checking ${loadedTiles.length} loaded tiles...`);

    const tilesByKey: Record<string, S2Tile> = {};
    loadedTiles.forEach((t) => {
      tilesByKey[`${t.face}_${t.zoom}_${t.x}_${t.y}`] = t;
    });

    let maxGlobalError = 0;
    let errorsFound = 0;

    const checkPair = (t1: S2Tile, t2: S2Tile, axis: 'H' | 'V') => {
      // Force matrix update to ensure world coordinates are fresh
      t1.sceneObject!.updateMatrixWorld(true);
      t2.sceneObject!.updateMatrixWorld(true);

      // 1. Collect Edge Vertices
      const getEdgeVerts = (
        tile: S2Tile,
        uTarget: number,
        vTarget: number,
        uCmp: 'eq' | 'ignore'
      ): { pos: THREE.Vector3[]; minR: number; maxR: number; avgR: number } => {
        const bucketMap: Record<string, { pos: THREE.Vector3; r: number; edgeDist: number }> = {};
        let minR = Infinity;
        let maxR = -Infinity;
        let sumR = 0;

        tile.sceneObject!.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            const posAttr = mesh.geometry.attributes.position;
            const uvAttr = mesh.geometry.attributes.uv;
            if (!uvAttr) return;

            for (let i = 0; i < posAttr.count; i++) {
              const u = uvAttr.getX(i);
              const v = uvAttr.getY(i);

              const margin = 0.001;
              let edgeDist = 0;
              let bucketKey = '';
              let isCandidate = false;

              // uCmp and vCmp are used to determine if we are checking vertical or horizontal seams
              if (uCmp === 'eq') {
                isCandidate = Math.abs(u - uTarget) < margin;
                edgeDist = Math.abs(u - uTarget);
                bucketKey = Math.round(v * 1000).toString();
              } else {
                isCandidate = Math.abs(v - vTarget) < margin;
                edgeDist = Math.abs(v - vTarget);
                bucketKey = Math.round(u * 1000).toString();
              }

              if (isCandidate) {
                const vLocal = new THREE.Vector3().fromBufferAttribute(posAttr, i);
                const vWorld = vLocal.clone().applyMatrix4(mesh.matrixWorld);
                const r = vWorld.length();

                const existing = bucketMap[bucketKey];
                if (
                  !existing ||
                  edgeDist < existing.edgeDist - 0.0001 ||
                  (Math.abs(edgeDist - existing.edgeDist) < 0.0001 && r > existing.r)
                ) {
                  bucketMap[bucketKey] = { pos: vWorld.clone(), r, edgeDist };
                }
              }
            }
          }
        });

        const verts = Object.values(bucketMap);
        verts.forEach((v) => {
          if (v.r < minR) minR = v.r;
          if (v.r > maxR) maxR = v.r;
          sumR += v.r;
        });

        return {
          pos: verts.map((v) => v.pos),
          minR,
          maxR,
          avgR: verts.length > 0 ? sumR / verts.length : 0,
        };
      };

      let v1Info = { pos: [] as THREE.Vector3[], avgR: 0, minR: 0, maxR: 0 };
      let v2Info = { pos: [] as THREE.Vector3[], avgR: 0, minR: 0, maxR: 0 };

      if (axis === 'H') {
        v1Info = getEdgeVerts(t1, 1.0, -1, 'eq');
        v2Info = getEdgeVerts(t2, 0.0, -1, 'eq');
      } else {
        // top-down: y=0 (South) has North edge at v=0, y=1 (North) has South edge at v=1
        v1Info = getEdgeVerts(t1, -1, 0.0, 'ignore');
        v2Info = getEdgeVerts(t2, -1, 1.0, 'ignore');
      }

      const v1 = v1Info.pos;
      const v2 = v2Info.pos;

      if (v1.length === 0 || v2.length === 0) {
        // console.log(`[${t1.id} <-> ${t2.id}] No edge vertices found (v1=${v1.length}, v2=${v2.length})`);
        return;
      }
      errorsFound++; // Increment even if no "error" (gap) to show progress

      // 2. Brute Force Match with Breakdown
      let maxDistLocal = 0;
      let totalDist = 0;
      let totalHeightDist = 0;
      let totalLateralDist = 0;

      for (const p1 of v1) {
        let minDistSq = Infinity;
        let bestP2: THREE.Vector3 | null = null;
        for (const p2 of v2) {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < minDistSq) {
            minDistSq = d2;
            bestP2 = p2;
          }
        }

        if (bestP2) {
          const d = Math.sqrt(minDistSq);
          if (d > maxDistLocal) maxDistLocal = d;
          totalDist += d;

          const r1 = p1.length();
          const r2 = bestP2.length();
          const hDist = Math.abs(r1 - r2);
          totalHeightDist += hDist;

          const latDist = Math.sqrt(Math.max(0, d * d - hDist * hDist));
          totalLateralDist += latDist;
        }
      }

      const count = v1.length;
      const avgDist = totalDist / count;
      const avgH = totalHeightDist / count;
      const avgLat = totalLateralDist / count;
      const avgR = (v1Info.avgR + v2Info.avgR) / 2;

      console.log(
        `Seam ${t1.id} <-> ${t2.id} (${axis}): Max=${maxDistLocal.toFixed(2)}, Avg=${avgDist.toFixed(2)} [H=${avgH.toFixed(2)}, Lat=${avgLat.toFixed(2)}] (n=${count}, Rad=${avgR.toFixed(0)})`
      );
      console.log(
        `  R1: [${v1Info.minR.toFixed(0)} - ${v1Info.maxR.toFixed(0)}], R2: [${v2Info.minR.toFixed(0)} - ${v2Info.maxR.toFixed(0)}]`
      );

      if (maxDistLocal > maxGlobalError) maxGlobalError = maxDistLocal;
      errorsFound++;
    };

    for (const t of loadedTiles) {
      const keyRight = `${t.face}_${t.zoom}_${t.x + 1}_${t.y}`;
      if (tilesByKey[keyRight]) checkPair(t, tilesByKey[keyRight], 'H');

      const keyUp = `${t.face}_${t.zoom}_${t.x}_${t.y + 1}`;
      if (tilesByKey[keyUp]) checkPair(t, tilesByKey[keyUp], 'V');
    }

    console.log(`--- Seam Check Complete ---`);
    console.log(`Checked ${errorsFound} seams. Max Global Gap: ${maxGlobalError.toFixed(5)} m`);
  }
}
