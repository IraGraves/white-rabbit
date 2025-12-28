/**
 * @file index.ts
 * @description Barrel exports for utils module.
 * Provides centralized access to all utility functions.
 */

// Vector math utilities (64-bit precision)
export {
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
  type Vector3Like,
} from './vectorUtils';

// Number and scientific formatting
export { formatDecimal, formatGravity, formatScientific } from './formatting';

// Screen-space projections
export {
  distToSegmentSquared,
  findClosestObjectScreenSpace,
  worldToScreen,
} from './screenSpace';

// Spatial indexing
export { Octree } from './Octree';

// Logging utility
export { Logger } from './logger';

// Coordinate conversion
export { raDecToVector } from './utils';
