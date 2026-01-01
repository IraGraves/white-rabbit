import * as THREE from 'three';
import type { TextureManager } from '../../managers/TextureManager';
import type { MoonLODMaterial } from '../../materials/MoonLODMaterial';
import { config } from '../../config';

export class MoonNode {
  public mesh: THREE.Mesh | null = null;
  public children: MoonNode[] = [];
  public isSplit: boolean = false;
  public isTextureLoaded: boolean = false;

  // Tile Coordinates
  public x: number;
  public y: number;
  public z: number; // Zoom Level

  // UV Bounds (Global 0..1)
  public uMin: number;
  public uMax: number;
  public vMin: number;
  public vMax: number;

  // Geometry Bounds (Lat/Long in Radians)
  public phiStart: number;
  public phiLength: number;
  public thetaStart: number;
  public thetaLength: number;

  private material: MoonLODMaterial;
  private textureManager: TextureManager;
  private radius: number;

  constructor(
    x: number,
    y: number,
    z: number,
    uMin: number,
    uMax: number,
    vMin: number,
    vMax: number,
    baseMaterial: MoonLODMaterial,
    textureManager: TextureManager,
    radius: number
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.uMin = uMin;
    this.uMax = uMax;
    this.vMin = vMin;
    this.vMax = vMax;
    this.textureManager = textureManager;
    this.radius = radius;

    // Clone Material for this specific tile
    this.material = baseMaterial.clone();

    // Configure Material for UV Mapping
    this.material.uniforms.uUVOffset.value.set(uMin, vMin);
    this.material.uniforms.uUVScale.value.set(uMax - uMin, vMax - vMin);

    // Calculate Sphere Geometry Parameters
    // Three.js Sphere:
    // phi: Horizontal (0..2PI) -> Matches U (0..1)
    // theta: Vertical (0..PI) -> Matches V (1..0) [Inverse!]
    // Wait, Three.js V usually starts bottom (0) to top (1).
    // SphereGeometry: thetaStart=0 (Top/North), thetaLength=PI (Bottom/South).
    // So V=1 is Top, V=0 is Bottom.

    // Map U (0..1) to Phi (0..2PI)
    // Map U=0 -> Phi=PI/2 (Prime Meridian? No default is back).
    // We already handled rotation of the root mesh, so we can assume standard mapping relative to that.

    this.phiStart = uMin * Math.PI * 2;
    this.phiLength = (uMax - uMin) * Math.PI * 2;

    // Map V (0..1) to Theta (PI..0) -> Inverted
    // vMin (Bottom) -> thetaMax
    // vMax (Top) -> thetaMin
    // Theta = (1 - v) * PI

    const thetaTop = (1 - vMax) * Math.PI; // Top edge of tile
    const thetaBot = (1 - vMin) * Math.PI; // Bottom edge of tile

    this.thetaStart = thetaTop;
    this.thetaLength = thetaBot - thetaTop;
  }

