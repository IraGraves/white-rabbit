import * as THREE from 'three';
import { S2Geometry } from '../../utils/S2Geometry';
import { S2Tileset } from './S2Tileset';
import { ImplicitTiling, SubtreeParser } from './ImplicitTiling';

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
  public geometricError: number;

  // State
  public state: TileState = TILE_STATE.UNLOADED;
  public sceneObject: THREE.Object3D | null = null;
  public children: S2Tile[] = [];

  // User Data for generic storage (e.g. debug frames)
  public userData: Record<string, any> = {};

  // Implicit Tiling Info
  public mortonIndex: number;
  public lastVisitedFrame: number = 0;

  // Implicit Tiling - Subtree
  public subtreeParser: SubtreeParser | null = null;
  public isSubtreeRoot: boolean = false;

  constructor(
    tileset: S2Tileset,
    parent: S2Tile | null,
    face: number,
    zoom: number,
    x: number,
    y: number,
    geometricError: number,
    minH: number = -10000,
    maxH: number = 10000
  ) {
    this.tileset = tileset;
    this.parent = parent;
    this.face = face;
    this.zoom = zoom;
    this.x = x;
    this.y = y;
    this.geometricError = geometricError;

    // Calculate Bounds
    // TODO: Get radii from tileset config
    const radii = new THREE.Vector3(1737400, 1737400, 1737400);
    this.boundingBox = S2Geometry.getTileBounds(face, x, y, zoom, minH, maxH, radii);

    // Compute Morton Index relative to the parent subtree root?
    // Actually, for global Implicit Tiling, we normally have subtrees.
    // For now, let's just track x/y.
    this.mortonIndex = 0; // Placeholder, used by Subtree logic
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

    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load subtree ${url}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        this.subtreeParser = new SubtreeParser();
        return this.subtreeParser.parse(buffer);
      })
      .catch((err) => {
        // Silent fail for leaf regions where no new subtree exists?
        // OR error.
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

  public loadContent(): void {
    if (this.state !== TILE_STATE.UNLOADED) return;
    this.state = TILE_STATE.LOADING;

    const url = this.getContentUrl();
    this.tileset
      .loadTileContent(url)
      .then((gltf: any) => {
        console.log(`[${this.id}] GLTF Object Keys:`, Object.keys(gltf));

        // Try to find extensions in standard places
        const extensions = gltf.parser?.json?.extensionsUsed || gltf.userData?.extensionsUsed;
        if (extensions) {
          console.log(`[${this.id}] Extensions Used:`, extensions);
        } else {
          console.log(`[${this.id}] No extensions found in standard locations.`);
        }

        const object = gltf.scene;

        // Inspect Geometry Attributes DEEP DIVE
        console.log(`[${this.id}] Traversing scene...`);
        object.traverse((child: any) => {
          console.log(`[${this.id}] Node: ${child.type} - ${child.name}`);
          if (child.isMesh) {
            const geo = child.geometry;
            console.log(`[${this.id}] >>> Found Mesh!`);

            // Log Attribute Details
            for (const name in geo.attributes) {
              const attr = geo.attributes[name];
              console.log(
                `[${this.id}] Attribute '${name}':`,
                `Type: ${attr.array.constructor.name}`,
                `ItemSize: ${attr.itemSize}`,
                `Count: ${attr.count}`,
                `Normalized: ${attr.normalized}`
              );

              // RADIUS CHECK: Scan positions to determine scale and skirt presence
              if (name === 'position') {
                let minR = Infinity;
                let maxR = -Infinity;
                let sumR = 0;
                let nearZeroCount = 0;
                const count = attr.count;

                for (let i = 0; i < count; i++) {
                  const x = attr.getX(i);
                  const y = attr.getY(i);
                  const z = attr.getZ(i);
                  const r = Math.sqrt(x * x + y * y + z * z);

                  if (r < minR) minR = r;
                  if (r > maxR) maxR = r;
                  sumR += r;

                  if (r < 1000) nearZeroCount++; // Vertices near origin (< 1km)
                }

                console.log(`[${this.id}] Vertex Radii Stats:`, {
                  minRadius: minR,
                  maxRadius: maxR,
                  avgRadius: sumR / count,
                  nearZeroVerts: nearZeroCount,
                  totalVerts: count,
                });
              }
            }

            // Check Index
            if (geo.index) {
              console.log(
                `[${this.id}] Index: Type: ${geo.index.array.constructor.name}, Count: ${geo.index.count}`
              );
            } else {
              console.log(`[${this.id}] Index: None (Non-indexed geometry)`);
            }
          }
        });

        // Compute loose bounds of content
        const contentBox = new THREE.Box3().setFromObject(object);
        // Check for Extensions
        if (gltf.parser?.json) {
          console.log(`[${this.id}] GLTF Extensions Used:`, gltf.parser.json.extensionsUsed);
          console.log(
            `[${this.id}] GLTF Extensions Required:`,
            gltf.parser.json.extensionsRequired
          );

          // Check for CESIUM_RTC
          if (gltf.parser.json.extensions?.CESIUM_RTC) {
            const rtcCenter = gltf.parser.json.extensions.CESIUM_RTC.center;
            console.log(`[${this.id}] Found CESIUM_RTC:`, rtcCenter);

            // Keep the RTC value for application
            // Note: GLTFLoader typically applies this if using a plugin, but better to verify
            // If it's NOT applied, we might need to manually move the object.
            // But usually, standard loaders put the mesh relative to this center.
            // If we put the object at (0,0,0) world, and the mesh is small relative to center...
          }
        }

        const expectedSize = new THREE.Vector3();
        this.boundingBox.getSize(expectedSize);

        const contentSize = new THREE.Vector3();
        contentBox.getSize(contentSize);

        console.log(`[${this.id}] GLTF Asset Metric:`, gltf.asset);

        console.log(
          `[${this.id}] Content BOX:`,
          JSON.stringify({
            min: contentBox.min,
            max: contentBox.max,
            size: contentSize,
          })
        );
        console.log(
          `[${this.id}] Expected BOX:`,
          JSON.stringify({
            min: this.boundingBox.min,
            max: this.boundingBox.max,
            size: expectedSize,
          })
        );

        // Apply Global Scale from Tileset Debug
        const scale = this.tileset.debug.globalContentScale ?? 1.0;
        object.scale.set(scale, scale, scale);

        // REVERTED CENTERING: Trusting GLB internal translation for now to diagnose "Crystal" artifacts.
        // If the GLB has a translation of [cx, cz, -cy], it places the mesh in World Space.
        // We log the position for debug but do not override it yet.
        console.log(`[${this.id}] Object Translation (from GLB):`, JSON.stringify(object.position));
        // object.position.copy(...) // DISABLED

        object.updateMatrix();
        object.updateMatrixWorld(true);

        this.sceneObject = object;
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
      })
      .catch((err) => {
        console.error(`Failed to load tile ${this.id}`, err);
        this.state = TILE_STATE.FAILED;
      });
  }

  public dispose(): void {
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
  }

  private getContentUrl(): string {
    // Construct URL based on pattern
    // Assumes standard pattern: content/{face}/{level}_{x}_{y}.glb
    return `${this.tileset.baseUrl}/content/${this.face}/${this.zoom}_${this.x}_${this.y}.glb`;
  }
}
