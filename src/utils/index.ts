/**
 * @file index.ts
 * @description Barrel exports for utils module.
 * Provides centralized access to all utility functions.
 */

// Number and scientific formatting
export { formatDecimal, formatGravity, formatScientific } from './formatting';
// Logging utility
export { Logger } from './logger';
// Spatial indexing
export { Octree } from './Octree';
// Screen-space projections
export {
  distToSegmentSquared,
  findClosestObjectScreenSpace,
  worldToScreen,
} from './screenSpace';
// Coordinate conversion
export { raDecToVector } from './utils';
// Vector math utilities (64-bit precision)
export {
  type Vector3Like,
  vAdd,
  vAngle,
  vClone,
  vDistSq,
  vDot,
  vec3,
  vLen,
  vLenSq,
  vLerp,
  vMul,
  vNormalize,
  vSub,
} from './vectorUtils';
