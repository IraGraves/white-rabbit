import GUI from 'lil-gui';
import * as THREE from 'three';
import type { S2Tile } from '../../core/tiles/S2Tile';
import type { S2Tileset } from '../../core/tiles/S2Tileset';
import type { Viewer } from './Viewer';

export class Interface {
  private gui: GUI;
  private tileset: S2Tileset;
  private viewer: Viewer;
  private mouseInfo = { face: -1, zoom: -1, x: -1, y: -1 };

  constructor(tileset: S2Tileset, viewer: Viewer) {
    this.tileset = tileset;
    this.viewer = viewer;
    this.gui = new GUI({ title: 'S2 Viewer' });

    this.init();
  }

  private init() {
    const debugFolder = this.gui.addFolder('Debug').close();

    debugFolder
      .add(this.tileset.debug, 'showBoundingBoxes')
      .name('Show Bounds')
      .onChange(() => {
        // Trigger update to refresh visibility
        // We might need a force update method or just wait for next frame loop
        this.tileset.update();
      });

    if (this.viewer.refSphere) {
      debugFolder.add(this.viewer.refSphere, 'visible').name('Show Sphere Mesh');
    }

    debugFolder
      .add(this.tileset.debug, 'wireframe')
      .name('Wireframe')
      .onChange(() => {
        // Iterate all loaded tiles and update material
        this.updateWireframeRecursive(this.tileset.rootTiles);
      });

    debugFolder
      .add(this.tileset.debug, 'colorByLevel')
      .name('Color by Level')
      .onChange(() => {
        this.updateColorRecursive(this.tileset.rootTiles);
      });

    debugFolder
      .add(this.tileset.debug, 'globalContentScale', 0.000001, 2000000.0)
      .name('Scale (Wide Range)')
      .onChange((v: number) => {
        this.updateScaleRecursive(this.tileset.rootTiles, v);
      });

    const statsFolder = this.gui.addFolder('Stats');
    statsFolder.add(this.tileset.stats, 'loaded').name('Loaded Tiles').listen().disable();
    statsFolder.add(this.tileset.stats, 'visible').name('Visible Tiles').listen().disable();
    statsFolder.add(this.tileset.stats, 'culledHorizon').name('Horizon Culled').listen().disable();
    statsFolder.add(this.tileset, 'maxScreenSpaceError', 0, 100).name('Max SSE');

    const mouseFolder = this.gui.addFolder('Mouse Over');
    this.mouseInfo = {
      face: -1,
      zoom: -1,
      x: -1,
      y: -1,
    };
    mouseFolder.add(this.mouseInfo, 'face').name('Face').listen().disable();
    mouseFolder.add(this.mouseInfo, 'zoom').name('Level').listen().disable();
    mouseFolder.add(this.mouseInfo, 'x').name('X').listen().disable();
    mouseFolder.add(this.mouseInfo, 'y').name('Y').listen().disable();

    this.createStatsOverlay();
  }

  private statsDiv: HTMLDivElement | null = null;

  private createStatsOverlay() {
    this.statsDiv = document.createElement('div');
    this.statsDiv.style.position = 'absolute';
    this.statsDiv.style.top = '10px';
    this.statsDiv.style.left = '10px';
    this.statsDiv.style.color = 'white';
    this.statsDiv.style.background = 'rgba(0, 0, 0, 0.6)';
    this.statsDiv.style.padding = '8px';
    this.statsDiv.style.fontFamily = 'monospace';
    this.statsDiv.style.fontSize = '14px';
    this.statsDiv.style.pointerEvents = 'none';
    this.statsDiv.style.userSelect = 'none';
    this.statsDiv.style.zIndex = '1000';
    document.body.appendChild(this.statsDiv);
  }

  public update() {
    if (this.statsDiv && this.tileset) {
      this.statsDiv.innerText = `Visible: ${this.tileset.stats.visible}\nLoaded:  ${this.tileset.stats.loaded}\nCulled:  ${this.tileset.stats.culledHorizon}`;
    }

    if (this.viewer.hoveredTile) {
      const tile = this.viewer.hoveredTile;
      this.mouseInfo.face = tile.face;
      this.mouseInfo.zoom = tile.zoom;
      this.mouseInfo.x = tile.x;
      this.mouseInfo.y = tile.y;
    } else {
      this.mouseInfo.face = -1;
      this.mouseInfo.zoom = -1;
      this.mouseInfo.x = -1;
      this.mouseInfo.y = -1;
    }
  }

  private updateWireframeRecursive(tiles: S2Tile[]) {
    for (const tile of tiles) {
      if (tile.sceneObject) {
        // Apply Wireframe
        tile.sceneObject.traverse((obj: THREE.Object3D) => {
          if ((obj as THREE.Mesh).isMesh && (obj as THREE.Mesh).material) {
            const mesh = obj as THREE.Mesh;
            // Handle array of materials or single
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m: THREE.Material) => {
                const mat = m as THREE.MeshStandardMaterial;
                mat.wireframe = this.tileset.debug.wireframe;
              });
            } else {
              (mesh.material as THREE.MeshStandardMaterial).wireframe =
                this.tileset.debug.wireframe;
            }
          }
        });
      }
      if (tile.children.length > 0) {
        this.updateWireframeRecursive(tile.children);
      }
    }
  }

  private updateScaleRecursive(tiles: S2Tile[], scale: number) {
    for (const tile of tiles) {
      if (tile.sceneObject) {
        tile.sceneObject.scale.set(scale, scale, scale);
        tile.sceneObject.updateMatrix();
        tile.sceneObject.updateMatrixWorld(true);
      }
      if (tile.children.length > 0) {
        this.updateScaleRecursive(tile.children, scale);
      }
    }
  }

  private updateColorRecursive(tiles: S2Tile[]) {
    for (const tile of tiles) {
      if (tile.sceneObject) {
        tile.sceneObject.traverse((obj: THREE.Object3D) => {
          if ((obj as THREE.Mesh).isMesh && (obj as THREE.Mesh).material) {
            const mesh = obj as THREE.Mesh;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

            materials.forEach((m: THREE.Material) => {
              const mat = m as THREE.MeshStandardMaterial;
              if (!mat.userData.originalColor) {
                mat.userData.originalColor = mat.color
                  ? mat.color.clone()
                  : new THREE.Color(1, 1, 1);
              }
              const level = tile.zoom;
              if (this.tileset.debug.colorByLevel) {
                if (level === 0) mat.color.setHex(0xff0000);
                else if (level === 1) mat.color.setHex(0x00ff00);
                else if (level === 2) mat.color.setHex(0x0000ff);
                else if (level === 3) mat.color.setHex(0xffff00);
                else mat.color.setHex(0xffffff);
              } else {
                mat.color.copy(mat.userData.originalColor);
              }
            });
          }
        });
      }
      if (tile.children.length > 0) {
        this.updateColorRecursive(tile.children);
      }
    }
  }
}