  public createMesh(): void {
    if (this.mesh) return;

    // Create Geometry Chunk

    // Create Geometry Chunk
    // Segments depend on LOD level? Or fixed?
    // Let's perform a simple segments calculation: 16 -> 32 -> 64
    const segments = 32;

    const geometry = new THREE.SphereGeometry(
      this.radius,
      segments,
      segments,
      this.phiStart,
      this.phiLength,
      this.thetaStart,
      this.thetaLength
    );

    this.mesh = new THREE.Mesh(geometry, this.material);

    // Constants (Must match MoonQuadtree)
    const MAX_ZOOM = 5;
    const GLOBAL_WIDTH = 23040;
    const GLOBAL_HEIGHT = 11520;

    const factor = 2 ** (MAX_ZOOM - this.z);
    const levelW = Math.ceil(GLOBAL_WIDTH / factor);
    const levelH = Math.ceil(GLOBAL_HEIGHT / factor);

    // Calculate LOGICAL pixel dimensions of this tile coverage
    // This is how many pixels of valid content *should* be in this tile
    const validPixelWidth = (this.uMax - this.uMin) * levelW;
    const validPixelHeight = (this.vMax - this.vMin) * levelH;

    // Load Texture
    const texturePath = `${import.meta.env.BASE_URL}assets/textures/LOD/moon/${this.z}/${this.x}/${this.y}.ktx2`;
    this.textureManager.loadKTX2Direct(texturePath, this.material, 'uTileTexture', () => {
      this.isTextureLoaded = true;

      // Dynamic Scale Logic:
      // We check the ACTUAL dimensions of the loaded texture.
      // 1. If texture is 208px wide and validPixelWidth is ~208, scale = 1.0. (Cropped)
      // 2. If texture is 256px wide (POT padded) and valid is 208, scale = 0.8125. (Padded)
      // 3. If texture is 512px wide (Tile padded) and valid is 208, scale = 0.406. (Padded)

      const texture = this.material.uniforms.uTileTexture.value;
      if (texture?.image) {
        const texW = texture.image.width;
        const texH = texture.image.height;

        const scaleX = validPixelWidth / texW;
        const scaleY = validPixelHeight / texH;

        // Clamp to 1.0 max to be safe
        this.material.uniforms.uTileUVScale.value.set(Math.min(scaleX, 1.0), Math.min(scaleY, 1.0));
      }
    });

    // Default to 1.0 until loaded
    this.material.uniforms.uTileUVScale.value.set(1.0, 1.0);
  }

  public dispose(): void {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh = null;
    }

    // Material is cloned, we must dispose it to prevent leak of the Material object itself.
    // BUT the uTileTexture is now managed by TextureManager Cache, so we DO NOT dispose the texture.
    this.material.dispose();

