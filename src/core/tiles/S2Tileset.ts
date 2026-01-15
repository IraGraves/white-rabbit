import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { S2Tile, TILE_STATE } from './S2Tile';
import { TileFrame } from './TileFrame';

export class S2Tileset {
  public rootTiles: S2Tile[] = [];
  public baseUrl: string;
  public scene: THREE.Scene;
  public camera: THREE.Camera;

  // Loaders
  private gltfLoader: GLTFLoader;

  // Config
  public maxScreenSpaceError: number = 16;

  // Stats
  public stats = {
    loaded: 0,
    visible: 0,
    memory: 0,
  };

  public debug = {
    showBoundingBoxes: false,
    wireframe: false,
    globalContentScale: 1.0,
    colorByLevel: false,
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

    // Setup Loaders
    this.gltfLoader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.gltfLoader.setDRACOLoader(dracoLoader);

    const ktx2Loader = new KTX2Loader();

    // Use local transcoder path to ensure compatibility with installed three.js version
    ktx2Loader.setTranscoderPath('/basis/');
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
      rootTile.loadSubtree(); // Trigger load
      this.rootTiles.push(rootTile);
    }
  }

  // ...
  public frameCount: number = 0;
  private lruCache: Set<S2Tile> = new Set();

  public update() {
    this.frameCount++;

    // Reset stats
    this.stats.visible = 0;

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
    // LRU Threshold: 200 frames (~3 seconds)
    const threshold = this.frameCount - 200;

    for (const tile of this.lruCache) {
      if (tile.lastVisitedFrame < threshold) {
        tilesToRemove.push(tile);
      }
    }

    for (const tile of tilesToRemove) {
      tile.dispose();
      this.lruCache.delete(tile);
      this.stats.loaded--;
    }
  }

  private traverse(tile: S2Tile, depth: number = 0): boolean {
    tile.lastVisitedFrame = this.frameCount;

    if (depth > 100) {
      console.warn('S2Tileset: Max recursion depth reached');
      return false;
    }
    // Frustum Culling
    if (!this.isInFrustum(tile)) {
      // Cull
      this.setTileVisible(tile, false);
      return false;
    }

    // Screen Space Error
    const sse = this.computeScreenSpaceError(tile);

    if (sse <= this.maxScreenSpaceError) {
      // Leaf logic (based on error)
      const rendered = this.renderTile(tile);
      return rendered;
    } else {
      // Needs refinement
      if (tile.children.length === 0) {
        // Try to create children
        this.createChildren(tile);
      }

      // If children exist (meaning some were available), check if they are ready
      if (tile.children.length > 0) {
        let anyChildRendered = false;
        for (const child of tile.children) {
          const childRendered = this.traverse(child, depth + 1);
          if (childRendered) {
            anyChildRendered = true;
          }
        }

        if (!anyChildRendered) {
          // Fallback: If children didn't render (not ready, or empty leaves), render self
          const rendered = this.renderTile(tile);
          return rendered;
        } else {
          // Refined successfully
          this.setTileVisible(tile, false);
          return true;
        }
      } else {
        // No children possible, render self
        const rendered = this.renderTile(tile);
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
        // Create child
        const child = new S2Tile(this, tile, tile.face, nextZoom, x, y, nextErr);

        if (isNewSubtree) {
          child.isSubtreeRoot = true;
          child.loadSubtree();
        }

        tile.children.push(child);
      }
    }
  }

  private renderTile(tile: S2Tile): boolean {
    // Check Content Availability
    if (!tile.checkContentAvailability()) {
      // No content available
      return false;
    }

    if (tile.state === TILE_STATE.UNLOADED) {
      tile.loadContent();
      return false; // Not ready yet
    }

    if (tile.state === TILE_STATE.LOADED) {
      this.setTileVisible(tile, true);
      this.lruCache.add(tile);
      this.stats.visible++;
      if (this.stats.visible > 5000) {
        throw new Error('S2Tileset Loop runaway: >5000 visible tiles');
      }
      return true;
    }

    // Loading or Failed
    return false;
  }

  private setTileVisible(tile: S2Tile, visible: boolean) {
    // Content
    if (tile.sceneObject) {
      tile.sceneObject.visible = visible;

      // Apply Wireframe
      tile.sceneObject.traverse((obj: any) => {
        if (obj.isMesh && obj.material) {
          if (this.debug.wireframe) obj.material.wireframe = true;
          else obj.material.wireframe = false;
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

  private isInFrustum(tile: S2Tile): boolean {
    // TODO: Optimized method using CameraFrustum
    const frustum = new THREE.Frustum();
    const projScreenMatrix = new THREE.Matrix4();
    projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);

    return frustum.intersectsBox(tile.boundingBox);
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

  public loadTileContent(url: string): Promise<any> {
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
