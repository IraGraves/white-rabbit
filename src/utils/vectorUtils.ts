/**
 * @file vectorUtils.ts
 * @description Lightweight vector math utilities for plain object {x, y, z} vectors.
 * Intended for high-precision (64-bit) calculations where THREE.Vector3 avoids overhead
 * but is limited to Float32 precision in some contexts (though JS numbers are doubles,
 * keeping them as plain objects ensures we don't accidentally cast them or use float32 methods).
 */

export interface Vector3Like {
  x: number;
  y: number;
  z: number;
}

export const vec3 = (x: number, y: number, z: number): Vector3Like => ({ x, y, z });

export const vAdd = (a: Vector3Like, b: Vector3Like): Vector3Like => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});

export const vSub = (a: Vector3Like, b: Vector3Like): Vector3Like => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});

export const vMul = (a: Vector3Like, s: number): Vector3Like => ({
  x: a.x * s,
  y: a.y * s,
  z: a.z * s,
});

// Dot Product
export const vDot = (a: Vector3Like, b: Vector3Like): number => a.x * b.x + a.y * b.y + a.z * b.z;

// Length Squared
export const vLenSq = (a: Vector3Like): number => a.x * a.x + a.y * a.y + a.z * a.z;

// Length
export const vLen = (a: Vector3Like): number => Math.sqrt(vLenSq(a));

// Angle between two vectors (radians)
export const vAngle = (a: Vector3Like, b: Vector3Like): number => {
  const d = vDot(a, b);
  const l = Math.sqrt(vLenSq(a) * vLenSq(b));
  if (l === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, d / l)));
};

// Lerp
export const vLerp = (a: Vector3Like, b: Vector3Like, t: number): Vector3Like => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  z: a.z + (b.z - a.z) * t,
});

// Clone
export const vClone = (a: Vector3Like): Vector3Like => ({ ...a });

// Normalize
export const vNormalize = (a: Vector3Like): Vector3Like => {
  const l = vLen(a);
  if (l === 0) return { x: 0, y: 0, z: 0 };
  return { x: a.x / l, y: a.y / l, z: a.z / l };
};

// Distance Squared
export const vDistSq = (a: Vector3Like, b: Vector3Like): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
};
