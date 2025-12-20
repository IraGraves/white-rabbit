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
import type { CelestialBodyData, MoonData, MoonWrapper, PlanetWrapper } from '../types';

// Global resolution for Line2 materials
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

export function resizeMoons(width: number, height: number): void {
  resolution.set(width, height);
}

/**
 * Get approximate orbital distance for a planet in AU
 */
function getPlanetDistanceAU(planetData: CelestialBodyData): number | null {
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
function createMoonMesh(moonData: MoonData): THREE.Mesh {
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
function addAxisLine(moonMesh: THREE.Mesh, moonData: MoonData): void {
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
 * Generates the full static orbit geometry for a moon and stores it in userData
 */
function generateMoonOrbitGeometry(moonData: MoonData): void {
  const orbitLine = moonData.orbitLine as Line2;
  const period = moonData.period || 27.3; // Default period in days

  // Align start time to current sim time so index 0 = Now
  const startTime = config.date.getTime();

  const points: number[] = [];
  const steps = 90; // Resolution

  for (let i = 0; i <= steps; i++) {
    const tNorm = i / steps;
    const tOffset = tNorm * period * 24 * 60 * 60 * 1000;
    const t = new Date(startTime + tOffset);

    let x: number, y: number, z: number;

    if (moonData.type === 'jovian' && moonData.moonIndex !== undefined) {
      const jm = Astronomy.JupiterMoons(t);
      const moonState = [jm.io, jm.europa, jm.ganymede, jm.callisto][moonData.moonIndex];
      x = moonState.x;
      y = moonState.y;
      z = moonState.z;
    } else if (moonData.type === 'real' && moonData.body) {
      // Cast string body name to Body enum via keyof typeof lookup, defaulting to Moon if invalid
      const bodyKey = (
        moonData.body in Astronomy.Body ? moonData.body : 'Moon'
      ) as keyof typeof Astronomy.Body;

      const vec = Astronomy.GeoVector(Astronomy.Body[bodyKey], t, true);
      x = vec.x;
      y = vec.y;
      z = vec.z;
    } else {
      return;
    }

    points.push(x * AU_TO_SCENE, z * AU_TO_SCENE, -y * AU_TO_SCENE);
  }

  const geometry = orbitLine.geometry as LineGeometry;
  geometry.setPositions(points);
  orbitLine.computeLineDistances();

  // Calculate cumulative length for fast interpolation
  const cumulativeDistances = [0];
  let totalLen = 0;
  for (let i = 3; i < points.length; i += 3) {
    const x1 = points[i - 3],
      y1 = points[i - 2],
      z1 = points[i - 1];
    const x2 = points[i],
      y2 = points[i + 1],
      z2 = points[i + 2];
    const dx = x2 - x1,
      dy = y2 - y1,
      dz = z2 - z1;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    totalLen += dist;
    cumulativeDistances.push(totalLen);
  }

  if (orbitLine.material.uniforms.uTotalLength) {
    orbitLine.material.uniforms.uTotalLength.value = totalLen || 1.0;
  }

  // Cache data
  moonData.orbitStartMs = startTime;
  moonData.cumulativeDistances = cumulativeDistances;
  moonData.totalOrbitalLength = totalLen;
}

/**
 * Updates the orbit line gradient (uniforms) based on the current date
 * Regenerates geometry if the simulation date has jumped significantly from creation date.
 * @param {Object} moonData - Moon data object
 * @param {Date} date - Current simulation date
 */
function updateOrbitGeometry(moonData: MoonData, date: Date): void {
  // If no geometry generated yet, generate it
  if (!moonData.cumulativeDistances) {
    generateMoonOrbitGeometry(moonData);
    // Proceed to update uniforms immediately
  }

  const orbitLine = moonData.orbitLine as Line2;

  const period = moonData.period || 27.3;
  const periodMs = period * 24 * 60 * 60 * 1000;
  if (moonData.orbitStartMs === undefined) return;
  const startMs = moonData.orbitStartMs;
  const currentMs = date.getTime();

  // ========================================================================
  // GEOMETRY REGENERATION CHECK
  // If the simulation date has jumped more than 7 days from geometry creation,
  // regenerate the orbit geometry to ensure alignment with moon positions.
  // Moon orbits are shorter than planet orbits, so we use a tighter threshold.
  // ========================================================================
  const timeSinceCreation = Math.abs(currentMs - startMs);
  const regenerationThresholdMs = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

  if (timeSinceCreation > regenerationThresholdMs) {
    generateMoonOrbitGeometry(moonData);
  }

  // Calculate normalized time progress along the orbit
  // Use potentially updated orbitStartMs
  const updatedStartMs = moonData.orbitStartMs ?? currentMs;
  const timeDiff = currentMs - updatedStartMs;
  let tNorm = (timeDiff % periodMs) / periodMs;
  if (tNorm < 0) tNorm += 1.0;

  // Interpolate distance
  if (!moonData.cumulativeDistances) return;
  const distances = moonData.cumulativeDistances;
  const totalLen = moonData.totalOrbitalLength;
  const steps = distances.length - 1;

  const exactIndex = tNorm * steps;
  const indexLow = Math.floor(exactIndex);
  const indexHigh = Math.min(indexLow + 1, steps);
  const floatPart = exactIndex - indexLow;

  const d1 = distances[indexLow];
  const d2 = distances[indexHigh] ?? totalLen;

  const currentDist = d1 + (d2 - d1) * floatPart;

  if (orbitLine.material.uniforms.uCenterDistance) {
    orbitLine.material.uniforms.uCenterDistance.value = currentDist;
  }

  // Update Color
  const baseColor = moonData.color || 0x77aaee;
  const targetColor = config.showPlanetColors
    ? new THREE.Color(baseColor)
    : new THREE.Color(0x77aaee);

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
function createJovianOrbitLine(moonData: MoonData, orbitLinesGroup: THREE.Group): void {
  // Create empty geometry initially
  const geometry = new LineGeometry();

  const material = createOrbitLineMaterial({
    color: 0x77aaee,
    opacity: 0.6,
    linewidth: 2,
    resolution: resolution,
  });

  const orbitLine = new Line2(geometry, material);
  orbitLinesGroup.add(orbitLine);
  moonData.orbitLine = orbitLine;

  // Populate with initial points (static geometry)
  updateOrbitGeometry(moonData, config.date);
}

/**
 * Creates orbit line for simple circular orbit moons
 * @param {Object} moonData - Moon data object
 * @param {THREE.Group} orbitLinesGroup - Group for moon orbit lines
 */
function createSimpleOrbitLine(moonData: MoonData, orbitLinesGroup: THREE.Group): void {
  // Simple orbits are circular and handled differently (rotated).
  // We can keep them as is, or unify.
  // Existing implementation generates a circle and rotates it.
  // We'll leave this function mostly alone but ensure uTotalLength is set.

  const points: number[] = [];
  const distance = moonData.distance ?? 0;
  const radiusBase = distance * AU_TO_SCENE;
  const steps = 90;

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    points.push(Math.cos(angle) * radiusBase, 0, Math.sin(angle) * radiusBase);
  }

  const geometry = new LineGeometry();
  geometry.setPositions(points);

  const material = createOrbitLineMaterial({
    color: 0x77aaee,
    opacity: 0.6,
    linewidth: 1.5, // Thinner for simple moons
    resolution: resolution,
  });

  const orbitLine = new Line2(geometry, material);
  orbitLine.computeLineDistances();

  // Calculate total length
  let totalLen = 0;
  for (let i = 3; i < points.length; i += 3) {
    const dx = points[i] - points[i - 3];
    const dy = points[i + 1] - points[i - 2];
    const dz = points[i + 2] - points[i - 1];
    totalLen += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  material.uniforms.uTotalLength.value = totalLen || 1.0;

  orbitLinesGroup.add(orbitLine);
  moonData.orbitLine = orbitLine;
  moonData.isSimpleScale = true;
}

/**
 * Creates orbit line for real moons (Earth's Moon)
 * @param {Object} moonData - Moon data object
 * @param {THREE.Group} orbitLinesGroup - Group for moon orbit lines
 */
function createRealOrbitLine(moonData: MoonData, orbitLinesGroup: THREE.Group): void {
  const geometry = new LineGeometry();

  const material = createOrbitLineMaterial({
    color: 0x77aaee,
    opacity: 0.6,
    linewidth: 2,
    resolution: resolution,
  });

  const orbitLine = new Line2(geometry, material);
  orbitLinesGroup.add(orbitLine);
  moonData.orbitLine = orbitLine;

  updateOrbitGeometry(moonData, config.date);
}

/**
 * Creates moons for a planet
 * @param {Object} planetData - Data object for the parent planet
 * @param {THREE.Group} planetGroup - The parent planet's group
 * @param {THREE.Group} orbitLinesGroup - Group for moon orbit lines
 * @returns {Array} Array of created moon objects
 */
export function createMoons(
  planetData: CelestialBodyData,
  planetGroup: THREE.Group,
  orbitLinesGroup: THREE.Group
): MoonWrapper[] {
  const moons: MoonWrapper[] = [];
  if (!planetData.moons) return moons;

  planetData.moons.forEach((moonData: MoonData) => {
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
export function updateMoonPositions(planet: PlanetWrapper, allPlanets: PlanetWrapper[]): void {
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
  const moonOrbits: number[] = [];
  planet.moons.forEach((m: MoonWrapper) => {
    let orbitDist: number;

    if (m.data.type === 'jovian' && m.data.moonIndex !== undefined) {
      const jm = Astronomy.JupiterMoons(config.date);
      const moonState = [jm.io, jm.europa, jm.ganymede, jm.callisto][m.data.moonIndex];
      orbitDist =
        Math.sqrt(moonState.x ** 2 + moonState.y ** 2 + moonState.z ** 2) * AU_TO_SCENE * baseScale;
    } else if (m.data.type === 'real' && m.data.body) {
      const bodyKey = (
        m.data.body in Astronomy.Body ? m.data.body : 'Moon'
      ) as keyof typeof Astronomy.Body;
      const moonVector = Astronomy.GeoVector(Astronomy.Body[bodyKey], config.date, true);
      orbitDist =
        Math.sqrt(moonVector.x ** 2 + moonVector.y ** 2 + moonVector.z ** 2) *
        AU_TO_SCENE *
        baseScale;
    } else {
      orbitDist = (m.data.distance || 0) * AU_TO_SCENE * baseScale;
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
  planet.moons.forEach((m: MoonWrapper) => {
    let xOffset: number, yOffset: number, zOffset: number;

    if (m.data.type === 'jovian' && m.data.moonIndex !== undefined) {
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
    } else if (m.data.type === 'real' && m.data.body) {
      const bodyKey = (
        m.data.body in Astronomy.Body ? m.data.body : 'Moon'
      ) as keyof typeof Astronomy.Body;
      const moonVector = Astronomy.GeoVector(Astronomy.Body[bodyKey], config.date, true);

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
      const baseOrbitDist = m.data.distance || 0;
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
