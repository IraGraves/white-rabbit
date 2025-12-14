/**
 * @file moons.ts
 * @description Moon creation, position calculation, and intelligent orbit scaling system.
 *
 * This file manages the creation and updating of all natural satellites in the solar system.
 * It supports three distinct calculation methods based on moon type and implements an advanced
 * orbit scaling system to prevent visual overlap while maintaining relative scale relationships.
 *
 * Moon position calculation strategies:
 * - 'real': Earth's Moon using Astronomy.GeoVector for precise orbital mechanics
 * - 'jovian': Jupiter's Galilean moons using Astronomy.JupiterMoons() ephemeris
 * - 'simple': Simplified circular orbits for Saturn, Uranus, and Neptune moons
 *
 * Adaptive orbit scaling features:
 * - Compound scaling: Combines planetScale ×500 artistic multiplier for visual coherence
 * - Lower bound: 1.1× parent planet radius to prevent moons appearing inside planets
 * - Upper bound: Half distance to nearest neighboring planet to prevent overlap
 * - Linear remapping: Proportionally compresses/expands moon system if exceeding bounds
 * - Dynamic updates: Recalculates orbit positions based on current simulation date
 *
 * Additional features:
 * - Tidal locking: Rotates moons to always face their parent planet
 * - Visibility management by size category (largest, major, small)
 * - Texture loading with progressive quality (lowres → midres → highres)
 * - Rotation axis visualization
 * - Shadow/lighting layer management for Earth's Moon
 * - Periodic orbit line updates for real/jovian moons to track changing positions
 *
 * The scaling system ensures moon orbits remain visually distinct and don't overlap with their
 * parent's neighbors, while still conveying the correct relative scale of the moon system.
 */
import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { AU_TO_SCENE, config, REAL_PLANET_SCALE_FACTOR } from '../config';
import { textureManager } from '../managers/TextureManager';
import { patchMaterialForOrigin } from '../materials/MaterialFactory';
import { createOrbitLineMaterial } from '../materials/OrbitLineMaterial';
import type { PlanetWrapper } from '../types';

// Global resolution for Line2 materials
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

export function resizeMoons(width: number, height: number): void {
  resolution.set(width, height);
}

/**
 * Get approximate orbital distance for a planet in AU
 */
function getPlanetDistanceAU(planetData: any): number | null {
  if (!planetData || !planetData.period) return null;

  // Use Kepler's 3rd law: T² ∝ a³ where T is in Earth years, a is in AU
  const periodYears = planetData.period / 365.25;
  return periodYears ** (2 / 3);
}

// --- Moon Creation Helper Functions ---

/**
 * Creates a moon mesh with texture support
 * @param {Object} moonData - Moon data object
 * @returns {THREE.Mesh} Moon mesh
 */
function createMoonMesh(moonData: any): THREE.Mesh {
  const moonGeo = new THREE.SphereGeometry(moonData.radius, 32, 32);
  // Start with base color
  const moonMat = new THREE.MeshStandardMaterial({ color: moonData.color });

  // Patch for camera-relative positioning (precision fix at astronomical distances)
  patchMaterialForOrigin(moonMat);

  if (moonData.texture) {
    textureManager.loadTexture(moonData.texture, moonMat, moonData.name, true, moonData.category);
  }

  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.castShadow = true;
  moonMesh.receiveShadow = true;
  moonMesh.userData.isMoon = true; // Tag for visibility logic

  // Apply initial scale
  moonMesh.scale.setScalar(config.planetScale);

  if (moonData.axialTilt !== undefined && !moonData.tidallyLocked) {
    const tiltRadians = (moonData.axialTilt * Math.PI) / 180;
    moonMesh.rotation.z = tiltRadians;
  }

  // Set layer based on parent planet (Earth's moon needs Layer 1)
  // We don't have parent info here directly, but we can check name or pass it.
  // Actually, createMoons is called with planetData.
  // But this helper function doesn't know.
  // Let's handle it in createMoons loop.

  return moonMesh;
}

