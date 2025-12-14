/**
 * @file orbits.ts (systems)
 * @description Orbit line creation for planets using Astronomy Engine or Keplerian elements.
 *
 * This file generates visual orbit paths for planets and dwarf planets. It samples positions over
 * the body's orbital period to create smooth elliptical Line2 geometries.
 *
 * Key features:
 * - 360-step sampling: Creates smooth curves even for highly elliptical orbits
 * - Astronomy Engine integration: Uses HelioVector for major planets (accurate ephemeris)
 * - Keplerian fallback: Uses custom orbit calculator for dwarf planets (Ceres, Haumea, etc.)
 * - Gradient fade: Orbit lines are brighter near the planet's current position and fade towards the future
 * - Glow effect: Subtle additive glow for enhanced visual appeal
 * - Dynamic coloring: Applies planet-specific colors or neutral gray based on config
 *
 * Orbit lines are added to the orbitGroup for visibility management. The color mode is controlled
 * by `config.showPlanetColors` and `config.showDwarfPlanetColors` settings.
 */
import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import type { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { AU_TO_SCENE, config } from '../config';
import { createOrbitLineMaterial } from '../materials/OrbitLineMaterial';
import { calculateKeplerianPosition } from '../physics/orbits';
import type { CelestialBodyData, PlanetWrapper } from '../types';

/** Position vector with x, y, z coordinates (in AU or scene units) */
interface PositionVector {
  x: number;
  y: number;
  z: number;
}

// Global resolution for Line2 materials
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

export function resizeHeliocentricOrbits(width: number, height: number): void {
  resolution.set(width, height);
}

/**
 * Creates an orbit line for a planet with gradient fade and glow effects
 * @param {Object} data - Planet data object
 * @param {THREE.Group} orbitGroup - Group to add the orbit line to
 * @returns {Line2} The created orbit line
 */
export function createOrbitLine(data: CelestialBodyData, orbitGroup: THREE.Group): Line2 | null {
  if (!data.body && !data.elements) return null;

  const points: number[] = [];
  const steps = 360;
  const startTime = new Date();
  const periodDays = data.period || 365; // Fallback

  // Calculate points for one full orbit relative to NOW
  // We offset by -0.5 * period to center "now" at 0.5 progress
  const startOffset = -0.5 * periodDays * 24 * 60 * 60 * 1000;

  for (let i = 0; i < steps; i++) {
    const tNorm = i / (steps - 1); // 0 to 1
    const tOffset = startOffset + tNorm * periodDays * 24 * 60 * 60 * 1000;
    const t = new Date(startTime.getTime() + tOffset);

    // Calculate position (Heliocentric or Keplerian)
    let pos: THREE.Vector3 | PositionVector | undefined;
    if (data.body) {
      const vec = Astronomy.HelioVector(data.body, t);
      pos = new THREE.Vector3(vec.x * AU_TO_SCENE, vec.z * AU_TO_SCENE, -vec.y * AU_TO_SCENE);
    } else if (data.elements) {
      pos = calculateKeplerianPosition(data.elements, t);
    }

    if (pos) {
      points.push(pos.x, pos.y, pos.z);
    }
  }

  // Gradient Animation Approach:
  // We regenerate the geometry each frame with points sampled from -0.5 to +0.5 orbital period.
  // This keeps the planet at the center of the gradient (index 0.5), with a fading tail behind
  // and a cut opposite the planet. Geometry regeneration for 360 points is efficient.

  for (let i = 0; i <= steps; i++) {
    // normalized t from -0.5 to 0.5
    const tNorm = i / steps - 0.5;
    // time offset
    const tOffset = tNorm * periodDays * 24 * 60 * 60 * 1000;
    const t = new Date(startTime.getTime() + tOffset);

    let vec: PositionVector | undefined;
    if (data.body) {
      vec = Astronomy.HelioVector(Astronomy.Body[data.body as keyof typeof Astronomy.Body], t);
    } else if (data.elements) {
      vec = calculateKeplerianPosition(data.elements, t);
    }
    if (vec) {
      points.push(vec.x * AU_TO_SCENE, vec.z * AU_TO_SCENE, -vec.y * AU_TO_SCENE);
    }
  }

  const geometry = new LineGeometry();
  geometry.setPositions(points);

  const showColors = config.showPlanetColors;
  const showDwarfColors = config.showDwarfPlanetColors;
  const isDwarf = data.type === 'dwarf';
  const isTesla = data.name === 'Tesla Roadster';
  const useColor = (isDwarf ? showDwarfColors : showColors) || isTesla;
  const color = useColor ? data.color || 0x4488ff : 0x4488ff;

  const material = createOrbitLineMaterial({
    color: color,
    opacity: useColor ? 0.9 : 0.6,
    linewidth: 3,
    resolution: resolution,
  });

  const orbitLine = new Line2(geometry, material);
  orbitLine.name = `${data.name}_Orbit`;
  orbitLine.computeLineDistances();

  // Calculate approx length for shader normalization
  // Simple sum of segments
  let totalLen = 0;
  // points array is flat x,y,z
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
    totalLen += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  material.uniforms.uTotalLength.value = totalLen || 1.0;

  if (data.visible === false) {
    orbitLine.visible = false;
  }

  orbitLine.userData.planetData = data;
  orbitLine.userData.periodDays = periodDays;
  orbitLine.userData.lastUpdateTime = startTime.getTime();

  orbitGroup.add(orbitLine);

  return orbitLine;
}

/**
 * Updates all orbit line gradients based on current planet positions
 * Regenerates the geometry to keep the planet centered (for fading effect).
 */
export function updateAllOrbitGradients(orbitGroup: THREE.Group, _planets: PlanetWrapper[]): void {
  // We can throttle this if needed, but 360 points is cheap.

  orbitGroup.children.forEach((child) => {
    const line = child as Line2;
    if (!line.userData.planetData) return;

    // Check update threshold?
    // Visual smoothness requires frequent updates.
    // Let's update every frame for now.

    const data = line.userData.planetData;
    const periodDays = line.userData.periodDays || 365;

    const points: number[] = [];

    // Generate geometry - centered on SIMULATION TIME
    const steps = 360;
    // We want the MIDDLE index to be "NOW" to simplify logic, but since orbits are elliptical,
    // equal time steps != equal distance.
    // The shader now uses `uCenterDistance` (distance in world units).
    // We need to calculate the exact distance from the start of the line to the "Now" vertex.

    // We generate 360 points covering -0.5 period to +0.5 period.
    // Index ~180 is "Now".
    //
    // Start offset logic:
    // Start offset logic:
    // Shift window to show 90% past, 10% future
    const MAX_PAST_RATIO = 0.9;
    const startOffset = -MAX_PAST_RATIO * periodDays * 24 * 60 * 60 * 1000;
    const simTime = config.date.getTime();

    for (let i = 0; i < steps; i++) {
      const tNorm = i / (steps - 1);
      const tOffset = startOffset + tNorm * periodDays * 24 * 60 * 60 * 1000;
      const t = new Date(simTime + tOffset);

      let vec: PositionVector | undefined;
      if (data.body) {
        vec = Astronomy.HelioVector(Astronomy.Body[data.body as keyof typeof Astronomy.Body], t);
      } else if (data.elements) {
        vec = calculateKeplerianPosition(data.elements, t);
      }

      if (vec) {
        points.push(vec.x * AU_TO_SCENE, vec.z * AU_TO_SCENE, -vec.y * AU_TO_SCENE);
      }
    }

    const geo = line.geometry as LineGeometry;
    geo.setPositions(points);
    line.computeLineDistances();

    // Calculate uCenterDistance
    // The "Now" point is at index i such that tOffset ~= 0.
    // If tNorm * period = MAX_PAST_RATIO * period, then tOffset = 0.
    // tNorm = MAX_PAST_RATIO.
    // i / (steps-1) = 0.9 => i = 0.9 * (steps-1).

    let totalLen = 0;
    let centerLen = 0;
    const centerIndex = Math.floor((steps - 1) * MAX_PAST_RATIO);
    // Since steps is even (360), center is 180.

    // Line2 computeLineDistances populates an internal array, but we can't easily read it back
    // synchronously without gpu readback or digging into internals?
    // Actually Line2/LineSegments2 computes it on CPU in JS!
    // But accessing it is accessing line.geometry.attributes.instanceDistance? No.
    // It's simpler to just sum it up here since we have the points.

    for (let i = 3; i < points.length; i += 3) {
      const dx = points[i] - points[i - 3];
      const dy = points[i + 1] - points[i - 2];
      const dz = points[i + 2] - points[i - 1];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      totalLen += dist;

      // Check if we just passed the center index.
      // i starts at 3 (index 1).
      // Vertex index k = i/3.
      // if k == centerIndex...
      const currentVertexIndex = i / 3;
      if (currentVertexIndex <= centerIndex) {
        centerLen += dist;
      }
    }

    const mat = line.material as LineMaterial & {
      uniforms?: { uTotalLength?: { value: number }; uCenterDistance?: { value: number } };
    };
    if (mat.uniforms) {
      if (mat.uniforms.uTotalLength) mat.uniforms.uTotalLength.value = totalLen || 1.0;
      if (mat.uniforms.uCenterDistance) mat.uniforms.uCenterDistance.value = centerLen;
    }

    // Update Color based on config
    const targetColor = config.showPlanetColors
      ? new THREE.Color(data.color)
      : new THREE.Color(0x4488ff);
    if (!mat.color.equals(targetColor)) {
      mat.color.copy(targetColor);
    }
  });
}

// Deprecated: existing updateOrbitGradient was per-line
export function updateOrbitGradient(
  _orbitLine: Line2 | null,
  _planetPosition: THREE.Vector3
): void {
  // No-op, handled by updateAllOrbitGradients regeneration approach
}
