import { Vector3, Box3 } from 'three';

// === S2 Geometry Utilities ===
// Ported from Texture Pipeline (utils.py)

export class S2Geometry {
  /**
   * Converts S2 face UV coordinates to Unit Sphere XYZ.
   * Uses the official S2 quadratic projection.
   */
  static faceUvToXyz(face: number, u: number, v: number, target: Vector3): Vector3 {
    // Quadratic Projection (ST to UV)
    const s2StToUv = (s: number) => {
      if (s >= 0.5) return (1.0 / 3.0) * (4.0 * s * s - 1.0);
      return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) ** 2);
    };

    const su = s2StToUv(u);
    const sv = s2StToUv(v);

    // Official S2 Coordinate System
    let x = 0,
      y = 0,
      z = 0;

    switch (face) {
      case 0:
        x = 1.0;
        y = su;
        z = sv;
        break; // +X
      case 1:
        x = -su;
        y = 1.0;
        z = sv;
        break; // +Y
      case 2:
        x = -su;
        y = -sv;
        z = 1.0;
        break; // +Z (North)
      case 3:
        x = -1.0;
        y = -sv;
        z = -su;
        break; // -X
      case 4:
        x = sv;
        y = -1.0;
        z = -su;
        break; // -Y
      case 5:
        x = sv;
        y = su;
        z = -1.0;
        break; // -Z (South)
    }

    // Normalize to Sphere
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
  static getTileBounds(
    face: number,
    x: number,
    y: number,
    zoom: number,
    minHeight: number,
    maxHeight: number,
    radii: number | number[] | Vector3
  ): Box3 {
    // Normalize radii to Vector3
    const r = new Vector3();
    if (typeof radii === 'number') {
      r.set(radii, radii, radii);
    } else if (Array.isArray(radii)) {
      r.set(radii[0], radii[1] || radii[0], radii[2] || radii[0]);
    } else {
      r.copy(radii as Vector3);
    }

    const tileUVSize = 1.0 / (1 << zoom);
    const u0 = x * tileUVSize;
    const v0 = y * tileUVSize;

    // Sample grid points to form tight fit
    const box = new Box3();
    const vec = new Vector3();
    const steps = 4; // 4x4 grid

    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const u = u0 + (i / steps) * tileUVSize;
        const v = v0 + (j / steps) * tileUVSize;

        this.faceUvToXyz(face, u, v, vec);

        // Calculate point on ellipsoid surface with height
        // P = [ (Rx + h)*x, (Ry + h)*y, (Rz + h)*z ]

        // 1. Min Height point
        const pMin = vec.clone();
        pMin.x *= r.x + minHeight;
        pMin.y *= r.y + minHeight;
        pMin.z *= r.z + minHeight;
        box.expandByPoint(pMin);

        // 2. Max Height point
        const pMax = vec.clone();
        pMax.x *= r.x + maxHeight;
        pMax.y *= r.y + maxHeight;
        pMax.z *= r.z + maxHeight;
        box.expandByPoint(pMax);
      }
    }

    // Padding based on max radius
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
}