    this.children.forEach((c) => {
      c.dispose();
    });
    this.children = [];
    this.isSplit = false;
    this.isTextureLoaded = false;
  }

  public split(): void {
    if (this.isSplit) return;

    const nextZ = this.z + 1;

    // Constants (Must match MoonQuadtree)
    const MAX_ZOOM = 5;
    const GLOBAL_WIDTH = 23040;
    const GLOBAL_HEIGHT = 11520;
    const TILE_SIZE = 512;

    const factor = 2 ** (MAX_ZOOM - nextZ);
    // Level Dimensions
    const levelW = Math.ceil(GLOBAL_WIDTH / factor);
    const levelH = Math.ceil(GLOBAL_HEIGHT / factor);

    const nextCols = Math.ceil(levelW / TILE_SIZE);
    const nextRows = Math.ceil(levelH / TILE_SIZE);

    // Calculate Children based on Grid
    // Parent x,y -> Children 2x, 2y ...
    const startX = this.x * 2;
    const startY = this.y * 2;

    // Create 4 potential children
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const childX = startX + dx;
        const childY = startY + dy;

        // Validity Check
        if (childX >= nextCols || childY >= nextRows) continue;

        // Calculate UV Bounds
        const uMin = (childX * TILE_SIZE) / levelW;
        const uMax = Math.min((childX + 1) * TILE_SIZE, levelW) / levelW;

        const vMin = (childY * TILE_SIZE) / levelH;
        const vMax = Math.min((childY + 1) * TILE_SIZE, levelH) / levelH;

        this.children.push(
          new MoonNode(
            childX,
            childY,
            nextZ,
            uMin,
            uMax,
            vMin,
            vMax,
            this.material,
            this.textureManager,
            this.radius
          )
        );
      }
    }

    this.isSplit = true;

    // Hide own mesh?
    // Typically yes, we hide parent and show children.
    if (this.mesh) this.mesh.visible = false;

    // Create meshes for children?
    // Or wait for update?
    // Let's wait for update to call createMesh on visible nodes.
  }

  public update(camera: THREE.Camera, group: THREE.Group): void {
    // 1. Check Distance
    // Calculate distance from center of this tile to camera
    // Center point on sphere surface?
    // Using lat/long center:
    const midPhi = this.phiStart + this.phiLength / 2;
    const midTheta = this.thetaStart + this.thetaLength / 2;

    const centerPos = new THREE.Vector3().setFromSphericalCoords(this.radius, midTheta, midPhi);
    // Apply rotation fix if it exists on the parent group?
    // Actually our node mesh is local.
    // But we need World Distance.
    // Assume `group` has the rotation/position.
    const worldCenter = centerPos.clone().applyMatrix4(group.matrixWorld);

    const dist = camera.position.distanceTo(worldCenter);

    // Split Threshold (Simple Heuristic for now)
    // Level 0: 40000 km
    // Level 1: 20000 km
    // ...
    // Using simple factor: radius * 3 / (2^z)
    // IMPORTANT: Scale by planetScale because 'dist' is in scaled world units!
    // We compare World Distance (scaled) vs Splitting Threshold (should be scaled too)
    // Start with factor 2.0.
    const splitDist = (this.radius * config.planetScale * 4.0 * 2.0) / 2 ** this.z;

    // TEMPORARY: Disable splitting beyond Level 0 to avoid missing tile errors
    // The generated tile grid (6x3 at Z=2) does not match standard Quadtree doubling.
    // We need to implement adaptive grid logic later.
    const MAX_LOD_LEVEL = 5;

    if (dist < splitDist && this.z < MAX_LOD_LEVEL) {
      // Max Zoom 5
      if (!this.isSplit) {
        this.split();
      }

      // Check if children are ready to be shown
      let allDirectChildrenLoaded = true;

      this.children.forEach((c) => {
        c.createMesh(); // triggers load
        if (c.mesh && !c.mesh.parent) group.add(c.mesh);

        // If texture not loaded, we aren't ready
        if (!c.isTextureLoaded) allDirectChildrenLoaded = false;
      });

      if (allDirectChildrenLoaded) {
        // Ready! Switch to children.

        // Hide Self
        if (this.mesh) this.mesh.visible = false;

        // Update Children (allows them to show themselves and potentially split further)
        this.children.forEach((c) => {
          // c.mesh.visible might be managed by c.update(), but we ensure base visibility logic
          // usually update() sets visibility based on its own split state.
          // But we need to ensure they start visible if they are the leaf.
          c.update(camera, group);
        });
      } else {
        // Not Ready! Keep Self.

        // Show Self
        this.createMesh();
        if (this.mesh) {
          if (!this.mesh.parent) group.add(this.mesh);
          this.mesh.visible = true;
        }

        // Hide Children (but keep them loading)
        // CRITICAL: We do NOT call c.update() here. This prevents grandchildren trigger.
        // This acts as a bandwidth throttle.
        this.children.forEach((c) => {
          if (c.mesh) c.mesh.visible = false;
        });
      }
    } else {
      // Unsplit / Merge if we moved away
      if (this.isSplit) {
        this.dispose(); // Merge: Destroy children
      }

      // Show Self
      this.createMesh();
      if (this.mesh) {
        if (!this.mesh.parent) group.add(this.mesh);
        this.mesh.visible = true;
      }
    }
  }

  public setGlobalTexture(texture: THREE.Texture): void {
    if (this.material.uniforms.uGlobalTexture) {
      this.material.uniforms.uGlobalTexture.value = texture;
      this.material.needsUpdate = true;
    }
    this.children.forEach((c) => {
      c.setGlobalTexture(texture);
    });
  }

  public setSunDirection(direction: THREE.Vector3): void {
    if (this.material.uniforms.uSunDirection) {
      this.material.uniforms.uSunDirection.value.copy(direction);
    }
    this.children.forEach((c) => {
      c.setSunDirection(direction);
    });
  }
}
