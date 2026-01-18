import * as THREE from 'three';
import { S2Geometry } from '../../utils/S2Geometry';
import { S2Tileset } from './S2Tileset';
import { ImplicitTiling, SubtreeParser } from './ImplicitTiling';
import { OBB } from 'three/examples/jsm/math/OBB.js';

export const TILE_STATE = {
  UNLOADED: 0,
  LOADING: 1,
  LOADED: 2,
  FAILED: 3,
} as const;

export type TileState = (typeof TILE_STATE)[keyof typeof TILE_STATE];

export class S2Tile {
  public tileset: S2Tileset;
  public parent: S2Tile | null;

  // S2 Coordinates
  public face: number;
  public zoom: number;
  public x: number;
  public y: number;

  // Metrics
  public boundingBox: THREE.Box3;
  public obb: OBB;
  public geometricError: number;
  public occPoint: THREE.Vector3;
  public maxHeight: number;

  // State
  public state: TileState = TILE_STATE.UNLOADED;
  public sceneObject: THREE.Object3D | null = null;
  public children: S2Tile[] = [];

  // User Data for generic storage (e.g. debug frames)
  public userData: Record<string, any> = {};

  // Implicit Tiling Info
  public mortonIndex: number;
  public lastVisitedFrame: number = 0;
  public subtreeParser: SubtreeParser | null = null;
  public isSubtreeRoot: boolean = false;
  private subtreeLoading: boolean = false; // Prevent redundant fetches
  private abortController: AbortController | null = null;
  private lastShowNormals: boolean = false;

  constructor(
    tileset: S2Tileset,
    parent: S2Tile | null,
    face: number,
    zoom: number,
    x: number,
    y: number,
    geometricError: number,
    minH: number = -10000,
    maxH: number = 10000,
    occPoint: THREE.Vector3 | null = null
  ) {
    this.tileset = tileset;
    this.parent = parent;
    this.face = face;
    this.zoom = zoom;
    this.x = x;
    this.y = y;
    this.geometricError = geometricError;
    this.maxHeight = maxH;

    // Calculate Bounds
    // TODO: Get radii from tileset config
    const radii = new THREE.Vector3(1737400, 1737400, 1737400);
    this.boundingBox = S2Geometry.getTileBounds(face, x, y, zoom, minH, maxH, radii);
    this.obb = S2Geometry.getTileOBB(face, x, y, zoom, minH, maxH, radii);

    // Compute Morton Index relative to the parent subtree root?
    // Actually, for global Implicit Tiling, we normally have subtrees.
    // For now, let's just track x/y.
    this.mortonIndex = 0; // Placeholder, used by Subtree logic

    // Initialize occPoint
    if (occPoint) {
      this.occPoint = occPoint;
    } else {
      // Fallback: Use center of OBB (approximate)
      // Ideally we should compute the safe horizon point if missing.
      // For now, assume center of OBB is a safe enough approximation for old tilesets.
      this.occPoint = this.obb.center.clone();
    }
  }

  public get id(): string {
    return `${this.face}_${this.zoom}_${this.x}_${this.y}`;
  }

  // --- Implicit Tiling Methods ---

