import { TilesRenderer } from '3d-tiles-renderer';
import { Vector3, Matrix4, Box3, Sphere } from 'three';
import { S2Geometry } from '../../utils/S2Geometry';
import * as THREE from 'three';

// Registry to track S2 tile data by face and coordinates
// Key format: "face_zoom_x_y", value: { zoom, x, y, minH, maxH, childCounter }
type S2TileRegistry = Map<
  string,
  { zoom: number; x: number; y: number; minH: number; maxH: number; childCounter: number }
>;

export class S2TilesRenderer extends TilesRenderer {
  public ellipsoidRadii: number[] = [1737400, 1737400, 1737400];
  public onLoadModel?: (scene: THREE.Object3D, tile: unknown) => void;
  public onDownloadError?: (err: unknown) => void;

  // Registry to track S2 tile coordinates since library doesn't pass correct parent references
  private _s2Registry: S2TileRegistry = new Map();

  constructor(url: string, moonRadius: number = 1737400) {
    super(url);
    this.ellipsoidRadii = [moonRadius, moonRadius, moonRadius];
  }

  // Override preprocessNode to inject S2 Bounding Volume logic
  // @ts-ignore
  public preprocessNode(tile: any, tileJson: any, parentTile: any) {
    // RECURSION DEBUG BRAKE
    // @ts-ignore
    if (!window.s2PreprocessCount) window.s2PreprocessCount = 0;
    // @ts-ignore
    if (window.s2PreprocessCount > 200) {
      console.warn('S2TilesRenderer: Preprocess Limit Reached!');
      return;
    }
    // @ts-ignore
    window.s2PreprocessCount++;
    // @ts-ignore
    console.log(
      `[RecursionDebug] #${window.s2PreprocessCount} URI: ${tile.content ? tile.content.uri : 'null'} Depth: ${tile.depth} __Depth: ${tile.__depth}`
    );

    // @ts-ignore
    console.log(
      `[BaseDebug] Pre-super preprocess for depth ${tile.depth}. basePath type: ${typeof tile.basePath}`,
      tile.basePath
    );

    // @ts-ignore
    super.preprocessNode(tile, tileJson, parentTile);

    // @ts-ignore
    console.log(
      `[BaseDebug] Post-super preprocess for depth ${tile.depth}. basePath type: ${typeof tile.basePath}`,
      tile.basePath
    );

    // [FIX] Ensure basePath is a valid absolute URL.
    // 3d-tiles-renderer might set a relative basePath (e.g. "./tiles_out/") which causes
    // "Invalid base URL" errors in the URL constructor later.
    // @ts-ignore
    if (tile.basePath) {
      // @ts-ignore
      if (typeof tile.basePath !== 'string') {
        console.warn(
          `S2TilesRenderer: basePath is NOT a string! Type: ${typeof tile.basePath}. Discarding and using root.`,
          tile.basePath
        );
        // @ts-ignore
        // Fallback to calculating from rootURL.
        const rootUrlAbsolute = new URL(this.rootURL || 'tileset.json', document.baseURI).href;
        // @ts-ignore
        tile.basePath = new URL('.', rootUrlAbsolute).href;
      } else {
        try {
          // @ts-ignore
          new URL('test', tile.basePath);
        } catch (e) {
          console.warn(
            `S2TilesRenderer: Invalid basePath detected: ${tile.basePath}. Resolving against ${document.baseURI}`
          );
          // @ts-ignore
          tile.basePath = new URL(tile.basePath, document.baseURI).href;
          // @ts-ignore
          console.log(
            `S2TilesRenderer: Resolved relative basePath to absolute -> ${tile.basePath}`
          );
        }
      }
    }
    // [FIX] Also sanitize internal __basePath if it exists
    // @ts-ignore
    if (tile.__basePath) {
      // @ts-ignore
      if (typeof tile.__basePath !== 'string') {
        // @ts-ignore
        tile.__basePath = undefined;
      } else {
        try {
          // @ts-ignore
          new URL('test', tile.__basePath);
        } catch (e) {
          // @ts-ignore
          tile.__basePath = new URL(tile.__basePath, document.baseURI).href;
        }
      }
    }

    let s2Face = -1;
    let s2X = 0;
    let s2Y = 0;
    let s2Zoom = 0;
    let minH = -10000;
    let maxH = 10000;

    let isS2 = false;

    // 1. Explicit S2 Extension (Root Face Nodes or explicit children)
    if (tileJson?.extensions?.['3DTILES_bounding_volume_S2']) {
      const s2Data = tileJson.extensions['3DTILES_bounding_volume_S2'];
      console.log('S2TilesRenderer: Found S2 Extension in Root', s2Data);
      const token = s2Data.token;
      const firstChar = token[0];
      switch (firstChar) {
        case '1':
          s2Face = 0;
          break;
        case '3':
          s2Face = 1;
          break;
        case '5':
          s2Face = 2;
          break;
        case '7':
          s2Face = 3;
          break;
        case '9':
          s2Face = 4;
          break;
        case 'b':
          s2Face = 5;
          break;
      }
      s2Zoom = 0;
      s2X = 0;
      s2Y = 0;
      minH = s2Data.minimumHeight;
      maxH = s2Data.maximumHeight;
      isS2 = true;
    } else if (tileJson?.boundingVolume?.extensions?.['3DTILES_bounding_volume_S2']) {
      const s2Data = tileJson.boundingVolume.extensions['3DTILES_bounding_volume_S2'];
      console.log('S2TilesRenderer: Found S2 Extension in BoundingVolume', s2Data);
      const token = s2Data.token;
      const firstChar = token[0];
      switch (firstChar) {
        case '1':
          s2Face = 0;
          break;
        case '3':
          s2Face = 1;
          break;
        case '5':
          s2Face = 2;
          break;
        case '7':
          s2Face = 3;
          break;
        case '9':
          s2Face = 4;
          break;
        case 'b':
          s2Face = 5;
          break;
      }
      s2Zoom = 0;
      s2X = 0;
      minH = s2Data.minimumHeight;
      maxH = s2Data.maximumHeight;
      isS2 = true;

      // WORKAROUND: Manually generate implicit children for S2 roots
      // 3d-tiles-renderer v0.4.19 fails to expand implicit tiling for S2 roots.
      // We explicitly create the 4 quadtree children here.
      if (tileJson.implicitTiling) {
        console.log(`S2TilesRenderer: Manually expanding implicit children for Face ${s2Face}`);

        if (!tileJson.children) tileJson.children = [];

        const nextZoom = 1; // Since we are at root (zoom 0)
        const childGeonetricError = tileJson.geometricError ? tileJson.geometricError / 2 : 100000;

        // Generate 4 children (Quadtree)
        // Morton order: 0=(0,0), 1=(1,0), 2=(0,1), 3=(1,1)
        for (let i = 0; i < 4; i++) {
          const x = i % 2;
          const y = Math.floor(i / 2);

          const childUri = `content/${s2Face}/${nextZoom}_${x}_${y}.glb`;

          tileJson.children.push({
            boundingVolume: {
              // Placeholder box - preprocessNode calculation will overwrite this with correct S2 bounds
              box: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
            },
            geometricError: childGeonetricError,
            refine: 'REPLACE',
            content: {
              uri: childUri,
            },
            // Add explicit S2 extension data so child knows its identity immediately?
            // No, preprocessNode URI detection handles it fine.
            // But we could strictly pass it if we wanted.
          });
        }

        // Remove implicitTiling to prevent library from trying (and failing) to handle it
        delete tileJson.implicitTiling;
      }
    }

    // 2. Implicit / URI-based detection for Children
    if (!isS2 && tile.content && tile.content.uri) {
      const resolvedMatch = tile.content.uri.match(/content\/(\d+)\/(\d+)_(\d+)_(\d+)\.glb/);
      const templateMatch = tile.content.uri.match(
        /content\/(\d+)\/.*(?:\{level\}|%7Blevel%7D).*\.glb/
      );

      if (resolvedMatch) {
        s2Face = parseInt(resolvedMatch[1], 10);
        s2Zoom = parseInt(resolvedMatch[2], 10);
        s2X = parseInt(resolvedMatch[3], 10);
        s2Y = parseInt(resolvedMatch[4], 10);

        if (parentTile && parentTile.userData && parentTile.userData.s2MinH !== undefined) {
          minH = parentTile.userData.s2MinH;
          maxH = parentTile.userData.s2MaxH;
        }
        if (s2Zoom === 0) {
          // Registry Init for Face Root (Resolved Path)
          const faceCounterKey = `${s2Face}_counter`;
          if (!this._s2Registry.has(faceCounterKey)) {
            this._s2Registry.set(faceCounterKey, {
              zoom: 0,
              x: 0,
              y: 0,
              minH: -10000,
              maxH: 10000,
              childCounter: 0,
            });
          }

          // NUCLEAR OPTION (Resolved Path): Manually instantiate children
          if (!tile.children || tile.children.length === 0) {
            console.log(
              `S2TilesRenderer: Manually instantiating children for Face ${s2Face} (Resolved Path)`
            );

            if (!tile.children) tile.children = [];
            const nextZoom = 1;
            // [FIX] Force parent to have high geometric error so it refines
            if (!tile.geometricError || tile.geometricError < 10000) {
              tile.geometricError = 200000;
            }
            const childGeometricError = tile.geometricError / 2;
            // @ts-ignore
            const basePath = tile.basePath || '';

            // [FIX] Loop over ALL 4 children, no isolation
            for (let i = 0; i < 4; i++) {
              const x = i % 2;
              const y = Math.floor(i / 2);
              const childUri = `content/${s2Face}/${nextZoom}_${x}_${y}.glb`;

              // Calculate correct S2 bounds
              // Use registry min/max H if available, else loose global bounds (-10km to 10km)
              const faceData = this._s2Registry.get(`${s2Face}_counter`);
              const minH = faceData ? faceData.minH : -10000;
              const maxH = faceData ? faceData.maxH : 10000;
              const moonRadius = 1737400;

              const childBox = S2Geometry.getTileBounds(
                s2Face,
                x,
                y,
                nextZoom,
                minH,
                maxH,
                moonRadius
              );
              const boxArray = [
                childBox.min.x,
                childBox.min.y,
                childBox.min.z,
                childBox.max.x,
                childBox.max.y,
                childBox.max.z,
              ];

              const childJsonRef = {
                boundingVolume: {
                  box: [
                    (childBox.max.x + childBox.min.x) / 2,
                    (childBox.max.y + childBox.min.y) / 2,
                    (childBox.max.z + childBox.min.z) / 2,
                    (childBox.max.x - childBox.min.x) / 2,
                    0,
                    0,
                    0,
                    (childBox.max.y - childBox.min.y) / 2,
                    0,
                    0,
                    0,
                    (childBox.max.z - childBox.min.z) / 2,
                  ],
                },
                geometricError: childGeometricError,
                refine: 'REPLACE',
                content: { uri: childUri },
              };
              try {
                // [FIX] Plain Object
                // @ts-ignore
                const childTile: any = {
                  ...childJsonRef,
                  parent: tile,
                  children: [],
                  // @ts-ignore
                  __basePath: basePath,
                  renderer: this,
                };

                // Fix infinite recursion: Manually set depth
                // Use robust calculation because tile.__depth is undefined in early preprocess
                // @ts-ignore
                const pDepth =
                  tile.__depth ??
                  tile.depth ??
                  (parentTile ? (parentTile.__depth ?? parentTile.depth ?? 0) + 1 : 1);

                // @ts-ignore
                childTile.__depth = pDepth + 1;
                // @ts-ignore
                childTile.depth = pDepth + 1;
                // @ts-ignore
                childTile.cachedBox = childBox; // Store Box3 for renderer use

                // @ts-ignore
                tile.children.push(childTile);
                console.log(
                  `[DEBUG] Created child ${i} for Face ${s2Face} (Resolved Path). Box:`,
                  childBox
                );
              } catch (e) {
                console.error(`S2TilesRenderer: Failed to instantiate child tile ${i}`, e);
              }
            }
          }
        }
        isS2 = true;
      } else if (templateMatch) {
        console.log('S2TilesRenderer: Detected Template URI for S2 Tile');
        s2Face = parseInt(templateMatch[1], 10);

        // --- DEPTH-BASED COORDINATE CALCULATION ---
        // Use tile's __depth property to determine zoom level.
        // The library's __depth counts from tileset root:
        // - Root tile: depth 0
        // - Face roots: depth 1
        // - L1 children: depth 2
        // So for S2 tiles: s2Zoom = depth - 1 (since face roots are S2 zoom 0)

        // @ts-ignore
        const tileDepth =
          tile.__depth ??
          tile.depth ??
          (parentTile ? (parentTile.__depth ?? parentTile.depth ?? 0) + 1 : 1);
        s2Zoom = Math.max(0, tileDepth - 1);

        console.log(`S2TilesRenderer: Tile depth=${tileDepth}, computed S2 zoom=${s2Zoom}`);

        if (s2Zoom === 0) {
          // This is a face root (S2 zoom 0)
          s2X = 0;
          s2Y = 0;

          // Initialize face counter for children
          if (!this._s2Registry.has(`${s2Face}_counter`)) {
            this._s2Registry.set(`${s2Face}_counter`, {
              zoom: 0,
              x: 0,
              y: 0,
              minH,
              maxH,
              childCounter: 0,
            });
          }

          // WORKAROUND: Manually generate implicit children for S2 roots
          console.log(
            `[DEBUG] Face ${s2Face} s2Zoom=${s2Zoom}. Children count: ${tile.children ? tile.children.length : 'undefined'}`
          );

          if (!tile.children || tile.children.length === 0) {
            console.log(
              `S2TilesRenderer: Manually instantiating children for Face ${s2Face} (Forced)`
            );

            if (!tile.children) tile.children = [];
            const nextZoom = 1;
            // [FIX] Force parent to have high geometric error so it refines
            if (!tile.geometricError || tile.geometricError < 10000) {
              tile.geometricError = 200000;
            }
            const childGeometricError = tile.geometricError / 2;
            // [FIX] Calculate absolute base path from rootURL to avoid relative/object errors
            // @ts-ignore
            let basePath = tile.basePath;
            // @ts-ignore
            if (!basePath || typeof basePath !== 'string') {
              // @ts-ignore
              const rootUrlAbsolute = new URL(this.rootURL, document.baseURI).href;
              // Get directory of root URL (e.g. .../tiles_out/) from .../tiles_out/tileset.json
              // We use '.' relative to the file URL to get the directory
              basePath = new URL('.', rootUrlAbsolute).href;
              console.log(
                `[DEBUG] Calculated manual absolute basePath: ${basePath} from rootURL: ${this.rootURL}`
              );
            }

            // [FIX] Loop over ALL 4 children, no isolation
            for (let i = 0; i < 4; i++) {
              const x = i % 2;
              const y = Math.floor(i / 2);
              const childUri = `content/${s2Face}/${nextZoom}_${x}_${y}.glb`;

              // Calculate correct S2 bounds
              const faceData = this._s2Registry.get(`${s2Face}_counter`);
              const minH = faceData ? faceData.minH : -10000;
              const maxH = faceData ? faceData.maxH : 10000;
              const moonRadius = 1737400;

              const childBox = S2Geometry.getTileBounds(
                s2Face,
                x,
                y,
                nextZoom,
                minH,
                maxH,
                moonRadius
              );

              const childJsonRef = {
                boundingVolume: {
                  box: [
                    (childBox.max.x + childBox.min.x) / 2,
                    (childBox.max.y + childBox.min.y) / 2,
                    (childBox.max.z + childBox.min.z) / 2,
                    (childBox.max.x - childBox.min.x) / 2,
                    0,
                    0,
                    0,
                    (childBox.max.y - childBox.min.y) / 2,
                    0,
                    0,
                    0,
                    (childBox.max.z - childBox.min.z) / 2,
                  ],
                },
                geometricError: childGeometricError,
                refine: 'REPLACE',
                content: { uri: childUri },
              };

              try {
                // [FIX] Use Prototype Instantiation to create valid Tile objects without
                // invoking the constructor (which caused recursion loops previously).
                // @ts-ignore
                const childTile = Object.create(Object.getPrototypeOf(tile));
                childTile.parent = tile;
                childTile.children = [];
                // @ts-ignore
                childTile.basePath = basePath;
                childTile.renderer = this;

                // Copy properties from JSON ref
                childTile.boundingVolume = childJsonRef.boundingVolume;
                childTile.geometricError = childJsonRef.geometricError;
                childTile.refine = childJsonRef.refine;
                childTile.content = childJsonRef.content;

                // Fix infinite recursion: Manually set depth so preprocessNode knows it's deep
                // Use robust calculation because tile.__depth is undefined in early preprocess
                // @ts-ignore
                const pDepth =
                  tile.__depth ??
                  tile.depth ??
                  (parentTile ? (parentTile.__depth ?? parentTile.depth ?? 0) + 1 : 1);

                // @ts-ignore
                childTile.__depth = pDepth + 1;
                // @ts-ignore
                childTile.depth = pDepth + 1;

                // [CRITICAL] Manually invoke preprocessNode for the new child
                // This ensures it gets correct S2 bounds, caching, and URI resolution!
                this.preprocessNode(childTile, childJsonRef, tile);

                // @ts-ignore
                tile.children.push(childTile);
                // Box should now be in childTile.cached.box
                console.log(
                  `[DEBUG] Created child ${i} for Face ${s2Face} (Resolved Path). Box:`,
                  // @ts-ignore
                  childTile.cached ? childTile.cached.box : 'MISSING (Preprocess Failed)'
                );
              } catch (e) {
                console.error(`S2TilesRenderer: Failed to instantiate child tile ${i}`, e);
              }
            }
          }
        } else {
          // This is a child tile - use per-face counter
          const faceCounterKey = `${s2Face}_counter`;
          let faceData = this._s2Registry.get(faceCounterKey);
          if (!faceData) {
            // Face root wasn't processed yet, initialize now
            faceData = { zoom: 0, x: 0, y: 0, minH, maxH, childCounter: 0 };
            this._s2Registry.set(faceCounterKey, faceData);
          }

          // For L1 tiles (zoom 1), there are 4 tiles per face (0-3)
          const childIndex = faceData.childCounter % 4;
          faceData.childCounter++;

          // Morton Z-order: index 0=(0,0), 1=(1,0), 2=(0,1), 3=(1,1)
          s2X = childIndex % 2;
          s2Y = Math.floor(childIndex / 2);

          console.log(
            `S2TilesRenderer: Face:${s2Face} zoom:${s2Zoom} childIdx=${childIndex} -> X:${s2X} Y:${s2Y}`
          );
        }

        isS2 = true;
      }
    }

    if (isS2 && s2Face >= 0) {
      // DEBUG: Log all potential coordinate keys if we are still at 0/0 and it's a child
      if (s2Zoom > 0 && s2X === 0 && s2Y === 0) {
        console.log('S2TilesRenderer: DEBUG - Tile keys for potential X/Y:', Object.keys(tile));
      }

      console.log(
        `S2TilesRenderer: Processing S2 Tile Face:${s2Face} Zoom:${s2Zoom} X:${s2X} Y:${s2Y} GE:${tile.geometricError}`
      );

      // --- SSE FIX / REFINEMENT DEBUG ---
      // Ensure implicit children inherit a reasonable GE to trigger further refinement
      if (
        parentTile &&
        parentTile.geometricError > 0 &&
        (!tile.geometricError || tile.geometricError === 0)
      ) {
        tile.geometricError = parentTile.geometricError / 2.0;
        console.log(`S2TilesRenderer: Inherited GE: ${tile.geometricError}`);
      }
      // Use the full radii vector for precise triaxial bounding boxes
      const box = S2Geometry.getTileBounds(
        s2Face,
        s2X,
        s2Y,
        s2Zoom,
        minH,
        maxH,
        this.ellipsoidRadii
      );

      if (!tile.cached) tile.cached = {};
      tile.cached.box = box;
      tile.cached.sphere = new Box3()
        .copy(box)
        .getBoundingSphere(tile.cached.sphere || new THREE.Sphere());

      tile.boundingVolume = tile.cached.box;

      if (!tile.userData) tile.userData = {};

      tile.userData.s2Face = s2Face;
      tile.userData.s2Zoom = s2Zoom;
      tile.userData.s2X = s2X;
      tile.userData.s2Y = s2Y;
      tile.userData.s2MinH = minH;
      tile.userData.s2MaxH = maxH;

      // Resolve URI templates with our computed coordinates
      // Since 3d-tiles-renderer v0.4 doesn't resolve templates for S2 tiles,
      // we must do it ourselves using the coordinates computed above.
      if (tile?.content?.uri && typeof tile.content.uri === 'string') {
        const uri = tile.content.uri;
        if (uri.includes('{level}') || uri.includes('%7Blevel%7D')) {
          tile.content.uri = uri
            .replace(/\{level\}/g, s2Zoom.toString())
            .replace(/\{x\}/g, s2X.toString())
            .replace(/\{y\}/g, s2Y.toString())
            .replace(/%7Blevel%7D/g, s2Zoom.toString())
            .replace(/%7Bx%7D/g, s2X.toString())
            .replace(/%7By%7D/g, s2Y.toString());
          console.log(`S2TilesRenderer: Resolved template URI -> ${tile.content.uri}`);
        }
      }
    }
  }
}
