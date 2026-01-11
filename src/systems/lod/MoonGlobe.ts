import * as THREE from 'three';
import { TilesRenderer } from '3d-tiles-renderer';
// @ts-ignore
import { QuantizedMeshPlugin } from '3d-tiles-renderer/src/three/plugins/QuantizedMeshPlugin.js';
import { S2TilesRenderer } from './S2TilesRenderer';

import type { TextureManager } from '../../managers/TextureManager';

export interface MoonGlobeOptions {
  renderer: THREE.WebGLRenderer;
  radius: number;
  textureManager: TextureManager;
  scene: THREE.Object3D;
}

export class MoonGlobe {
  public readonly meshGroup: THREE.Group;
  private tilesRenderer: TilesRenderer | null = null;
  private renderer: THREE.WebGLRenderer;
  private rootScene: THREE.Object3D;
  private _lastLog = 0;

  public static readonly MOON_RADIUS_METERS = 1737100;
  private static readonly EARTH_RADIUS = 6378137;

  constructor(options: MoonGlobeOptions) {
    const { radius, renderer, scene: rootScene } = options;
    this.renderer = renderer;
    this.rootScene = rootScene;

    this.meshGroup = new THREE.Group();
    this.meshGroup.name = 'MoonGlobe';

    // Scale group to match scene units
    const scale = radius / MoonGlobe.MOON_RADIUS_METERS;
    this.meshGroup.scale.setScalar(scale);

    console.warn(`🌕 [MOON] Initializing MoonGlobe. Scale: ${scale} (R=${radius})`);
    this.meshGroup.rotation.x = -Math.PI / 2;

    this.initRenderer();
  }

  private initRenderer() {
    const basePath = import.meta.env.BASE_URL || '/';
    const tilesetUrl = `${basePath}moon-tileset.json`;

    console.warn(`🌕 [MOON] Loading Tileset from: ${tilesetUrl}`);

    console.warn(`🌕 [MOON] Loading Tileset from: ${tilesetUrl}`);

    const renderer = new S2TilesRenderer(tilesetUrl, MoonGlobe.MOON_RADIUS_METERS);
    this.tilesRenderer = renderer;

    renderer.errorTarget = 10;
    renderer.lruCache.minSize = 2500;
    renderer.lruCache.maxSize = 3500;

    const plugin = new QuantizedMeshPlugin();
    renderer.registerPlugin(plugin);

    if ((plugin as any).loader) {
      const loader = (plugin as any).loader;
      loader.ellipsoid = {
        radius: new THREE.Vector3(
          MoonGlobe.MOON_RADIUS_METERS,
          MoonGlobe.MOON_RADIUS_METERS,
          MoonGlobe.MOON_RADIUS_METERS
        ),
        getCartographicToPosition: function (
          lat: number,
          lon: number,
          height: number,
          target: THREE.Vector3
        ) {
          const r = MoonGlobe.MOON_RADIUS_METERS + height;
          target.set(
            r * Math.cos(lat) * Math.cos(lon),
            r * Math.cos(lat) * Math.sin(lon),
            r * Math.sin(lat)
          );
          return target;
        },
      };
    }

    const texLoader = new THREE.TextureLoader();

    // @ts-ignore
    renderer.onLoadModel = (sceneTile, tile) => {
      const uri = tile.content ? tile.content.uri : null;
      let textureApplied = false;

      sceneTile.traverse((obj: any) => {
        if (obj.isMesh) {
          this.patchGeometry(obj.geometry);
          this.analyzeGeometry(obj.geometry);

          // BLUE Wireframe for Main App
          if (!obj.userData.wireframe) {
            const wiregeo = new THREE.WireframeGeometry(obj.geometry);
            const wire = new THREE.LineSegments(
              wiregeo,
              new THREE.LineBasicMaterial({
                color: 0x0000ff,
                transparent: true,
                opacity: 0.5,
                depthTest: false,
              })
            );
            obj.add(wire);
            obj.userData.wireframe = true;
          }

          if (uri) {
            const match = uri.match(/\/(\d+)\/(\d+)\/(\d+)\.terrain/);
            if (match) {
              let [, zStr, xStr, yStr] = match;
              let z = parseInt(zStr);
              let x = parseInt(xStr);
              let y = parseInt(yStr);

              const imgZ = z + 1;
              const textureUrl = `/assets/textures/LOD/moon/imagery/${imgZ}/${x}/${y}.png`;

              if (obj.userData.textureUrl !== textureUrl) {
                obj.userData.textureUrl = textureUrl;
                texLoader.load(
                  textureUrl,
                  (tex) => {
                    tex.colorSpace = THREE.SRGBColorSpace;
                    obj.material = new THREE.MeshStandardMaterial({
                      map: tex,
                      roughness: 1.0,
                      metalness: 0.0,
                      side: THREE.DoubleSide,
                    });
                  },
                  undefined,
                  (err) => {
                    obj.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
                  }
                );
              }
              textureApplied = true;
            }
          }

          if (!textureApplied) {
            obj.material = new THREE.MeshStandardMaterial({
              color: 0x888888,
              roughness: 0.9,
              metalness: 0.1,
              side: THREE.DoubleSide,
            });
          }

          obj.frustumCulled = false;
        }
      });
    };

    // @ts-ignore
    renderer.onDownloadError = (err: any) => {};
    this.meshGroup.add(renderer.group);
  }

