import * as THREE from 'three';
import { TextureManager } from '../../managers/TextureManager';
import { MoonLODMaterial } from '../../materials/MoonLODMaterial';
import { MoonNode } from './MoonNode';

export class MoonQuadtree {
  private rootNodes: MoonNode[] = [];
  private group: THREE.Group;
  private textureManager: TextureManager;
  private material: MoonLODMaterial;
  private radius: number;
  private maxZoom: number = 5;

  // LRO WAC Global Dimensions
  private static readonly GLOBAL_WIDTH = 23040;
  private static readonly GLOBAL_HEIGHT = 11520;
  private static readonly TILE_SIZE = 512;

  constructor(textureManager: TextureManager, material: MoonLODMaterial, radius: number) {
    this.textureManager = textureManager;
    this.material = material;
    this.radius = radius;

    this.group = new THREE.Group();
    this.group.name = 'MoonQuadtree';

    this.initRootNodes();
  }

  private initRootNodes(): void {
    // Calculate Level 0 Grid
    const factor = Math.pow(2, this.maxZoom); // Factor for Level 0 (Z=0)
    // Actually, script uses factor = 2^(MAX - z). At z=0, factor = 2^5 = 32.

    // Level 0 Dimensions
    const levelW = Math.ceil(MoonQuadtree.GLOBAL_WIDTH / factor);
    const levelH = Math.ceil(MoonQuadtree.GLOBAL_HEIGHT / factor);

    const cols = Math.ceil(levelW / MoonQuadtree.TILE_SIZE);
    const rows = Math.ceil(levelH / MoonQuadtree.TILE_SIZE);

    console.log(
      `MoonQuadtree Init: Level 0 Grid: ${cols}x${rows} (Level Dim: ${levelW}x${levelH}, Factor: ${factor})`
    );

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Calculate UV Bounds for this Root Node
        // uMin = (x * TILE) / levelW
        const uMin = (x * MoonQuadtree.TILE_SIZE) / levelW;
        const uMax = Math.min((x + 1) * MoonQuadtree.TILE_SIZE, levelW) / levelW;

        const vMin = (y * MoonQuadtree.TILE_SIZE) / levelH;
        const vMax = Math.min((y + 1) * MoonQuadtree.TILE_SIZE, levelH) / levelH;

        this.rootNodes.push(
          new MoonNode(
            x,
            y,
            0, // Level 0
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
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  public update(camera: THREE.Camera): void {
    this.rootNodes.forEach((node) => {
      // Ensure root meshes are in group if not split
      node.update(camera, this.group);
    });
  }

  public setGlobalTexture(texture: THREE.Texture): void {
    this.rootNodes.forEach((node) => node.setGlobalTexture(texture));
  }

  public setSunDirection(direction: THREE.Vector3): void {
    this.rootNodes.forEach((node) => node.setSunDirection(direction));
  }
}