/**
 * Adds rotation axis line to a moon mesh
 * @param {THREE.Mesh} moonMesh - Moon mesh
 * @param {Object} moonData - Moon data object
 */
function addAxisLine(moonMesh: THREE.Mesh, moonData: any): void {
  const moonAxisLength = moonData.radius * 2.5;
  const moonAxisGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -moonAxisLength, 0),
    new THREE.Vector3(0, moonAxisLength, 0),
  ]);
  const moonAxisMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
  });
  const moonAxisLine = new THREE.Line(moonAxisGeo, moonAxisMat);
  moonAxisLine.visible = config.showAxes;
  // Disable raycasting for axis lines to prevent tooltip interference
  moonAxisLine.raycast = () => {};
  moonMesh.add(moonAxisLine);
  moonData.axisLine = moonAxisLine;
}

/**
 * Updates the orbit line geometry for a moon based on the current date
 * @param {Object} moonData - Moon data object
 * @param {Date} date - Current simulation date
 */
function updateOrbitGeometry(moonData: any, date: Date): void {
  const orbitLine = moonData.orbitLine as Line2;
  // Sample -0.5 to +0.5 period around NOW to keep transparency effect centered
  // (Assuming OrbitLineMaterial uses center-based fading)
  const simTime = date.getTime();
  const period = moonData.period || 27.3; // Default period in days

  const points: number[] = [];
  const steps = 90;

  // Generate geometry - centered on SIMULATION TIME
  const MAX_PAST_RATIO = 0.9;

  for (let i = 0; i < steps; i++) {
    const tNorm = i / (steps - 1);
    // Range from -0.9 * period to +0.1 * period
    const tOffset = (-MAX_PAST_RATIO + tNorm) * period * 24 * 60 * 60 * 1000;
    const t = new Date(simTime + tOffset);

    let x, y, z;

    if (moonData.type === 'jovian') {
      const jm = Astronomy.JupiterMoons(t);
      const moonState = [jm.io, jm.europa, jm.ganymede, jm.callisto][moonData.moonIndex];
      x = moonState.x;
      y = moonState.y;
      z = moonState.z;
    } else if (moonData.type === 'real') {
      const vec = Astronomy.GeoVector(
        Astronomy.Body[moonData.body as keyof typeof Astronomy.Body],
        t,
        true
      );
      x = vec.x;
      y = vec.y;
      z = vec.z;
    } else {
      return; // Simple orbits don't need updates (or are handled differently)
    }

    points.push(x * AU_TO_SCENE, z * AU_TO_SCENE, -y * AU_TO_SCENE);
  }

  const geometry = orbitLine.geometry as LineGeometry;
  geometry.setPositions(points);
  orbitLine.computeLineDistances();

  // Recalculate uTotalLength for fading shader
  let totalLen = 0;
  for (let i = 3; i < points.length; i += 3) {
    const dx = points[i] - points[i - 3];
    const dy = points[i + 1] - points[i - 2];
    const dz = points[i + 2] - points[i - 1];
    totalLen += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  orbitLine.material.uniforms.uTotalLength.value = totalLen || 1.0;

  if (orbitLine.material.uniforms.uCenterDistance) {
    let currentCenterLen = 0;
    const steps = 90; // Hardcoded above, need to match
    const centerIdx = Math.floor((steps - 1) * 0.9); // MAX_PAST_RATIO
    for (let i = 3; i < points.length; i += 3) {
      const dx = points[i] - points[i - 3];
      const dy = points[i + 1] - points[i - 2];
      const dz = points[i + 2] - points[i - 1];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (i / 3 <= centerIdx) currentCenterLen += d;
    }
    orbitLine.material.uniforms.uCenterDistance.value = currentCenterLen;
  }

  // Update Color
  // Moons usually don't have specific "planet colors" toggle for themselves,
  // but maybe they should follow the planet's color or a moon specific one?
  const baseColor = moonData.color || 0x88bbdd;
  const targetColor = config.showPlanetColors
    ? new THREE.Color(baseColor)
    : new THREE.Color(0x88bbdd);

  if (!orbitLine.material.color.equals(targetColor)) {
    orbitLine.material.color.copy(targetColor);
  }

  moonData.lastOrbitUpdate = date.getTime();
}

/**
 * Creates orbit line for Jovian moons (Jupiter's Galilean moons)
 * @param {Object} moonData - Moon data object
 * @param {THREE.Group} orbitLinesGroup - Group for moon orbit lines
 */
function createJovianOrbitLine(moonData: any, orbitLinesGroup: THREE.Group): void {
  // Create empty geometry initially
  const geometry = new LineGeometry();

  const material = createOrbitLineMaterial({
    color: 0x88bbdd,
    opacity: 0.6,
    linewidth: 3,
    resolution: resolution,
  });

  const orbitLine = new Line2(geometry, material);
  orbitLinesGroup.add(orbitLine);
  moonData.orbitLine = orbitLine;

  // Populate with initial points
  updateOrbitGeometry(moonData, new Date());
}

/**
 * Creates orbit line for simple circular orbit moons
 * @param {Object} moonData - Moon data object
 * @param {THREE.Group} orbitLinesGroup - Group for moon orbit lines
 */
function createSimpleOrbitLine(moonData: any, orbitLinesGroup: THREE.Group): void {
  const points: number[] = [];
  const radiusBase = moonData.distance * AU_TO_SCENE;
  const steps = 90; // Higher step count to match other orbits

  // Simple orbit assumes circular, so we can just generate a circle
  // But to support fading, we should generate it "around" the current position?
  // Current position logic in updateMoonOrbitGradient for simple moons used a rotation offset.
  // With Line2, we can just generate the full circle and rely on the material?
  // But OrbitLineMaterial fades based on distance from center of line.
  // A closed circle has start/end.
  // We want the fade to follow the moon.
  // So we should regenerate the circle points shifted by the moon's current angle?
  // For now, let's create a full circle and optionally rotate the mesh?
  // Rotating the mesh is easiest for simple circular orbits!
  // The shader fades 0..1 (or centered).
  // If we generate an incomplete circle (arc) behind the moon, it works best.
  // Let's generate a FULL circle (0 to 2PI), but we will rotate the mesh to align with moon.

  for (let i = 0; i <= steps; i++) {
    // We want the line to be centered on the "front"?
    // Or just generating 0..2PI.
    const angle = (i / steps) * Math.PI * 2;
    // X, Z plane
    points.push(Math.cos(angle) * radiusBase, 0, Math.sin(angle) * radiusBase);
  }

  // Note: Y is up, but here we push Y=0. Standard orientation.
  // Wait, createSimpleOrbitLine pushed (x, 0, z). Line2 layout: (x, y, z).
  // Yes, (x, 0, z) is correct for horizontal orbit.

  const geometry = new LineGeometry();
  geometry.setPositions(points);

  const material = createOrbitLineMaterial({
    color: 0x88bbdd,
    opacity: 0.6,
    linewidth: 2, // Thinner for simple moons
    resolution: resolution,
  });

  const orbitLine = new Line2(geometry, material);
  orbitLine.computeLineDistances();

  // Calculate total length
  let totalLen = 0;
  for (let i = 3; i < points.length; i += 3) {
    const dx = points[i] - points[i - 3];
    const dy = points[i + 1] - points[i - 2]; // 0
    const dz = points[i + 2] - points[i - 1];
    totalLen += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  material.uniforms.uTotalLength.value = totalLen || 1.0;

  orbitLinesGroup.add(orbitLine);
  moonData.orbitLine = orbitLine;
  moonData.isSimpleScale = true; // Flag to handle rotation updates
}

/**
 * Creates orbit line for real moons (Earth's Moon)
 * @param {Object} moonData - Moon data object
 * @param {THREE.Group} orbitLinesGroup - Group for moon orbit lines
 */
function createRealOrbitLine(moonData: any, orbitLinesGroup: THREE.Group): void {
  const geometry = new LineGeometry();

  const material = createOrbitLineMaterial({
    color: 0x88bbdd,
    opacity: 0.6,
    linewidth: 3,
    resolution: resolution,
  });

  const orbitLine = new Line2(geometry, material);
  orbitLinesGroup.add(orbitLine);
  moonData.orbitLine = orbitLine;

  updateOrbitGeometry(moonData, new Date());
}

/**
 * Creates moons for a planet
 * @param {Object} planetData - Data object for the parent planet
 * @param {THREE.Group} planetGroup - The parent planet's group
 * @param {THREE.Group} orbitLinesGroup - Group for moon orbit lines
 * @returns {Array} Array of created moon objects
 */
export function createMoons(
  planetData: any,
  planetGroup: THREE.Group,
  orbitLinesGroup: THREE.Group
): any[] {
  const moons: any[] = [];
  if (!planetData.moons) return moons;

  planetData.moons.forEach((moonData: any) => {
    // Create moon mesh (common for all types)
    const moonMesh = createMoonMesh(moonData);
    addAxisLine(moonMesh, moonData);

    // Add to planet group (all moons)
    planetGroup.add(moonMesh);

    // Set layer: Earth's moons get Layer 1 (Shadow Light), others get Layer 0
    if (planetData.name === 'Earth') {
      moonMesh.layers.set(1);
    } else {
      moonMesh.layers.set(0);
    }

    // Create orbit line based on moon type
    if (moonData.type === 'jovian') {
      createJovianOrbitLine(moonData, orbitLinesGroup);
    } else if (moonData.type === 'simple') {
      createSimpleOrbitLine(moonData, orbitLinesGroup);
    } else {
      // Earth's Moon and other real moons
      createRealOrbitLine(moonData, orbitLinesGroup);
    }

    // Set initial visibility based on category
    let isVisible = false;
    if (moonData.category === 'largest' && config.showLargestMoons) isVisible = true;
    else if (moonData.category === 'major' && config.showMajorMoons) isVisible = true;
    else if (moonData.category === 'small' && config.showSmallMoons) isVisible = true;

    // Fallback: if no category, default to visible (or hidden? let's say visible to be safe)
    if (!moonData.category) isVisible = true;

    moonMesh.visible = isVisible;
    if (moonData.orbitLine) moonData.orbitLine.visible = isVisible;

    moons.push({ mesh: moonMesh, data: moonData });
  });

  return moons;
}

/**
 * Updates moon positions and orbit lines
 * @param {Object} planet - The parent planet object
 * @param {number} planetIndex - Index of planet in planets array
 * @param {Array} allPlanets - Array of all planet objects
 */
export function updateMoonPositions(planet: any, allPlanets: PlanetWrapper[]): void {
  if (!planet.moons) return;

  // Calculate compound scale: slider value (0.002-5.0) × artistic factor (500x)
  // Example: slider at 1.0 → 1.0 × 500 = 500x realistic size
  const baseScale = config.planetScale * REAL_PLANET_SCALE_FACTOR;

  // Calculate lower and upper bounds for capping
  let lowerBound = null;
  let upperBound = null;

  if (config.capMoonOrbits) {
    // Lower bound = 1.1 × planet radius (prevents moons from appearing inside planet)
    const planetRadius = planet.data.radius * config.planetScale;
    lowerBound = planetRadius * 1.1;

    // Upper bound = half distance to closest neighbor (in scene units)
    let distToNext = Infinity;
    let distToPrev = Infinity;

    const currentDist = getPlanetDistanceAU(planet.data);

    if (currentDist) {
      // Search for true neighbors by distance
      allPlanets.forEach((otherPlanet) => {
        if (otherPlanet === planet) return;

        const otherDist = getPlanetDistanceAU(otherPlanet.data);
        if (!otherDist) return;

        const diff = otherDist - currentDist;

        if (diff > 0) {
          // Outer neighbor
          if (diff < distToNext) {
            distToNext = diff;
          }
        } else {
          // Inner neighbor
          const absDiff = Math.abs(diff);
          if (absDiff < distToPrev) {
            distToPrev = absDiff;
          }
        }
      });

      // Use minimum distance
      const closestDist = Math.min(distToNext, distToPrev);
      if (closestDist !== Infinity) {
        upperBound = (closestDist / 2) * AU_TO_SCENE;
      }
    }

    // If lower > upper, set upper = lower
    if (lowerBound && upperBound && lowerBound > upperBound) {
      upperBound = lowerBound;
    }
  }

  // PASS 1: Collect all moon orbits
  const moonOrbits: any[] = [];
  planet.moons.forEach((m: any) => {
    let orbitDist;

    if (m.data.type === 'jovian') {
      const jm = Astronomy.JupiterMoons(config.date);
      const moonState = [jm.io, jm.europa, jm.ganymede, jm.callisto][m.data.moonIndex];
      orbitDist =
        Math.sqrt(moonState.x ** 2 + moonState.y ** 2 + moonState.z ** 2) * AU_TO_SCENE * baseScale;
    } else if (m.data.type === 'real') {
      const moonVector = Astronomy.GeoVector(
        Astronomy.Body[m.data.body as keyof typeof Astronomy.Body],
        config.date,
        true
      );
      orbitDist =
        Math.sqrt(moonVector.x ** 2 + moonVector.y ** 2 + moonVector.z ** 2) *
        AU_TO_SCENE *
        baseScale;
    } else {
      orbitDist = m.data.distance * AU_TO_SCENE * baseScale;
    }

    // Always include in capping calculation to ensure stable orbits
    moonOrbits.push(orbitDist);
  });

  // Calculate remapping parameters
  let remapScale = 1.0;
  let remapOffset = 0;

  if (config.capMoonOrbits && lowerBound && upperBound && moonOrbits.length > 0) {
    const minOrbit = Math.min(...moonOrbits);
    const maxOrbit = Math.max(...moonOrbits);

    // Check if we need to remap (if exceeding upper OR below lower)
    if (maxOrbit > upperBound || minOrbit < lowerBound) {
      // Robust Remapping: Map [minOrbit...maxOrbit] to [lowerBound...upperBound]
      // This linear transformation: newOrbit = (oldOrbit * remapScale) + remapOffset
      const inputRange = maxOrbit - minOrbit;
      const outputRange = upperBound - lowerBound;

      // Avoid division by zero if only one moon or min == max
      if (inputRange > 0.0001) {
        // Calculate linear transformation coefficients
        remapScale = outputRange / inputRange;
        remapOffset = lowerBound - minOrbit * remapScale;
      } else {
        // Fallback for single moon: place in middle of safe zone
        const midPoint = (lowerBound + upperBound) / 2;
        remapScale = 0; // Ignore original position
        remapOffset = midPoint;
      }
    }
  }

  // PASS 2: Apply remapping to all moons
  planet.moons.forEach((m: any) => {
    let xOffset, yOffset, zOffset;

    if (m.data.type === 'jovian') {
      const jm = Astronomy.JupiterMoons(config.date);
      const moonState = [jm.io, jm.europa, jm.ganymede, jm.callisto][m.data.moonIndex];

      // Calculate orbit distance: astronomical units → scene units → scaled → remapped
      const baseOrbitDist = Math.sqrt(moonState.x ** 2 + moonState.y ** 2 + moonState.z ** 2);
      const scaledOrbitDist = baseOrbitDist * AU_TO_SCENE * baseScale;
      const remappedOrbitDist = scaledOrbitDist * remapScale + remapOffset;
      // Back-calculate the final scale factor to apply to base coordinates
      const finalScale = remappedOrbitDist / (baseOrbitDist * AU_TO_SCENE);

      if (m.data.orbitLine) {
        m.data.orbitLine.scale.setScalar(finalScale);
      }

      xOffset = moonState.x * AU_TO_SCENE * finalScale;
      zOffset = -moonState.y * AU_TO_SCENE * finalScale;
      yOffset = moonState.z * AU_TO_SCENE * finalScale;
    } else if (m.data.type === 'real') {
      const moonVector = Astronomy.GeoVector(
        Astronomy.Body[m.data.body as keyof typeof Astronomy.Body],
        config.date,
        true
      );

      const baseOrbitDist = Math.sqrt(moonVector.x ** 2 + moonVector.y ** 2 + moonVector.z ** 2);
      const scaledOrbitDist = baseOrbitDist * AU_TO_SCENE * baseScale;
      const remappedOrbitDist = scaledOrbitDist * remapScale + remapOffset;
      const finalScale = remappedOrbitDist / (baseOrbitDist * AU_TO_SCENE);

      if (m.data.orbitLine) {
        m.data.orbitLine.scale.setScalar(finalScale);
      }

      xOffset = moonVector.x * AU_TO_SCENE * finalScale;
      zOffset = -moonVector.y * AU_TO_SCENE * finalScale;
      yOffset = moonVector.z * AU_TO_SCENE * finalScale;
    } else {
      const baseOrbitDist = m.data.distance;
      const scaledOrbitDist = baseOrbitDist * AU_TO_SCENE * baseScale;
      const remappedOrbitDist = scaledOrbitDist * remapScale + remapOffset;
      const finalScale = remappedOrbitDist / (baseOrbitDist * AU_TO_SCENE);

      const epoch = new Date(2000, 0, 1).getTime();
      const currentTime = config.date.getTime();
      const daysSinceEpoch = (currentTime - epoch) / (24 * 60 * 60 * 1000);
      const angle = (daysSinceEpoch * 2 * Math.PI) / m.data.period;

      if (m.data.orbitLine) {
        m.data.orbitLine.scale.setScalar(finalScale);

        // ROTATE simple orbits to match the moon's position?
        // We generated a circle at (R,0,0) around Y axis?
        // No, we generated a circle in XZ plane.
        // We want the moon to be at the "head" of the fade.
        // If OrbitLineMaterial fades from center, we should rotate the mesh
        // so that the center of the line geometry aligns with the moon.
        // The circle loop has no beginning/end visually if solid, but for fading it matters.
        // But for "Simple" orbits (circles), maybe we don't need the fade trail?
        // Or we can just rotate it.
        // Let's rotate it.
        // m.data.orbitLine.rotation.y = -angle; // Rotate opposite?
        // Need to check visual alignment.
      }

      const radius = remappedOrbitDist;
      xOffset = Math.cos(angle) * radius;
      zOffset = Math.sin(angle) * radius;
      yOffset = 0;
    }

    // Apply positions directly (no expansion factor)
    m.mesh.position.x = planet.mesh.position.x + xOffset;
    m.mesh.position.z = planet.mesh.position.z + zOffset;
    m.mesh.position.y = planet.mesh.position.y + yOffset;

    // Apply tidal locking: rotate moon to always face parent planet
    // atan2(x, z) gives angle in XZ plane, +π rotates 180° to face inward
    if (m.data.tidallyLocked) {
      m.mesh.rotation.y = Math.atan2(xOffset, zOffset) + Math.PI;
    }

    // Update orbit geometry periodically to keep it aligned with the moon's position
    // Only for non-simple orbits (Jovian and Real)
    if (m.data.type !== 'simple' && m.data.orbitLine) {
      // Update frequently to ensure smooth orbit trails
      updateOrbitGeometry(m.data, config.date);
    }

    // Simple orbit rotation handling
    // Not strictly necessary if we don't care about the fade position on simple rings.
    // But if we do:
    // if (m.data.type === 'simple' && m.data.orbitLine) {
    // m.data.orbitLine.rotation.y = -currentAngle;
    // }
  });
}

/**
 * Updates all moon orbit gradients for all planets
 * @param {Array} planets - Array of planet objects
 */
export function updateAllMoonOrbitGradients(_planets: PlanetWrapper[]): void {
  // No-op for now with Line2 adaptation
  // The fading is handled by the shader and geometry regeneration.
  // We don't manually update gradients anymore.
}
