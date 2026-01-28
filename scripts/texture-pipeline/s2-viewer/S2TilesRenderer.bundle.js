var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/systems/lod/S2TilesRenderer.ts
import { TilesRenderer } from "3d-tiles-renderer";
import { Box3 as Box32 } from "three";

// src/utils/S2Geometry.ts
import { Vector3, Box3 } from "three";
var S2Geometry = class {
  /**
   * Converts S2 face UV coordinates to Unit Sphere XYZ.
   * Uses the official S2 quadratic projection.
   */
  static faceUvToXyz(face, u, v, target) {
    const s2StToUv = (s) => {
      if (s >= 0.5) return 1 / 3 * (4 * s * s - 1);
      return 1 / 3 * (1 - 4 * (1 - s) ** 2);
    };
    const su = s2StToUv(u);
    const sv = s2StToUv(v);
    let x = 0, y = 0, z = 0;
    switch (face) {
      case 0:
        x = 1;
        y = su;
        z = sv;
        break;
      // +X
      case 1:
        x = -su;
        y = 1;
        z = sv;
        break;
      // +Y
      case 2:
        x = -su;
        y = -sv;
        z = 1;
        break;
      // +Z (North)
      case 3:
        x = -1;
        y = -sv;
        z = -su;
        break;
      // -X
      case 4:
        x = sv;
        y = -1;
        z = -su;
        break;
      // -Y
      case 5:
        x = sv;
        y = su;
        z = -1;
        break;
    }
    const r = Math.sqrt(x * x + y * y + z * z);
    target.set(x / r, y / r, z / r);
    return target;
  }
  /**
   * Computes the Oriented Bounding Box (or AABB approximation) for an S2 tile.
   * @param face S2 Face ID (0-5)
   * @param x Tile X index
   * @param y Tile Y index
   * @param zoom Tile Zoom level
   * @param minHeight Minimum height above ellipsoid
   * @param maxHeight Maximum height above ellipsoid
   * @param radii Ellipsoid radii [x, y, z]
   */
  static getTileBounds(face, x, y, zoom, minHeight, maxHeight, radii) {
    const r = new Vector3();
    if (typeof radii === "number") {
      r.set(radii, radii, radii);
    } else if (Array.isArray(radii)) {
      r.set(radii[0], radii[1] || radii[0], radii[2] || radii[0]);
    } else {
      r.copy(radii);
    }
    const tileUVSize = 1 / (1 << zoom);
    const u0 = x * tileUVSize;
    const v0 = y * tileUVSize;
    const box = new Box3();
    const vec = new Vector3();
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const u = u0 + i / steps * tileUVSize;
        const v = v0 + j / steps * tileUVSize;
        this.faceUvToXyz(face, u, v, vec);
        const pMin = vec.clone();
        pMin.x *= r.x + minHeight;
        pMin.y *= r.y + minHeight;
        pMin.z *= r.z + minHeight;
        box.expandByPoint(pMin);
        const pMax = vec.clone();
        pMax.x *= r.x + maxHeight;
        pMax.y *= r.y + maxHeight;
        pMax.z *= r.z + maxHeight;
        box.expandByPoint(pMax);
      }
    }
    const maxRadius = Math.max(r.x, r.y, r.z);
    return box.expandByScalar(maxRadius * 0.05);
  }
  /**
   * Decodes an S2 Token to (Face, Zoom, X, Y).
   * Assumes standard S2 cell ID logic (roughly).
   * Note: Full S2 logic parses bits.
   * For Planet Tiler, we mostly rely on the explicit 'extensions' data if available,
   * or we need to implement the bitwise decoding if implicit tiling relies purely on the token.
   *
   * Implicit tiling usually uses traversing:
   * Root -> 4 children. S2 follows a Hilbert curve or simpler quadrant logic.
   *
   * PlanetTiler's implicit S2 implementation (json_generators.py) assumes:
   * Children are ordered: [0,0], [1,0], [0,1], [1,1] (relative to parent).
   *
   * We don't necessarily need to decode the token if we track traversal down from the root faces.
   */
};

