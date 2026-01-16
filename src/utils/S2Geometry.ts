import { Vector3, Box3, Matrix3 } from 'three';
import { OBB } from 'three/examples/jsm/math/OBB.js';

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
    // target.set(x / r, y / r, z / r);
    // SWIZZLE for Y-up Scene (match mesh.py/GLTF transform)
    // Old (x, y, z) -> New (x, z, -y)
    target.set(x / r, z / r, -y / r);

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

        S2Geometry.faceUvToXyz(face, u, v, vec);

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
   * Computes a precise OBB for the tile.
   */
  static getTileOBB(
    face: number,
    x: number,
    y: number,
    zoom: number,
    minHeight: number,
    maxHeight: number,
    radii: number | number[] | Vector3
  ): OBB {
    const obb = new OBB();

    // 1. Radii
    const r = new Vector3();
    if (typeof radii === 'number') {
      r.set(radii, radii, radii);
    } else if (Array.isArray(radii)) {
      r.set(radii[0], radii[1] || radii[0], radii[2] || radii[0]);
    } else {
      r.copy(radii as Vector3);
    }

    const tileUVSize = 1.0 / (1 << zoom);
    const uMid = (x + 0.5) * tileUVSize;
    const vMid = (y + 0.5) * tileUVSize;

    // 2. Center Calculation (at mid-height)
    const centerDir = new Vector3();
    S2Geometry.faceUvToXyz(face, uMid, vMid, centerDir);
    const midHeight = (minHeight + maxHeight) / 2;

    obb.center.copy(centerDir).multiply(r).addScaledVector(centerDir, midHeight);

    // 3. Basis Vectors (Rotation)
    // Z-axis = Up (Normal at center)
    const zAxis = centerDir.clone().normalize();

    // Y-axis = North (approximate, projected onto tangent plane)
    const north = new Vector3(0, 0, 1); // Helper
    // If we are at the pole, use X as reference
    if (Math.abs(zAxis.z) > 0.99) north.set(1, 0, 0);

    const xAxis = new Vector3().crossVectors(north, zAxis).normalize(); // West-East line
    const yAxis = new Vector3().crossVectors(zAxis, xAxis).normalize(); // South-North line

    // Set Basis
    const basis = new Matrix3();
    basis.set(xAxis.x, yAxis.x, zAxis.x, xAxis.y, yAxis.y, zAxis.y, xAxis.z, yAxis.z, zAxis.z);
    obb.rotation.copy(basis);

    // 4. Extents (Half-Size) calculation
    // Project all 4 corners (at min/max height) into the local OBB frame
    // and find the maximum absolute distance from center.
    const corners = [
      { u: x * tileUVSize, v: y * tileUVSize },
      { u: (x + 1) * tileUVSize, v: y * tileUVSize },
      { u: x * tileUVSize, v: (y + 1) * tileUVSize },
      { u: (x + 1) * tileUVSize, v: (y + 1) * tileUVSize },
    ];

    let maxDx = 0,
      maxDy = 0;
    const vec = new Vector3();

    // Inverse basis for projection (transpose since orthogonal)
    const invBasis = basis.clone().transpose();

    for (const c of corners) {
      S2Geometry.faceUvToXyz(face, c.u, c.v, vec);
      // Project to ellipsoid surface
      vec.x *= r.x;
      vec.y *= r.y;
      vec.z *= r.z;

      // Vector from OBB center to this corner point (at ellipsoid surface)
      // We neglect height for X/Y extent calculation as corners are vertical walls
      // actually height adds some divergence, let's take max height for safety?
      // Safest is to project point at mid-height or just ignore height for "width" estimation if FOV is small.
      // But for global fit, let's use the surface point.

      // Better: Project point relative to center
      vec.sub(obb.center).applyMatrix3(invBasis);

      maxDx = Math.max(maxDx, Math.abs(vec.x));
      maxDy = Math.max(maxDy, Math.abs(vec.y));
    }

    // Z half-size
    const halfHeight = (maxHeight - minHeight) / 2;
    // Add a little padding to X/Y for curvature
    obb.halfSize.set(maxDx * 1.05, maxDy * 1.05, halfHeight + 100); // 100m padding

    return obb;
  }
}