  public loadSubtree(): Promise<void> {
    // Only if this is a subtree root
    // For now, hardcode subtreeLevels = 5
    // So levels 0, 5, 10... are roots.
    // Construct URI. tileset.json says "subtrees/face0_{level}_{x}_{y}.subtree"

    const url = `${this.tileset.baseUrl}/subtrees/face${this.face}_${this.zoom}_${this.x}_${this.y}.subtree`;

    if (this.subtreeLoading || this.subtreeParser) return Promise.resolve();
    this.subtreeLoading = true;

    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load subtree ${url}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        this.subtreeParser = new SubtreeParser();
        const p = this.subtreeParser.parse(buffer);

        // Refresh own metadata if available (index 0 in property table)
        const myMeta = this.subtreeParser.getTileMetadata(0);
        if (myMeta) {
          if (myMeta.minHeight !== undefined) {
            const radii = new THREE.Vector3(1737400, 1737400, 1737400); // Moon Radius
            const hMin = myMeta.minHeight;
            const hMax = myMeta.maxHeight;
            this.occPoint = myMeta.occPoint ?? this.occPoint;
            this.maxHeight = hMax;

            this.boundingBox = S2Geometry.getTileBounds(
              this.face,
              this.x,
              this.y,
              this.zoom,
              hMin,
              hMax,
              radii
            );
            this.obb = S2Geometry.getTileOBB(
              this.face,
              this.x,
              this.y,
              this.zoom,
              hMin,
              hMax,
              radii
            );
          }
        }

        this.subtreeLoading = false;
        return p;
      })
      .catch((err) => {
        this.subtreeLoading = false;
        console.error(`[${this.id}] Failed to load subtree`, err);
      });
  }

  public checkChildAvailability(childX: number, childY: number, childLevel: number): boolean {
    if (!this.subtreeParser && this.parent) {
      return this.parent.checkChildAvailability(childX, childY, childLevel);
    }

    if (this.subtreeParser) {
      const relLevel = childLevel - this.zoom;

      // Calculate local coordinates relative to this subtree root
      const factor = 2 ** relLevel;
      const rootCornerX = this.x * factor;
      const rootCornerY = this.y * factor;

      const localX = childX - rootCornerX;
      const localY = childY - rootCornerY;

      const index = ImplicitTiling.getMortonIndex(relLevel, localX, localY);
      return this.subtreeParser.getTileAvailable(index);
    }

    return false; // Default fail
  }

  public checkContentAvailability(): boolean {
    let root: S2Tile | null = this;
    while (root && !root.subtreeParser) {
      if (root.isSubtreeRoot && !root.subtreeParser) {
        // This is a subtree root but parser not loaded yet.
        // We should arguably return FALSE until loaded to avoid 404s,
        // OR return TRUE to allow speculative loading (but risking 404s).
        // Given the user issue "fantasy tiles", safest is to wait for subtree?
        // BUT: If key tiles (Level 0) don't render, nothing shows.
        // Let's stick to default TRUE (allow) if parser missing, but log it.
        // console.log(`[${this.id}] Ancestor ${root.id} parser not ready. allowing.`);
        break;
      }
      root = root.parent;
    }

    if (root && root.subtreeParser) {
      const relLevel = this.zoom - root.zoom;
      const factor = 2 ** relLevel;
      const rootCornerX = root.x * factor;
      const rootCornerY = root.y * factor;

      const localX = this.x - rootCornerX;
      const localY = this.y - rootCornerY;

      const index = ImplicitTiling.getMortonIndex(relLevel, localX, localY);
      const available = root.subtreeParser.getContentAvailable(index);

      return available;
    }

    // Default allow if no subtree logic found
    return true;
  }

  public checkNewSubtreeAvailability(childX: number, childY: number, childLevel: number): boolean {
    let root: S2Tile | null = this;
    while (root && !root.subtreeParser) {
      if (root.isSubtreeRoot && !root.subtreeParser) {
        return false; // Parser not ready, assume false safely
      }
      root = root.parent;
    }

    if (root && root.subtreeParser) {
      const relLevel = childLevel - root.zoom;
      // "Child Subtree" info is at the relLevel = subtreeLevels.
      // E.g. if subtreeLevels = 2, children are at level 2 relative to root.
      // We assume correct level is passed.

      // Local coordinates relative to subtree root
      const factor = 2 ** relLevel;
      const rootCornerX = root.x * factor;
      const rootCornerY = root.y * factor;

      const localX = childX - rootCornerX;
      const localY = childY - rootCornerY;

      // For child subtree availability, the index is just the Morton code at this level
      // No pyramid offset needed.
      const index = ImplicitTiling.morton2D(localX, localY);
      return root.subtreeParser.getChildSubtreeAvailable(index);
    }

    return false;
  }

  public getChildMetadata(childX: number, childY: number, childLevel: number): any {
    let root: S2Tile | null = this;
    while (root && !root.subtreeParser) {
      if (root.isSubtreeRoot && !root.subtreeParser) {
        return null; // Parser not ready
      }
      root = root.parent;
    }

    if (root && root.subtreeParser) {
      const relLevel = childLevel - root.zoom;
      const factor = 2 ** relLevel;
      const rootCornerX = root.x * factor;
      const rootCornerY = root.y * factor;

      const localX = childX - rootCornerX;
      const localY = childY - rootCornerY;

      const index = ImplicitTiling.getMortonIndex(relLevel, localX, localY);
      return root.subtreeParser.getTileMetadata(index);
    }
    return null;
  }

  public async loadContent(): Promise<void> {
    if (this.state !== TILE_STATE.UNLOADED) return;
    this.state = TILE_STATE.LOADING;

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      const url = this.getContentUrl();
      const gltf = await this.tileset.loadTileContent(url, signal);

      if (signal.aborted) {
        this.state = TILE_STATE.UNLOADED;
        return;
      }

      this.handleLoadedGltf(gltf);
    } catch (err: any) {
      if (
        (err instanceof Error && (err.name === 'AbortError' || err.message === 'Aborted')) ||
        signal.aborted
      ) {
        this.state = TILE_STATE.UNLOADED;
        return;
      }

      console.error(`Failed to load tile ${this.id}`, err);
      this.state = TILE_STATE.FAILED;
    } finally {
      this.abortController = null;
    }
  }

  private handleLoadedGltf(gltf: any) {
    // ... (Logic extracted from previous loadContent)
    // For now, let's keep the logic inline or copy it back.
    // Actually, to keep diff small, I will paste the logic back here.

    // Try to find extensions in standard places
    const extensions = gltf.parser?.json?.extensionsUsed || gltf.userData?.extensionsUsed;
    if (extensions) {
      // console.log(`[${this.id}] Extensions Used:`, extensions);
    }

    const object = gltf.scene;

    // Apply Global Scale
    const scale = this.tileset.debug.globalContentScale ?? 1.0;
    object.scale.set(scale, scale, scale);

    object.updateMatrix();
    object.updateMatrixWorld(true);

    this.sceneObject = object;
    object.userData.tile = this;
    this.state = TILE_STATE.LOADED;

    // Force DoubleSide and Apply Debug Color
    this.sceneObject?.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.DoubleSide;

        // Debug Color
        if (this.tileset.debug.colorByLevel) {
          const m = child.material;
          if (!m.userData.originalColor) {
            m.userData.originalColor = m.color ? m.color.clone() : new THREE.Color(1, 1, 1);
          }
          const level = this.zoom;
          if (level === 0) m.color.setHex(0xff0000);
          else if (level === 1) m.color.setHex(0x00ff00);
          else if (level === 2) m.color.setHex(0x0000ff);
          else if (level === 3) m.color.setHex(0xffff00);
          else m.color.setHex(0xffffff);
        }
      }
    });

    this.tileset.onTileLoaded(this);
    this.updateDebugVisuals(true);
  }

  private updateDebugVisuals(force: boolean = false) {
    const showNormals = this.tileset.debug.showNormals;
    if (!force && showNormals === this.lastShowNormals) return;

    this.lastShowNormals = showNormals;

    if (this.sceneObject) {
      this.sceneObject.traverse((child: any) => {
        if (child.isMesh && child.material) {
          // Initialize user data storage for original material
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
          }

          if (showNormals) {
            if (!child.userData.normalMaterial) {
              child.userData.normalMaterial = new THREE.MeshNormalMaterial({
                side: THREE.DoubleSide,
                flatShading: false,
              });
            }
            child.material = child.userData.normalMaterial;
          } else {
            child.material = child.userData.originalMaterial;
          }
        }
      });
    }
  }

  public abortLoad() {
    if (this.state === TILE_STATE.LOADING) {
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }
      this.state = TILE_STATE.UNLOADED;
    }
  }

  public dispose(): void {
    this.abortLoad(); // Ensure no pending loads finish after disposal
    if (this.sceneObject) {
      // Clean up Three.js resources
      this.sceneObject.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material))
            obj.material.forEach((m: any) => {
              m.dispose();
            });
          else obj.material.dispose();
        }
      });
      if (this.sceneObject.parent) {
        this.sceneObject.parent.remove(this.sceneObject);
      }
      this.sceneObject = null;
    }

    // Also dispose debug frame
    if (this.userData.debugFrame) {
      if (this.userData.debugFrame.parent)
        this.userData.debugFrame.parent.remove(this.userData.debugFrame);
      this.userData.debugFrame.geometry.dispose();
      this.userData.debugFrame.material.dispose();
      this.userData.debugFrame = undefined;
    }

    this.state = TILE_STATE.UNLOADED;
  }

  public update(): void {
    // Traversal logic will call this
    this.updateDebugVisuals();
  }

  private getContentUrl(): string {
    // Construct URL based on pattern
    // Assumes standard pattern: content/{face}/{level}_{x}_{y}.glb
    return `${this.tileset.baseUrl}/content/${this.face}/${this.zoom}_${this.x}_${this.y}.glb`;
  }
}
