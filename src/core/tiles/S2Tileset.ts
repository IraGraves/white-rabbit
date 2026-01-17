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
    maxCacheSize: 1000,
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
      rootTile.isSubtreeRoot = true;
      rootTile.isSubtreeRoot = true;
      rootTile.loadSubtree(); // Trigger load
      this.rootTiles.push(rootTile);
      // Force load L0 immediately (High Priority)
      if (rootTile.zoom <= this.persistence.priorityLoadLevel) {
        this.scheduler.schedule(rootTile, 9999999);
      }
    }
  }

  // ...
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
    // We can't easily scale the compilation matrix, but we can scale the camera projection for the temp matrix
    const guardProj = this.camera.projectionMatrix.clone();
    // Scale FOV logic or Zoom? Simpler: Just scale the W component or similar?
    // Actually, just scaling the frustum planes logic is safer.
    // Or: Scale the projection matrix:
    // P[0] = 1/tan(fov/2 * aspect). Scale by 1/ratio.
    // P[5] = 1/tan(fov/2). Scale by 1/ratio.
    const ratio = this.performance.guardFrustumRatio;
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

    // Cleanup LRU (every 60 frames approx)
    if (this.frameCount % 60 === 0) {
      this.cleanup();
    }
  }

  private cleanup() {
    const tilesToRemove: S2Tile[] = [];
    // LRU Threshold (Time based)
    const threshold = this.frameCount - this.performance.unloadTimeFrames;

    // 1. Time-based Cleanup
    for (const tile of this.lruCache) {
      // Pin L0 (Base Map) - Never unload
      if (tile.zoom <= this.persistence.unloadThreshold) continue;

      if (tile.lastVisitedFrame < threshold) {
        tilesToRemove.push(tile);
      }
    }

    // 2. Size-based Cleanup (Hard Limit)
    // If we are still over limit after time-cleanup, remove oldest remaining
    // Note: this.lruCache iteration order is oldest-first for Set in JS
    const effectiveCacheSize = this.stats.loaded - tilesToRemove.length; // Approximate
    let overLimit = effectiveCacheSize - this.performance.maxCacheSize;

    if (overLimit > 0) {
      for (const tile of this.lruCache) {
        if (overLimit <= 0) break;
        if (tilesToRemove.includes(tile)) continue; // Already marked

        // Pin L0
        if (tile.zoom <= this.persistence.unloadThreshold) continue;

        tilesToRemove.push(tile);
        overLimit--;
      }
    }

    for (const tile of tilesToRemove) {
      this.scheduler.cancel(tile); // Ensure request is cancelled
      tile.dispose();
      this.lruCache.delete(tile);
      this.stats.loaded--;
    }
  }

  public dispose() {
    // 1. Clear Scheduler
    this.scheduler.clear();

    // 2. recursive dispose of all root tiles
    // We need to traverse EVERYTHING, not just what's in cache, because
    // children might be in memory but not in lruCache (e.g. if they were just created but not rendered yet?)
    // Actually, S2Tile.children holds the tree.
    for (const root of this.rootTiles) {
      this.disposeRecursive(root);
    }
    this.rootTiles = [];
    this.lruCache.clear();
    this.stats.loaded = 0;
    this.stats.visible = 0;

    // Dispose loaders if needed (e.g. Draco worker pool)
    // GLTFLoader doesn't have a dispose, but DracoLoader does?
    // We shared the loaders, so maybe we shouldn't dispose them if they are global?
    // But here they are private properties.
    // this.dracoLoader.dispose(); // if we had reference
  }

  private disposeRecursive(tile: S2Tile) {
    // Dispose children first
    for (const child of tile.children) {
      this.disposeRecursive(child);
    }
    // Dispose self
    tile.dispose();
  }

  private traverse(tile: S2Tile, depth: number = 0, visibleAllowed: boolean = true): boolean {
    tile.lastVisitedFrame = this.frameCount;
    // console.log(`[Traverse] Visiting ${tile.id} (Depth: ${depth}, Visible: ${visibleAllowed})`);

    if (depth > 100) {
      console.warn('S2Tileset: Max recursion depth reached');
      return false;
    }
    // Horizon Culling (Before Frustum for efficiency)
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
      // Cull completely (Outside Guard Band)
      this.setTileVisible(tile, false);
      this.stats.culledFrustum++;
      if (tile.zoom > this.persistence.cancellationThreshold) this.scheduler.cancel(tile);
      return false;
    }

    // It is in Guard Band (or View).
    // If NOT in View (only Guard), we treat it as visible for TRAVERSAL (to load children),
    // but we force 'visibleAllowed = false' so it doesn't render.
    // AND we give it low priority.

    if (!inFrustum) {
      // In Guard Band Only
      visibleAllowed = false; // Don't show, just load
      // Continue traversal to load children?
      // Yes, otherwise we don't pre-fetch detail.
    }

    // Screen Space Error
    const sse = this.computeScreenSpaceError(tile);

    if (sse <= this.maxScreenSpaceError) {
      // Leaf logic (based on error)
      const priority = inFrustum ? sse : 1.0; // Low priority for guard band
      const rendered = this.renderTile(tile, visibleAllowed, priority); // Pass SSE for priority
      if (rendered) {
        // Just visible
      } else {
        // If it didn't render (unloaded), and we don't go deeper, it's effectively an SSE leaf
        this.stats.culledSSE++;
      }
      return rendered;
    } else {
      // Needs refinement
      if (tile.children.length === 0) {
        // Try to create children
        this.createChildren(tile);
      }

      // If children exist (meaning some were available), check if they are ready
      if (tile.children.length > 0) {
        // 1. Check Readiness (Parent Persistence)
        // We only switch to children if ALL visible children are ready (Loaded or Failed)
        // Otherwise we stick with the parent (but traverse children in background to load them)
        let readyToRefine = true;
        if (visibleAllowed) {
          for (const child of tile.children) {
            // Optimization: Quick cull check to ignore invisible children
            // Note: This is an optimistic check. The real check happens in recursion,
            // but we need to know NOW if we should block refinement.

            if (this.isHorizonOccluded(child)) continue;

            // Optimization: If parent is only in guard band, children are likely too.
            // But we must check frustum for children?
            // Expensive to check 2 frustums per child.
            // Simplified: If parent is in guard, assume children are relevant.
            // We'll check culling in recursive call.

            // if (!this.isInFrustum(child)) continue; // Old check
            // New check needs to match recursion logic or we break refinement readiness.

            // Actually, we can skip this pre-check or use Guard Frustum.
            // Using Guard Frustum for readiness check:
            if (!this.isInFrustum(child, this.guardFrustum)) continue;

            // Child is visible (in guard). Is it ready?
            if (child.state !== TILE_STATE.LOADED && child.state !== TILE_STATE.FAILED) {
              readyToRefine = false;
              break;
            }
          }
        } else {
          // If parent is invisible, children are invisible too.
          // We can treat them as "ready to refine" (to pass down the invisible flag)
          // or "not ready" (to stop traversal)?
          // We want to pass down the invisible flag to keep loading deep tree.
          readyToRefine = true; // Pass through
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
          // Refined successfully (Children took over)
          this.setTileVisible(tile, false);
          // If this tile IS loaded, but we hid it for children, count as Refined
          if (tile.state === TILE_STATE.LOADED) {
            this.stats.refined++;
          }
          return true;
        } else {
          // Fallback: If children didn't render (not ready, or empty leaves), render self
          const rendered = this.renderTile(tile, visibleAllowed);
          return rendered;
        }
      } else {
        // No children possible, render self
        const priority = inFrustum ? sse : 1.0;
        const rendered = this.renderTile(tile, visibleAllowed, priority);
        return rendered;
      }
    }
  }

  private createChildren(tile: S2Tile) {
    // Quadtree subdivision
    const nextZoom = tile.zoom + 1;
    const startX = tile.x * 2;
    const startY = tile.y * 2;
    const nextErr = tile.geometricError / 2; // rough assumption

    for (let i = 0; i < 4; i++) {
      const x = startX + (i % 2);
      const y = startY + Math.floor(i / 2);

      const subtreeLevels = 5; // Matches MAX_SUBTREE_LEVELS in Python tiler
      const isNewSubtree = nextZoom % subtreeLevels === 0;

      let available = false;

      if (isNewSubtree) {
        // Crossing boundary: Check if the child SUBTREE exists using parent info
        available = tile.checkNewSubtreeAvailability(x, y, nextZoom);
      } else {
        // Within subtree: Check if tile exists
        available = tile.checkChildAvailability(x, y, nextZoom);
      }

      if (available) {
        // Retrieve Metadata (Critical for OBB and Horizon Culling)
        const meta = tile.getChildMetadata(x, y, nextZoom);
        let minH = -10000;
        let maxH = 10000;
        let occPoint: THREE.Vector3 | null = null;

        if (meta) {
          if (meta.minHeight !== undefined) minH = meta.minHeight;
          if (meta.maxHeight !== undefined) maxH = meta.maxHeight;
          if (meta.occPoint) occPoint = meta.occPoint;
        }

        // Create child
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
          // Trigger subtree loading?
          // The update loop will trigger loading if visible.
        } else {
          // Inherit parser from parent (Implicit Tiling optimization)
          // We don't copy the parser reference directly to avoid confusion,
          // but child.subtreeParser will be null until we implement sharing or just use parent for checks.
          // Actually S2Tile methods look up the tree for the parser, so we don't need to pass it.
        }

        tile.children.push(child);
      }
    }
  }

  private renderTile(tile: S2Tile, visibleAllowed: boolean = true, priority: number = 0): boolean {
    // Check Content Availability
    if (!tile.checkContentAvailability()) {
      // No content available
      return false;
    }

    if (tile.state === TILE_STATE.UNLOADED) {
      this.scheduler.schedule(tile, priority);
      return false; // Not ready yet
    }

    if (tile.state === TILE_STATE.LOADED) {
      this.setTileVisible(tile, visibleAllowed);
      this.lruCache.add(tile);

      if (visibleAllowed) {
        this.stats.visible++;
        if (this.stats.visible > 5000) {
          throw new Error('S2Tileset Loop runaway: >5000 visible tiles');
        }
        return true;
      } else {
        // Even if hidden, we keep it in cache since it's active in the tree
        // do NOT increment stats.visible
        return false;
      }
    }

    // Loading or Failed
    return false;
  }

  private setTileVisible(tile: S2Tile, visible: boolean) {
    // Content
    if (tile.sceneObject) {
      tile.sceneObject.visible = visible;

      // Apply Wireframe
      tile.sceneObject.traverse((obj: THREE.Object3D) => {
        if ((obj as THREE.Mesh).isMesh && (obj as THREE.Mesh).material) {
          const mesh = obj as THREE.Mesh;
          const material = mesh.material;
          if (this.debug.wireframe) {
            if (Array.isArray(material)) {
              material.forEach((m) => {
                (m as THREE.MeshStandardMaterial).wireframe = true;
              });
            } else {
              (material as THREE.MeshStandardMaterial).wireframe = true;
            }
          } else {
            if (Array.isArray(material)) {
              material.forEach((m) => {
                (m as THREE.MeshStandardMaterial).wireframe = false;
              });
            } else {
              (material as THREE.MeshStandardMaterial).wireframe = false;
            }
          }
        }
      });

      if (visible && !tile.sceneObject.parent) {
        this.scene.add(tile.sceneObject);
      } else if (!visible && tile.sceneObject.parent) {
        this.scene.remove(tile.sceneObject);
      }
    }

    // Debug Bounding Boxes
    if (this.debug.showBoundingBoxes && visible) {
      if (!tile.userData.debugFrame) {
        const frame = new TileFrame(tile);
        this.scene.add(frame);
        tile.userData.debugFrame = frame;
      }
    } else {
      if (tile.userData.debugFrame) {
        this.scene.remove(tile.userData.debugFrame);
        // tile.userData.debugFrame.dispose(); // Optional geometry disposal
        tile.userData.debugFrame = undefined;
      }
    }
  }

  private isHorizonOccluded(tile: S2Tile): boolean {
    if (!tile.occPoint) return false;

    // Moon Radius (approx)
    const R = 1737400.0;

    // Camera position (assuming local space = world space centered at planet)
    // We need the camera position in the coordinate system of the tiles (ECEF)
    // If the tileset is rotated, apply inverse matrix.
    // For now, assume viewer is aligned.

    // Check if camera is inside the planet (no culling)
    const distCamSq = this.camera.position.lengthSq();
    if (distCamSq < R * R) return false;

    const distCam = Math.sqrt(distCamSq);
    const distOcc = tile.occPoint.length(); // Pre-calculated in metadata or S2Tile

    // Horizon Angle from Camera: Alpha
    // cos(Alpha) = R / distCam
    const cosAlpha = R / distCam;

    // Horizon Angle from Tile Occlusion Point: Beta
    // cos(Beta) = R / distOcc
    // Use Math.min(1.0) to be safe against floating point noise if point is below surface
    // Use Math.min(1.0) to be safe against floating point noise if point is below surface
    const angleBeta = Math.acos(Math.min(1.0, R / distOcc));

    // Expand the horizon cone by the tile's bounding sphere radius
    // This allows large tiles to "peek" over the horizon even if their center is occluded.
    const tileRadius = tile.obb.halfSize.length();
    const angleGamma = Math.asin(Math.min(1.0, tileRadius / distOcc));

    // Total angle threshold: Camera Horizon + Tile Horizon + Tile Extent
    const limitAngle = Math.acos(cosAlpha) + angleBeta + angleGamma;

    // We compare with the angle between Camera and Tile (Theta)
    // dot = |Cam| * |Occ| * cos(Theta)
    // cos(Theta) = dot / (|Cam| * |Occ|)
    // If Theta > limitAngle, then Occluded.
    // Since cos is decreasing: cos(Theta) < cos(limitAngle) -> Occluded.

    const cosTotal = Math.cos(limitAngle);

    // Dot product of directions
    // dot(N_cam, N_occ)
    // We can use non-normalized dot and divide by lengths
    const dot = this.camera.position.dot(tile.occPoint);
    const cosTheta = dot / (distCam * distOcc);

    // If cosTheta < cosTotal, then Theta > TotalAngle -> Occluded
    return cosTheta < cosTotal;
  }
  private isInFrustum(tile: S2Tile, frustum: THREE.Frustum): boolean {
    // Optimized: Use Cached Frustum + OBB Logic
    // OBB does not have intersectsFrustum, so we implement the separating axis test here
    // against the 6 frustum planes.

    const planes = frustum.planes;
    const center = tile.obb.center;
    const halfSize = tile.obb.halfSize;
    const rotation = tile.obb.rotation;
    // Basis vectors (columns of rotation matrix)
    const e = rotation.elements;
    const xAxis = new THREE.Vector3(e[0], e[1], e[2]);
    const yAxis = new THREE.Vector3(e[3], e[4], e[5]);
    const zAxis = new THREE.Vector3(e[6], e[7], e[8]);

    for (let i = 0; i < 6; i++) {
      const plane = planes[i];
      const normal = plane.normal;

      // Project OBB half-size onto plane normal
      const r =
        Math.abs(normal.dot(xAxis) * halfSize.x) +
        Math.abs(normal.dot(yAxis) * halfSize.y) +
        Math.abs(normal.dot(zAxis) * halfSize.z);

      // Distance from center to plane
      const d = plane.distanceToPoint(center);

      // If center is further "out" than radius allows, it's fully outside
      // Frustum planes point inside, so "outside" is negative distance.
      if (d + r < 0) {
        return false;
      }
    }
    return true;
  }

  private computeScreenSpaceError(tile: S2Tile): number {
    // distance to camera
    const distance = tile.boundingBox.distanceToPoint(this.camera.position);
    if (distance <= 0) return 999999;

    // SSE = (geometricError * screenHeight) / (2 * distance * tan(FOV/2))
    // Assuming perspective camera
    if (!(this.camera instanceof THREE.PerspectiveCamera)) return 0;

    const height = window.innerHeight; // viewport height
    const sse =
      (tile.geometricError * height) /
      (2 * distance * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2));

    return sse;
  }

  public loadTileContent(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }

  public onTileLoaded(tile: S2Tile) {
    // Post-processing?
    this.stats.loaded++;
    console.log('Loaded tile', tile.id);
  }
}
