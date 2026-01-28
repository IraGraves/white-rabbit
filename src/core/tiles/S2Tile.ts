import * as THREE from 'three';
import { S2Geometry } from '../../utils/S2Geometry';
import { S2Tileset } from './S2Tileset';
import { ImplicitTiling, SubtreeParser } from './ImplicitTiling';
import { OBB } from 'three/examples/jsm/math/OBB.js';
import { S2HeightmapMaterial } from '../../materials/S2HeightmapMaterial';

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
  public minHeight: number;
  public maxHeight: number;

  // State
  public state: TileState = TILE_STATE.UNLOADED;
  public sceneObject: THREE.Object3D | null = null;
  public isCurrentlyRefined: boolean = false; // True if children were rendered in the last frame
  public children: S2Tile[] = [];

  // User Data for generic storage (e.g. debug frames)
  public userData: Record<string, any> = {};

  // Implicit Tiling Info
  public mortonIndex: number;
  public lastVisitedFrame: number = 0;
  public subtreeParser: SubtreeParser | null = null;
  public isSubtreeRoot: boolean = false;
  // Fallback Flag
  public useHorizonCulling: boolean = true;
  private subtreeLoading: boolean = false; // Prevent redundant fetches
  private abortController: AbortController | null = null;
  private lastShowNormals: boolean = false;
  private lastShowOcc: boolean = false;

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
    this.minHeight = minH;

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
    if (occPoint && occPoint.lengthSq() > 1.0) {
      this.occPoint = occPoint;
      this.useHorizonCulling = true;
    } else {
      // Fallback: Use center of OBB projected to Surface Radius + MaxHeight
      // This ensures the point is "High" enough to prevent aggressive culling
      const r = 1737400.0;
      // Use provided MaxHeight or a sensible default if MaxH is suspiciously low (e.g. default -10000)
      // If maxH is the default (10000), usage is fine. If it's real data, usages is fine.
      const safeHeight = Math.max(0, this.maxHeight);
      console.warn(
        `[${this.id}] Missing OccPoint! Using Fallback (Surface + MaxHeight=${safeHeight}).`
      );
      const dir = this.obb.center.clone().normalize();
      this.occPoint = dir.multiplyScalar(r + safeHeight);
      this.useHorizonCulling = true;
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

            // Fix: Only overwrite occPoint if the subtree data is valid (non-zero)
            if (myMeta.occPoint && myMeta.occPoint.lengthSq() > 1.0) {
              this.occPoint = myMeta.occPoint;
              this.useHorizonCulling = true;
            } else if (myMeta.occPoint) {
              console.warn(`[${this.id}] Ignoring Zero-length OccPoint from Subtree`);
            }

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

      await this.handleLoadedGltf(gltf);
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

  private async handleLoadedGltf(gltf: any) {
    // Try to find extensions in standard places
    const extensions = gltf.parser?.json?.extensionsUsed || gltf.userData?.extensionsUsed;
    if (extensions) {
      // console.log(`[${this.id}] Extensions Used:`, extensions);
    }

    // DEBUG: Dump GLTF Structure to find Metadata
    console.log(`[${this.id}] GLTF Dump:`, {
      parserExtras: JSON.stringify(gltf.parser?.json?.extras),
      rootUserData: JSON.stringify(gltf.userData),
      sceneUserData: JSON.stringify(gltf.scene?.userData),
      assetExtras: JSON.stringify(gltf.asset?.extras),
    });

    const object = gltf.scene;

    // Check for proprietary format in material or mesh extras
    let isProprietary = this.tileset.tileFormat === 'proprietary_heightmap';
    let heightMap: THREE.Texture | null = null;
    let colorMap: THREE.Texture | null = null;
    let minH = this.parent
      ? this.parent.getChildMetadata(this.x, this.y, this.zoom)?.minHeight
      : undefined;
    let maxH = this.parent
      ? this.parent.getChildMetadata(this.x, this.y, this.zoom)?.maxHeight
      : undefined;

    // Elevation extras from GLB (highest priority) - Root Extras
    const parserExtras = gltf.parser?.json?.extras;
    if (parserExtras?.minHeight !== undefined) minH = parserExtras.minHeight;
    if (parserExtras?.maxHeight !== undefined) maxH = parserExtras.maxHeight;

    // BINARY HEIGHT MAPPING via Image/Texture (Standard/Robust)
    // We look for an image with our custom mimeType "image/x-s2-heightmap".
    // This image is likely attached to the material's emissiveTexture (or just exists in the asset).

    const parserImages = gltf.parser?.json?.images;
    if (parserImages && Array.isArray(parserImages)) {
      for (let i = 0; i < parserImages.length; i++) {
        const imgDef = parserImages[i];
        if (imgDef.mimeType === 'image/x-s2-heightmap' && imgDef.bufferView !== undefined) {
          console.log(`[S2Tile] ${this.id} Found Heightmap Image at index ${i}`);
          try {
            // Load buffer from bufferView directly
            const buffer = await gltf.parser.getDependency('bufferView', imgDef.bufferView);

            // GLB buffers are 4-byte aligned. This might add 2 bytes of padding to our Uint16 buffer.
            // e.g. 259*259 = 67081 pixels = 134162 bytes.
            // Aligned to 4 bytes = 134164 bytes (+2 bytes padding).
            // Uint16Array(buffer).length will be 67082. sqrt(67082) is not integer.

            const totalBytes = buffer.byteLength;
            const totalShorts = Math.floor(totalBytes / 2);

            // Estimate dimension (truncate padding)
            const dim = Math.floor(Math.sqrt(totalShorts));
            const requiredShorts = dim * dim;

            // Verify validity (allow up to 3 bytes / 1 short padding)
            if (totalShorts >= requiredShorts && totalShorts <= requiredShorts + 2) {
              // Create view of EXACTLY the valid data
              // We use the buffer, offset 0, and length equal to exact pixel count
              const uint16 = new Uint16Array(buffer, 0, requiredShorts);

              const float32 = new Float32Array(requiredShorts);
              for (let k = 0; k < requiredShorts; k++) {
                float32[k] = uint16[k] / 65535.0;
              }

              console.log(
                `[S2Tile] ${this.id} created DataTexture ${dim}x${dim} (padded from ${totalShorts})`
              );
              heightMap = new THREE.DataTexture(
                float32,
                dim,
                dim,
                THREE.RedFormat,
                THREE.FloatType
              );
              heightMap.needsUpdate = true;
              heightMap.minFilter = THREE.LinearFilter;
              heightMap.magFilter = THREE.LinearFilter;

              isProprietary = true;
              break; // Found it
            } else {
              console.error(
                `[S2Tile] Non-square height buffer in Image ${i}: ${totalShorts} shorts (Dim=${dim}, Req=${requiredShorts})`
              );
            }
          } catch (e) {
            console.error(`[S2Tile] Failed to load height buffer from Image ${i}`, e);
          }
        }
      }
    }

    // Legacy Fallback (Attribute Logic Removed)

    // Search for proprietary markers and textures in the GLTF (Legacy/Color fallbacks)
    object.traverse((child: any) => {
      if (child.isMesh) {
        if (
          child.userData?.extras?.proprietary_format === 's2_heightmap_v1' ||
          child.material?.userData?.extras?.proprietary_format === 's2_heightmap_v1'
        ) {
          isProprietary = true;
        }

        // Save Extras to UserData
        if (gltf.parser?.json?.extras) {
          if (!this.userData.extras) this.userData.extras = {};
          Object.assign(this.userData.extras, gltf.parser.json.extras);
        }

        const mat = child.material;
        if (mat) {
          // Only perform legacy assignments if we didn't find a binary buffer heightmap
          if (!heightMap && mat.emissiveMap) heightMap = mat.emissiveMap;
          if (mat.map) colorMap = mat.map;

          if (mat.userData?.extras?.height_encoding) {
            // Keep this for legacy RG16 support if needed, but we override for Binary
          }
        }
      }
    });

    if (isProprietary && this.tileset.templateGeometry) {
      // console.log(`[S2Tile] Applying Proprietary Heightmap to ${this.id}`);

      // const encoding = this.userData.extras?.height_encoding === 'rg16' ? 1 : 0;
      // Force 0 for Float Texture (or Legacy)
      const encoding = 0;

      const material = new S2HeightmapMaterial({
        uHeightMap: { value: heightMap },
        uColorMap: { value: colorMap },
        uMinHeight: { value: minH ?? -10000 },
        uMaxHeight: { value: maxH ?? 10000 },
        uHeightEncoding: { value: encoding },
        // Swizzle Radii for GLTF Y-up scene (X=Eq, Y=Polar, Z=Eq in GLTF space? NO.)
        // ECEF(X, Y, Z) -> GLTF(X, Z, -Y).
        // Radius X (Eq) matches GLTF X.
        // Radius Y (Eq) matches GLTF -Z.
        // Radius Z (Polar) matches GLTF Y.
        // So we pass (Rx, Rz, Ry) to the shader, which calculates spherePos in (x, z, -y) frame.
        // Wait, spherePos * uRadii.
        // spherePos.x is X_eq. uRadii.x should be R_eq.
        // spherePos.y is Z_eq (from North Pole). uRadii.y should be R_polar.
        // spherePos.z is -Y_eq. uRadii.z should be R_eq.
        // Radii Vector: (1738140, 1735970, 1738140)
        uRadii: { value: new THREE.Vector3(1738140, 1735970, 1738140) }, // Fixed Swizzle
        uTileParams: { value: new THREE.Vector4(this.face, this.zoom, this.x, this.y) },
      });

      const mesh = new THREE.Mesh(this.tileset.templateGeometry, material);
      mesh.frustumCulled = false; // Vertex displacement in shader, bounds handled by OBB

      this.sceneObject = mesh;

      // Raycasting Proxy (HitBox)
      // Since the main mesh is displaced in shader, the CPU geometry is only a 1x1 quad at origin.
      // We add a simplified OBB Box mesh for raycasting interactions.
      if (this.obb) {
        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const boxMat = new THREE.MeshBasicMaterial({
          visible: true,
          opacity: 0.0, // Invisible
          transparent: true,
          depthWrite: false, // Don't affect depth buffer
          // depthTest: false // Optional: if we want to hit even if occluded? No, default true is likely safer.
        });
        const hitBox = new THREE.Mesh(boxGeo, boxMat);
        hitBox.userData.tile = this;

        // Apply OBB Transform
        hitBox.position.copy(this.obb.center);
        hitBox.scale.set(this.obb.halfSize.x * 2, this.obb.halfSize.y * 2, this.obb.halfSize.z * 2);

        // Rotation (Matrix3 -> Matrix4)
        const rot4 = new THREE.Matrix4().setFromMatrix3(this.obb.rotation);
        hitBox.setRotationFromMatrix(rot4); // Or quaternion

        mesh.add(hitBox);
        mesh.userData.hitBox = hitBox; // Reference
      }
    } else {
      // Apply Global Scale
      const scale = this.tileset.debug.globalContentScale ?? 1.0;
      object.scale.set(scale, scale, scale);

      object.updateMatrix();
      object.updateMatrixWorld(true);

      this.sceneObject = object;
    }

    if (this.sceneObject) {
      this.sceneObject.userData.tile = this;
      this.state = TILE_STATE.LOADED;

      // Force DoubleSide and Apply Debug Color (if not proprietary)
      if (!isProprietary) {
        this.sceneObject.traverse((child: any) => {
          if (child.isMesh && child.material) {
            child.material.side = THREE.DoubleSide;
            // ... debug color logic ...
          }
        });
      }
    }

    this.tileset.onTileLoaded(this);
    this.updateDebugVisuals(true);
  }

  public updateDebugVisuals(force: boolean = false) {
    const showNormals = this.tileset.debug.showNormals;
    const showOcc = this.tileset.debug.showOccPoints;

    // Debug for Level 0 to 2
    if (this.zoom <= 2 && showOcc) {
      console.log(
        `[Debug LowLvl] ${this.id} updateDebugVisuals. Force=${force}, Show=${showOcc}, Last=${this.lastShowOcc}, OccPoint=${this.occPoint ? JSON.stringify(this.occPoint) : 'null'}`
      );
    }

    if (!force && showNormals === this.lastShowNormals && showOcc === this.lastShowOcc) return;

    this.lastShowNormals = showNormals;
    this.lastShowOcc = showOcc;

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

    // Occlusion Point Visualization
    if (showOcc) {
      if (!this.userData.occHelper && this.occPoint) {
        console.warn(`[Debug] VISIBLE: creating OccHelper Sphere for ${this.id}`);

        // Use a SPHERE instead of Arrow to be absolutely sure it's visible
        const radius = this.occPoint.length() * 0.02; // 2% radius
        const geo = new THREE.SphereGeometry(radius, 8, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.copy(this.occPoint);

        this.tileset.scene.add(mesh);
        this.userData.occHelper = mesh;
      }
    } else {
      if (this.userData.occHelper) {
        this.tileset.scene.remove(this.userData.occHelper);
        const helper = this.userData.occHelper;
        if (helper.geometry) helper.geometry.dispose();
        if (helper.material) helper.material.dispose();
        this.userData.occHelper = undefined;
      }
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

    if (this.sceneObject && (this.sceneObject as THREE.Mesh).material) {
      const mat = (this.sceneObject as THREE.Mesh).material as any;
      if (mat.uniforms) {
        if (mat.uniforms.uSunDirWorld) {
          mat.uniforms.uSunDirWorld.value.copy(this.tileset.sunDirection);
        }
        if (mat.uniforms.uSunIntensity) {
          mat.uniforms.uSunIntensity.value = this.tileset.sunIntensity;
        }
        if (mat.uniforms.uAmbientIntensity) {
          mat.uniforms.uAmbientIntensity.value = this.tileset.ambientIntensity;
        }
        if (mat.uniforms.uDisableHeightmap) {
          mat.uniforms.uDisableHeightmap.value = this.tileset.debug.disableHeightmap;
        }
        if (mat.uniforms.uHeightEncoding) {
          // Check userData from GLTF extras
          const encoding = this.userData.extras?.height_encoding === 'rg16' ? 1 : 0;
          mat.uniforms.uHeightEncoding.value = encoding;
        }
      }
    }
  }

  private getContentUrl(): string {
    // Construct URL based on pattern
    // Assumes standard pattern: content/{face}/{level}_{x}_{y}.glb
    return `${this.tileset.baseUrl}/content/${this.face}/${this.zoom}_${this.x}_${this.y}.glb`;
  }
}