// src/systems/lod/S2TilesRenderer.ts
import * as THREE from "three";
var S2TilesRenderer = class extends TilesRenderer {
  constructor(url, moonRadius = 1737400) {
    super(url);
    __publicField(this, "ellipsoidRadii", [1737400, 1737400, 1737400]);
    __publicField(this, "onLoadModel");
    __publicField(this, "onDownloadError");
    // Registry to track S2 tile coordinates since library doesn't pass correct parent references
    __publicField(this, "_s2Registry", /* @__PURE__ */ new Map());
    this.ellipsoidRadii = [moonRadius, moonRadius, moonRadius];
  }
  // Override preprocessNode to inject S2 Bounding Volume logic
  // @ts-ignore
  preprocessNode(tile, tileJson, parentTile) {
    if (!window.s2PreprocessCount) window.s2PreprocessCount = 0;
    if (window.s2PreprocessCount > 200) {
      console.warn("S2TilesRenderer: Preprocess Limit Reached!");
      return;
    }
    window.s2PreprocessCount++;
    console.log(
      `[RecursionDebug] #${window.s2PreprocessCount} URI: ${tile.content ? tile.content.uri : "null"} Depth: ${tile.depth} __Depth: ${tile.__depth}`
    );
    console.log(
      `[BaseDebug] Pre-super preprocess for depth ${tile.depth}. basePath type: ${typeof tile.basePath}`,
      tile.basePath
    );
    super.preprocessNode(tile, tileJson, parentTile);
    console.log(
      `[BaseDebug] Post-super preprocess for depth ${tile.depth}. basePath type: ${typeof tile.basePath}`,
      tile.basePath
    );
    if (tile.basePath) {
      if (typeof tile.basePath !== "string") {
        console.warn(
          `S2TilesRenderer: basePath is NOT a string! Type: ${typeof tile.basePath}. Discarding and using root.`,
          tile.basePath
        );
        const rootUrlAbsolute = new URL(this.rootURL || "tileset.json", document.baseURI).href;
        tile.basePath = new URL(".", rootUrlAbsolute).href;
      } else {
        try {
          new URL("test", tile.basePath);
        } catch (e) {
          console.warn(
            `S2TilesRenderer: Invalid basePath detected: ${tile.basePath}. Resolving against ${document.baseURI}`
          );
          tile.basePath = new URL(tile.basePath, document.baseURI).href;
          console.log(
            `S2TilesRenderer: Resolved relative basePath to absolute -> ${tile.basePath}`
          );
        }
      }
    }
    if (tile.__basePath) {
      if (typeof tile.__basePath !== "string") {
        tile.__basePath = void 0;
      } else {
        try {
          new URL("test", tile.__basePath);
        } catch (e) {
          tile.__basePath = new URL(tile.__basePath, document.baseURI).href;
        }
      }
    }
    let s2Face = -1;
    let s2X = 0;
    let s2Y = 0;
    let s2Zoom = 0;
    let minH = -1e4;
    let maxH = 1e4;
    let isS2 = false;
    if (tileJson?.extensions?.["3DTILES_bounding_volume_S2"]) {
      const s2Data = tileJson.extensions["3DTILES_bounding_volume_S2"];
      console.log("S2TilesRenderer: Found S2 Extension in Root", s2Data);
      const token = s2Data.token;
      const firstChar = token[0];
      switch (firstChar) {
        case "1":
          s2Face = 0;
          break;
        case "3":
          s2Face = 1;
          break;
        case "5":
          s2Face = 2;
          break;
        case "7":
          s2Face = 3;
          break;
        case "9":
          s2Face = 4;
          break;
        case "b":
          s2Face = 5;
          break;
      }
      s2Zoom = 0;
      s2X = 0;
      s2Y = 0;
      minH = s2Data.minimumHeight;
      maxH = s2Data.maximumHeight;
      isS2 = true;
    } else if (tileJson?.boundingVolume?.extensions?.["3DTILES_bounding_volume_S2"]) {
      const s2Data = tileJson.boundingVolume.extensions["3DTILES_bounding_volume_S2"];
      console.log("S2TilesRenderer: Found S2 Extension in BoundingVolume", s2Data);
      const token = s2Data.token;
      const firstChar = token[0];
      switch (firstChar) {
        case "1":
          s2Face = 0;
          break;
        case "3":
          s2Face = 1;
          break;
        case "5":
          s2Face = 2;
          break;
        case "7":
          s2Face = 3;
          break;
        case "9":
          s2Face = 4;
          break;
        case "b":
          s2Face = 5;
          break;
      }
      s2Zoom = 0;
      s2X = 0;
      minH = s2Data.minimumHeight;
      maxH = s2Data.maximumHeight;
      isS2 = true;
      if (tileJson.implicitTiling) {
        console.log(`S2TilesRenderer: Manually expanding implicit children for Face ${s2Face}`);
        if (!tileJson.children) tileJson.children = [];
        const nextZoom = 1;
        const childGeonetricError = tileJson.geometricError ? tileJson.geometricError / 2 : 1e5;
        for (let i = 0; i < 4; i++) {
          const x = i % 2;
          const y = Math.floor(i / 2);
          const childUri = `content/${s2Face}/${nextZoom}_${x}_${y}.glb`;
          tileJson.children.push({
            boundingVolume: {
              // Placeholder box - preprocessNode calculation will overwrite this with correct S2 bounds
              box: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1]
            },
            geometricError: childGeonetricError,
            refine: "REPLACE",
            content: {
              uri: childUri
            }
            // Add explicit S2 extension data so child knows its identity immediately?
            // No, preprocessNode URI detection handles it fine.
            // But we could strictly pass it if we wanted.
          });
        }
        delete tileJson.implicitTiling;
      }
    }
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
        if (parentTile && parentTile.userData && parentTile.userData.s2MinH !== void 0) {
          minH = parentTile.userData.s2MinH;
          maxH = parentTile.userData.s2MaxH;
        }
        if (s2Zoom === 0) {
          const faceCounterKey = `${s2Face}_counter`;
          if (!this._s2Registry.has(faceCounterKey)) {
            this._s2Registry.set(faceCounterKey, {
              zoom: 0,
              x: 0,
              y: 0,
              minH: -1e4,
              maxH: 1e4,
              childCounter: 0
            });
          }
          if (!tile.children || tile.children.length === 0) {
            console.log(
              `S2TilesRenderer: Manually instantiating children for Face ${s2Face} (Resolved Path)`
            );
            if (!tile.children) tile.children = [];
            const nextZoom = 1;
            if (!tile.geometricError || tile.geometricError < 1e4) {
              tile.geometricError = 2e5;
            }
            const childGeometricError = tile.geometricError / 2;
            const basePath = tile.basePath || "";
            for (let i = 0; i < 4; i++) {
              const x = i % 2;
              const y = Math.floor(i / 2);
              const childUri = `content/${s2Face}/${nextZoom}_${x}_${y}.glb`;
              const faceData = this._s2Registry.get(`${s2Face}_counter`);
              const minH2 = faceData ? faceData.minH : -1e4;
              const maxH2 = faceData ? faceData.maxH : 1e4;
              const moonRadius = 1737400;
              const childBox = S2Geometry.getTileBounds(
                s2Face,
                x,
                y,
                nextZoom,
                minH2,
                maxH2,
                moonRadius
              );
              const boxArray = [
                childBox.min.x,
                childBox.min.y,
                childBox.min.z,
                childBox.max.x,
                childBox.max.y,
                childBox.max.z
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
                    (childBox.max.z - childBox.min.z) / 2
                  ]
                },
                geometricError: childGeometricError,
                refine: "REPLACE",
                content: { uri: childUri }
              };
              try {
                const childTile = {
                  ...childJsonRef,
                  parent: tile,
                  children: [],
                  // @ts-ignore
                  __basePath: basePath,
                  renderer: this
                };
                const pDepth = tile.__depth ?? tile.depth ?? (parentTile ? (parentTile.__depth ?? parentTile.depth ?? 0) + 1 : 1);
                childTile.__depth = pDepth + 1;
                childTile.depth = pDepth + 1;
                childTile.cachedBox = childBox;
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
        console.log("S2TilesRenderer: Detected Template URI for S2 Tile");
        s2Face = parseInt(templateMatch[1], 10);
        const tileDepth = tile.__depth ?? tile.depth ?? (parentTile ? (parentTile.__depth ?? parentTile.depth ?? 0) + 1 : 1);
        s2Zoom = Math.max(0, tileDepth - 1);
        console.log(`S2TilesRenderer: Tile depth=${tileDepth}, computed S2 zoom=${s2Zoom}`);
        if (s2Zoom === 0) {
          s2X = 0;
          s2Y = 0;
          if (!this._s2Registry.has(`${s2Face}_counter`)) {
            this._s2Registry.set(`${s2Face}_counter`, {
              zoom: 0,
              x: 0,
              y: 0,
              minH,
              maxH,
              childCounter: 0
            });
          }
          console.log(
            `[DEBUG] Face ${s2Face} s2Zoom=${s2Zoom}. Children count: ${tile.children ? tile.children.length : "undefined"}`
          );
          if (!tile.children || tile.children.length === 0) {
            console.log(
              `S2TilesRenderer: Manually instantiating children for Face ${s2Face} (Forced)`
            );
            if (!tile.children) tile.children = [];
            const nextZoom = 1;
            if (!tile.geometricError || tile.geometricError < 1e4) {
              tile.geometricError = 2e5;
            }
            const childGeometricError = tile.geometricError / 2;
            let basePath = tile.basePath;
            if (!basePath || typeof basePath !== "string") {
              const rootUrlAbsolute = new URL(this.rootURL, document.baseURI).href;
              basePath = new URL(".", rootUrlAbsolute).href;
              console.log(
                `[DEBUG] Calculated manual absolute basePath: ${basePath} from rootURL: ${this.rootURL}`
              );
            }
            for (let i = 0; i < 4; i++) {
              const x = i % 2;
              const y = Math.floor(i / 2);
              const childUri = `content/${s2Face}/${nextZoom}_${x}_${y}.glb`;
              const faceData = this._s2Registry.get(`${s2Face}_counter`);
              const minH2 = faceData ? faceData.minH : -1e4;
              const maxH2 = faceData ? faceData.maxH : 1e4;
              const moonRadius = 1737400;
              const childBox = S2Geometry.getTileBounds(
                s2Face,
                x,
                y,
                nextZoom,
                minH2,
                maxH2,
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
                    (childBox.max.z - childBox.min.z) / 2
                  ]
                },
                geometricError: childGeometricError,
                refine: "REPLACE",
                content: { uri: childUri }
              };
              try {
                const childTile = Object.create(Object.getPrototypeOf(tile));
                childTile.parent = tile;
                childTile.children = [];
                childTile.basePath = basePath;
                childTile.renderer = this;
                childTile.boundingVolume = childJsonRef.boundingVolume;
                childTile.geometricError = childJsonRef.geometricError;
                childTile.refine = childJsonRef.refine;
                childTile.content = childJsonRef.content;
                const pDepth = tile.__depth ?? tile.depth ?? (parentTile ? (parentTile.__depth ?? parentTile.depth ?? 0) + 1 : 1);
                childTile.__depth = pDepth + 1;
                childTile.depth = pDepth + 1;
                this.preprocessNode(childTile, childJsonRef, tile);
                tile.children.push(childTile);
                console.log(
                  `[DEBUG] Created child ${i} for Face ${s2Face} (Resolved Path). Box:`,
                  // @ts-ignore
                  childTile.cached ? childTile.cached.box : "MISSING (Preprocess Failed)"
                );
              } catch (e) {
                console.error(`S2TilesRenderer: Failed to instantiate child tile ${i}`, e);
              }
            }
          }
        } else {
          const faceCounterKey = `${s2Face}_counter`;
          let faceData = this._s2Registry.get(faceCounterKey);
          if (!faceData) {
            faceData = { zoom: 0, x: 0, y: 0, minH, maxH, childCounter: 0 };
            this._s2Registry.set(faceCounterKey, faceData);
          }
          const childIndex = faceData.childCounter % 4;
          faceData.childCounter++;
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
      if (s2Zoom > 0 && s2X === 0 && s2Y === 0) {
        console.log("S2TilesRenderer: DEBUG - Tile keys for potential X/Y:", Object.keys(tile));
      }
      console.log(
        `S2TilesRenderer: Processing S2 Tile Face:${s2Face} Zoom:${s2Zoom} X:${s2X} Y:${s2Y} GE:${tile.geometricError}`
      );
      if (parentTile && parentTile.geometricError > 0 && (!tile.geometricError || tile.geometricError === 0)) {
        tile.geometricError = parentTile.geometricError / 2;
        console.log(`S2TilesRenderer: Inherited GE: ${tile.geometricError}`);
      }
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
      tile.cached.sphere = new Box32().copy(box).getBoundingSphere(tile.cached.sphere || new THREE.Sphere());
      tile.boundingVolume = tile.cached.box;
      if (!tile.userData) tile.userData = {};
      tile.userData.s2Face = s2Face;
      tile.userData.s2Zoom = s2Zoom;
      tile.userData.s2X = s2X;
      tile.userData.s2Y = s2Y;
      tile.userData.s2MinH = minH;
      tile.userData.s2MaxH = maxH;
      if (tile?.content?.uri && typeof tile.content.uri === "string") {
        const uri = tile.content.uri;
        if (uri.includes("{level}") || uri.includes("%7Blevel%7D")) {
          tile.content.uri = uri.replace(/\{level\}/g, s2Zoom.toString()).replace(/\{x\}/g, s2X.toString()).replace(/\{y\}/g, s2Y.toString()).replace(/%7Blevel%7D/g, s2Zoom.toString()).replace(/%7Bx%7D/g, s2X.toString()).replace(/%7By%7D/g, s2Y.toString());
          console.log(`S2TilesRenderer: Resolved template URI -> ${tile.content.uri}`);
        }
      }
    }
  }
};
export {
  S2TilesRenderer
};
