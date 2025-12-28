/**
 * @file index.ts
 * @description Barrel exports for materials module.
 * Provides centralized access to all custom Three.js materials.
 */

// Material factory functions
export {
  createBasicMaterial,
  createLineMaterial,
  createMoonMaterial,
  createPlanetMaterial,
  createPointsMaterial,
  mergeOriginUniforms,
  ORIGIN_OFFSET_GLSL,
  patchMaterialForOrigin,
} from './MaterialFactory';

// Mission trajectory line material
export { createMissionLineMaterial } from './MissionLineMaterial';

// Orbit line material (trails)
export { createOrbitLineMaterial } from './OrbitLineMaterial';

// Orbit shader material
export {
  createOrbitMaterial,
  createProgressAttribute,
  updateOrbitColors,
  updateOrbitMaterialColor,
  updateProgressAttribute,
} from './OrbitMaterial';

// Sun material with animated surface
export { createSunMaterial } from './SunMaterial';