  private analyzeGeometry(geom: THREE.BufferGeometry) {
    const pos = geom.attributes.position;
    if (!pos) return;

    let minR = Infinity;
    let maxR = -Infinity;
    const vertexCount = pos.count;

    const v = new THREE.Vector3();
    for (let i = 0; i < vertexCount; i++) {
      v.fromBufferAttribute(pos, i);
      const r = v.length();
      if (r < minR) minR = r;
      if (r > maxR) maxR = r;
    }

    const delta = maxR - minR;
    const isEarthScale = minR > 6000000;
    console.warn(
      `📊 MAIN APP TILE: Verts=${vertexCount}, Range=${minR.toFixed(0)}->${maxR.toFixed(0)} (Δ${delta.toFixed(0)}m)`
    );
  }

  private patchGeometry(geom: THREE.BufferGeometry) {
    if (!geom.boundingSphere) geom.computeBoundingSphere();
    if (!geom.boundingSphere) return;

    const center = geom.boundingSphere.center;

    if (center.length() > 5000000) {
      const posAttr = geom.attributes.position;
      const vec = new THREE.Vector3();

      for (let i = 0; i < posAttr.count; i++) {
        vec.fromBufferAttribute(posAttr, i);
        const len = vec.length();
        const h = len - MoonGlobe.EARTH_RADIUS;
        const newLen = MoonGlobe.MOON_RADIUS_METERS + h;

        vec.normalize().multiplyScalar(newLen);
        posAttr.setXYZ(i, vec.x, vec.y, vec.z);
      }
      posAttr.needsUpdate = true;
      geom.computeVertexNormals();
      geom.computeBoundingSphere();
    } else {
      geom.computeVertexNormals();
    }
  }

  public update(camera: THREE.Camera): void {
    if (!this.tilesRenderer) return;

    this.tilesRenderer.setCamera(camera);
    this.tilesRenderer.setResolutionFromRenderer(camera, this.renderer);
    this.tilesRenderer.update();

    // Polling Patch: Ensures geometry and textures are applied even if onLoadModel misses
    this._scanAndPatchTiles();
  }

  private _scanAndPatchTiles() {
    if (!this.tilesRenderer) return;

    const texLoader = new THREE.TextureLoader(); // Scope might be inefficient, ideally cache in class
    // Uses the class's texLoader if available, or create new.
    // To save re-creating, let's assume valid scope or just do pure geometry first.
    // Actually, we need to access the texturing logic.

    // Let's iterate visible tiles
    // @ts-ignore
    this.tilesRenderer.visibleTiles.forEach((tile: any) => {
      const scene = tile.cached.scene;
      if (scene) {
        const uri = tile.content ? tile.content.uri : '';

        scene.traverse((obj: any) => {
          if (obj.isMesh) {
            if (obj.userData.processed) return;

            // 1. Analyze / Debug Stats
            this.analyzeGeometry(obj.geometry);

            // 2. Patch Geometry
            this.patchGeometry(obj.geometry);

            // 3. Apply Texture
            if (uri) {
              const match = uri.match(/\/(\d+)\/(\d+)\/(\d+)\.terrain/);
              if (match) {
                let [, zStr, xStr, yStr] = match;
                let z = parseInt(zStr);
                let x = parseInt(xStr);
                let y = parseInt(yStr);
                const imgZ = z + 1;
                const textureUrl = `/assets/textures/LOD/moon/imagery/${imgZ}/${x}/${y}.png`;

                if (obj.userData.textureUrl !== textureUrl) {
                  obj.userData.textureUrl = textureUrl;
                  new THREE.TextureLoader().load(
                    textureUrl,
                    (tex) => {
                      tex.colorSpace = THREE.SRGBColorSpace;
                      obj.material = new THREE.MeshStandardMaterial({
                        map: tex,
                        roughness: 1.0,
                        metalness: 0.0,
                        side: THREE.DoubleSide,
                      });
                    },
                    undefined,
                    () => {
                      obj.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
                    }
                  );
                }
              }
            }

            // 4. Debug Wireframe (Blue)
            if (!obj.userData.wireframe) {
              const wiregeo = new THREE.WireframeGeometry(obj.geometry);
              const wire = new THREE.LineSegments(
                wiregeo,
                new THREE.LineBasicMaterial({
                  color: 0x0000ff,
                  transparent: true,
                  opacity: 0.5,
                  depthTest: false,
                })
              );
              obj.add(wire);
              obj.userData.wireframe = true;
            }

            obj.userData.processed = true;
          }
        });
      }
    });
  }

  public setSunDirection(direction: THREE.Vector3) {}

  public getGroup(): THREE.Group {
    return this.meshGroup;
  }

  public dispose(): void {
    if (this.tilesRenderer) {
      this.tilesRenderer.dispose();
      this.tilesRenderer = null;
    }
    this.meshGroup.clear();
    console.log('🌕 [MOON] Disposed');
  }
}
