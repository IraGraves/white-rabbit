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

    this.gui
      .add(this.viewer, 'isFocusMode')
      .name('Focus Mode')
      .onChange((v: boolean) => {
        this.viewer.setFocusMode(v);
      });

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
      .add(this.tileset.debug, 'showNormals')
      .name('Show Normals (Debug)')
      .onChange(() => {
        // Auto-updates in render loop
        this.tileset.update();
      });

    debugFolder
      .add(this.tileset.debug, 'showOccPoints')
      .name('Show OccPointers')
      .onChange(() => {
        // Trigger update
        this.tileset.update();
      });

    debugFolder
      .add(this.tileset.debug, 'enableHorizonCulling')
      .name('Horizon Cull')
      .onChange(() => {
        this.tileset.update();
      });

    debugFolder.add(this.tileset.debug, 'disableHeightmap').name('Disable Heightmap');

    debugFolder
      .add(this.tileset.debug, 'polarUvMode', 0, 8, 1)
      .name('Polar UV Mode (0-8)')
      .onChange((v: number) => {
        // Directly update all materials with the new polar UV mode
        const updateMaterialsRecursive = (tiles: S2Tile[]) => {
          for (const tile of tiles) {
            if (tile.sceneObject) {
              tile.sceneObject.traverse((child: THREE.Object3D) => {
                if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
                  const mat = (child as THREE.Mesh).material as any;
                  if (mat.uniforms && mat.uniforms.uPolarUvMode) {
                    mat.uniforms.uPolarUvMode.value = v;
                  }
                }
              });
            }
            if (tile.children.length > 0) {
              updateMaterialsRecursive(tile.children);
            }
          }
        };
        updateMaterialsRecursive(this.tileset.rootTiles);
      });

    debugFolder
      .add(this.tileset.debug, 'globalContentScale', 0.000001, 2000000.0)
      .name('Scale (Wide Range)')
      .onChange((v: number) => {
        this.updateScaleRecursive(this.tileset.rootTiles, v);
      });

    // Seam Checker
    debugFolder
      .add(
        {
          checkSeams: () => {
            this.tileset.checkSeams();
          },
        },
        'checkSeams'
      )
      .name('Check Seams (Console)');

    debugFolder
      .add(
        {
          logPixels: () => {
            this.tileset.logHeightmapStats();
          },
        },
        'logPixels'
      )
      .name('Log Heightmap Pixels');

    // --- Refinement & Camera ---
    const tuningFolder = this.gui.addFolder('Refinement & Camera');

    tuningFolder.add(this.tileset, 'maxScreenSpaceError', 0, 100).name('Max SSE');

    tuningFolder
      .add(this.tileset, 'maxScreenSpaceErrorHysteresis', 1.0, 2.0, 0.01)
      .name('SSE Hysteresis');

    tuningFolder
      .add(this.tileset.performance, 'guardFrustumRatio', 1.0, 2.0, 0.01)
      .name('Guard Band Ratio');

    tuningFolder
      .add(this.tileset.debug, 'horizonCullSafetyFactor', 1.0, 2.0, 0.01)
      .name('Horizon Safety');

    tuningFolder
      .add(this.viewer, 'adaptiveScalingAltitude', 0, 10000000, 1000)
      .name('Camera Scaling Alt');

    // --- Stats ---
    const statsFolder = this.gui.addFolder('Stats');
    statsFolder.add(this.tileset.stats, 'visible').name('Visible Tiles').listen().disable();
    statsFolder.add(this.tileset.stats, 'loaded').name('Loaded Tiles').listen().disable();
    statsFolder.add(this.tileset.stats, 'refined').name('Refined (Parents)').listen().disable();
    statsFolder.add(this.tileset.stats, 'culledFrustum').name('Frustum Culled').listen().disable();
    statsFolder.add(this.tileset.stats, 'culledHorizon').name('Horizon Culled').listen().disable();
    statsFolder.add(this.tileset.stats, 'culledSSE').name('SSE Reached').listen().disable();

    // Scheduler Stats
    const schedulerFolder = this.gui.addFolder('Scheduler');
    schedulerFolder.add(this.tileset.scheduler.stats, 'queued').name('Queued').listen().disable();
    schedulerFolder.add(this.tileset.scheduler.stats, 'active').name('Active').listen().disable();
    schedulerFolder.close();

    statsFolder.close();

    // --- Persistence ---
    const perfFolder = this.gui.addFolder('Persistence').close();
    perfFolder
      .add(this.tileset.persistence, 'priorityLoadLevel', 0, 5, 1)
      .name('Priority Load Lvl')
      .onChange(() => {
        // Re-trigger load for roots if needed?
        // Actually priority load is mostly for startup.
      });
    perfFolder
      .add(this.tileset.persistence, 'cancellationThreshold', 0, 5, 1)
      .name('Network Persist Lvl');
    perfFolder.add(this.tileset.persistence, 'unloadThreshold', 0, 5, 1).name('Memory Persist Lvl');

    // --- Performance ---
    const perfFolder2 = this.gui.addFolder('Performance').close();
    perfFolder2
      .add(this.tileset.performance, 'maxActiveDownloads', 1, 32, 1)
      .name('Max Downloads')
      .onChange((v: number) => {
        this.tileset.scheduler.setLimit(v);
      });
    perfFolder2
      .add(this.tileset.performance, 'maxCacheSize', 100, 5000, 100)
      .name('Max Cache Size')
      .onChange(() => {
        // Force immediate cleanup attempt
        (this.tileset as any).cleanup();
      });
    perfFolder2
      .add(this.tileset.performance, 'unloadTimeFrames', 60, 3600, 60)
      .name('Unload Time (Frames)');

    // --- Lighting ---
    if (this.viewer.dirLight) {
      const lightFolder = this.gui.addFolder('Lighting').close();
      const sun = this.viewer.dirLight;

      // Intensity
      lightFolder.add(sun, 'intensity', 0, 10, 0.1).name('Sun Intensity');

      if (this.viewer.ambLight) {
        lightFolder.add(this.viewer.ambLight, 'intensity', 0, 5, 0.01).name('Ambient Intensity');
      }

      // Position (Direction)
      lightFolder.add(sun.position, 'x', -100, 100, 1).name('Sun X');
      lightFolder.add(sun.position, 'y', -100, 100, 1).name('Sun Y');
      lightFolder.add(sun.position, 'z', -100, 100, 1).name('Sun Z');
    }

    const mouseFolder = this.gui.addFolder('Mouse Over').close();
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

    // --- Tile Inspector ---
    const inspectorFolder = this.gui.addFolder('Tile Inspector').close();
    const inspector = {
      face: 0,
      zoom: 0,
      x: 0,
      y: 0,
      reason: 'Enter tile coords...',
      frustumCulled: false,
      horizonCulled: false,
      sseMet: false,
      sse: '',
      distCam: '',
      distOcc: '',
      angleCam: '',
      angleOcc: '',
      limit: '',
      theta: '',
      sceneVisible: false,
      isRefined: false,
    };

    inspectorFolder.add(inspector, 'face', 0, 5, 1);
    inspectorFolder.add(inspector, 'zoom', 0, 20, 1);
    inspectorFolder.add(inspector, 'x', 0, 1000000, 1);
    inspectorFolder.add(inspector, 'y', 0, 1000000, 1);

    inspectorFolder.add(inspector, 'reason').name('Status/Reason').listen().disable();
    inspectorFolder.add(inspector, 'frustumCulled').name('Frustum Culled').listen().disable();
    inspectorFolder.add(inspector, 'horizonCulled').name('Horizon Culled').listen().disable();
    inspectorFolder.add(inspector, 'sseMet').name('SSE Met').listen().disable();
    inspectorFolder.add(inspector, 'sse').name('Current SSE').listen().disable();
    inspectorFolder.add(inspector, 'distCam').name('Cam Dist').listen().disable();
    inspectorFolder.add(inspector, 'distOcc').name('Occ Dist').listen().disable();
    inspectorFolder.add(inspector, 'angleCam').name('Cam Angle').listen().disable();
    inspectorFolder.add(inspector, 'angleOcc').name('Occ Angle').listen().disable();
    inspectorFolder.add(inspector, 'limit').name('Limit Angle').listen().disable();
    inspectorFolder.add(inspector, 'theta').name('Actual Angle').listen().disable();
    inspectorFolder.add(inspector, 'sceneVisible').name('In Scene').listen().disable();
    inspectorFolder.add(inspector, 'isRefined').name('Is Refined').listen().disable();

    // Attach to this instance for update
    (this as any).inspector = inspector;
  }

  public update() {
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

    // Update Inspector
    const inspector = (this as any).inspector;
    if (inspector) {
      const res = this.tileset.findTile(inspector.face, inspector.zoom, inspector.x, inspector.y);
      const displayTile = res.tile || res.closest;

      if (displayTile) {
        const status = this.tileset.getTileStatus(displayTile);
        inspector.reason = res.tile ? status.reason : res.reason;
        inspector.frustumCulled = status.frustumCulled;
        inspector.horizonCulled = status.horizonCulled;
        inspector.sseMet = status.sseMet;
        inspector.sse = `${status.sse} / ${status.sseThreshold}`;
        inspector.distCam = status.distCam;
        inspector.distOcc = status.distOcc;
        inspector.angleCam = status.angleCamDeg;
        inspector.angleOcc = status.angleOccDeg;
        inspector.limit = status.limitAngleDeg;
        inspector.theta = status.thetaDeg;
        inspector.sceneVisible = status.sceneVisible;
        inspector.isRefined = status.isRefined;
      } else {
        inspector.reason = res.reason || 'NOT FOUND';
        inspector.frustumCulled = false;
        inspector.horizonCulled = false;
        inspector.sseMet = false;
        inspector.sse = '-';
        inspector.distCam = '-';
        inspector.distOcc = '-';
        inspector.angleCam = '-';
        inspector.angleOcc = '-';
        inspector.limit = '-';
        inspector.theta = '-';
        inspector.sceneVisible = false;
        inspector.isRefined = false;
      }
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
