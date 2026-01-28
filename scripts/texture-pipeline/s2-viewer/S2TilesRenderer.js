var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/systems/lod/S2TilesRenderer.ts
import { TilesRenderer } from "3d-tiles-renderer";
import { Box3 as Box32, Sphere } from "three";

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
var S2TilesRenderer = class extends TilesRenderer {
  constructor(url, moonRadius = 1737400) {
    super(url);
    __publicField(this, "ellipsoidRadii", [1737400, 1737400, 1737400]);
    __publicField(this, "onLoadModel");
    __publicField(this, "onDownloadError");
    this.ellipsoidRadii = [moonRadius, moonRadius, moonRadius];
  }
  // Override preprocessNode to inject S2 Bounding Volume logic
  // @ts-ignore
  preprocessNode(tile, tileJson, parentTile) {
    super.preprocessNode(tile, tileJson, parentTile);
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
      s2Y = 0;
      minH = s2Data.minimumHeight;
      maxH = s2Data.maximumHeight;
      isS2 = true;
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
        isS2 = true;
      } else if (templateMatch) {
        console.log("S2TilesRenderer: Detected Template URI for S2 Tile");
        s2Face = parseInt(templateMatch[1], 10);
        console.log("S2TilesRenderer: DEBUG - All tile properties:", {
          keys: Object.keys(tile),
          level: tile.level,
          x: tile.x,
          y: tile.y,
          __level: tile.__level,
          __x: tile.__x,
          __y: tile.__y,
          __implicitCoord: tile.__implicitCoord,
          implicitCoord: tile.implicitCoord,
          // Check the internal tile data structure
          __tile: tile.__tile ? Object.keys(tile.__tile) : void 0,
          // Check for depth property
          depth: tile.depth,
          __depth: tile.__depth
        });
        if (tile.__implicitCoord) {
          s2Zoom = tile.__implicitCoord.level ?? 0;
          s2X = tile.__implicitCoord.x ?? 0;
          s2Y = tile.__implicitCoord.y ?? 0;
          console.log("S2TilesRenderer: Found __implicitCoord:", tile.__implicitCoord);
        } else if (tile.implicitCoord) {
          s2Zoom = tile.implicitCoord.level ?? 0;
          s2X = tile.implicitCoord.x ?? 0;
          s2Y = tile.implicitCoord.y ?? 0;
          console.log("S2TilesRenderer: Found implicitCoord:", tile.implicitCoord);
        } else {
          s2Zoom = tile.level !== void 0 ? tile.level : tile.__level !== void 0 ? tile.__level : tile.depth !== void 0 ? tile.depth : tile.__depth !== void 0 ? tile.__depth : 0;
          s2X = tile.x !== void 0 ? tile.x : tile.__x !== void 0 ? tile.__x : 0;
          s2Y = tile.y !== void 0 ? tile.y : tile.__y !== void 0 ? tile.__y : 0;
        }
        if (s2Zoom === 0 && parentTile && parentTile.userData && parentTile.userData.s2Zoom !== void 0) {
          s2Zoom = parentTile.userData.s2Zoom + 1;
          console.log(`S2TilesRenderer: Guessing Zoom ${s2Zoom} from parent.`);
        }
        if (parentTile && parentTile.userData && parentTile.userData.s2MinH !== void 0) {
          minH = parentTile.userData.s2MinH;
          maxH = parentTile.userData.s2MaxH;
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
      tile.cached.sphere = new Box32().copy(box).getBoundingSphere(tile.cached.sphere || new Sphere());
      tile.boundingVolume = tile.cached.box;
      if (!tile.userData) tile.userData = {};
      tile.userData.s2Face = s2Face;
      tile.userData.s2Zoom = s2Zoom;
      tile.userData.s2X = s2X;
      tile.userData.s2Y = s2Y;
      tile.userData.s2MinH = minH;
      tile.userData.s2MaxH = maxH;
      const hasImplicitTiling = tileJson?.implicitTiling !== void 0;
      if (!hasImplicitTiling && tile?.content?.uri && typeof tile.content.uri === "string") {
        const uri = tile.content.uri;
        console.log("S2TilesRenderer: Checking URI for templates (non-implicit):", uri);
        if (uri.includes("{level}") || uri.includes("%7Blevel%7D")) {
          console.log("S2TilesRenderer: Replacing templates in URI");
          tile.content.uri = uri.replace(/\{level\}/g, s2Zoom.toString()).replace(/\{x\}/g, s2X.toString()).replace(/\{y\}/g, s2Y.toString()).replace(/%7Blevel%7D/g, s2Zoom.toString()).replace(/%7Bx%7D/g, s2X.toString()).replace(/%7By%7D/g, s2Y.toString());
          console.log("S2TilesRenderer: New URI:", tile.content.uri);
        }
      } else if (hasImplicitTiling) {
        console.log(
          "S2TilesRenderer: Preserving template URI for implicit tiling:",
          tile?.content?.uri
        );
      }
    }
  }
};
export {
  S2TilesRenderer
};
