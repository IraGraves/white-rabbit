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
  // We generate a full loop starting from current time
  // So index 0 = Current Time at creation.

  for (let i = 0; i <= steps; i++) {
    const tNorm = i / steps; // 0 to 1 representing full period
    const tOffset = tNorm * periodDays * 24 * 60 * 60 * 1000;
    const t = new Date(startTime.getTime() + tOffset);

    // Calculate position (Heliocentric or Keplerian)
    let pos: THREE.Vector3 | PositionVector | undefined;
    if (data.body) {
      const vec = Astronomy.HelioVector(
        Astronomy.Body[data.body as keyof typeof Astronomy.Body],
        t
      );
      pos = new THREE.Vector3(vec.x * AU_TO_SCENE, vec.z * AU_TO_SCENE, -vec.y * AU_TO_SCENE);
    } else if (data.elements) {
      const vec = calculateKeplerianPosition(data.elements, t);
      pos = new THREE.Vector3(vec.x * AU_TO_SCENE, vec.z * AU_TO_SCENE, -vec.y * AU_TO_SCENE);
    }

    if (pos) {
      points.push(pos.x, pos.y, pos.z);
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
    linewidth: 2.5,
    resolution: resolution,
  });

  const orbitLine = new Line2(geometry, material);
  orbitLine.name = `${data.name}_Orbit`;
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

  material.uniforms.uTotalLength.value = totalLen || 1.0;

  if (data.visible === false) {
    orbitLine.visible = false;
  }

  orbitLine.userData.planetData = data;
  orbitLine.userData.periodDays = periodDays;
  orbitLine.userData.orbitStartMs = startTime.getTime();
  orbitLine.userData.cumulativeDistances = cumulativeDistances;
  orbitLine.userData.totalLength = totalLen;

  orbitGroup.add(orbitLine);

  return orbitLine;
}

/**
 * Updates all orbit line gradients based on current planet positions
 * Uses shader uniform updates instead of geometry regeneration for performance.
 */
export function updateAllOrbitGradients(orbitGroup: THREE.Group, _planets: PlanetWrapper[]): void {
  orbitGroup.children.forEach((child) => {
    const line = child as Line2;
    if (!line.userData.planetData || !line.userData.cumulativeDistances) return;

    // Auto-update visibility for Tesla Roadster based on config
    if (line.userData.planetData.name === 'Tesla Roadster') {
      line.visible = config.showMissions.teslaRoadster;
    }

    const periodDays = line.userData.periodDays || 365;
    const periodMs = periodDays * 24 * 60 * 60 * 1000;
    const startMs = line.userData.orbitStartMs;
    const currentMs = config.date.getTime();

    // Calculate normalized time progress along the orbit
    // Account for wrapping
    let timeDiff = currentMs - startMs;
    // Modulo to keep within 0..period range
    let tNorm = (timeDiff % periodMs) / periodMs;

    // Handle negative time jumps
    if (tNorm < 0) tNorm += 1.0;

    // Use tNorm (0..1) to find distance along the line
    const distances = line.userData.cumulativeDistances;
    const totalLen = line.userData.totalLength;

    // steps is distances.length - 1
    const steps = distances.length - 1;

    // Find approximate index
    const exactIndex = tNorm * steps;
    const indexLow = Math.floor(exactIndex);
    const indexHigh = Math.min(indexLow + 1, steps);
    const floatPart = exactIndex - indexLow;

    // Interpolate distance
    const d1 = distances[indexLow];
    const d2 = distances[indexHigh] ?? totalLen; // Handle edge case at end

    const currentDist = d1 + (d2 - d1) * floatPart;

    const mat = line.material as LineMaterial & {
      uniforms?: { uTotalLength?: { value: number }; uCenterDistance?: { value: number } };
    };

    if (mat.uniforms && mat.uniforms.uCenterDistance) {
      mat.uniforms.uCenterDistance.value = currentDist;
      // uTotalLength should already be set
    }

    // Also periodically check if we need to regenerate the orbit?
    // Planets drift over centuries.
    // If abs(timeDiff) > some huge value, maybe we should regenerate?
    // For now, let's assume the orbit shape is stable enough for visualization.

    // Update Color based on config
    const data = line.userData.planetData;
    const showColors = config.showPlanetColors;
    const showDwarfColors = config.showDwarfPlanetColors;
    const isDwarf = data.type === 'dwarf';
    const isTesla = data.name === 'Tesla Roadster';
    const useColor = (isDwarf ? showDwarfColors : showColors) || isTesla;

    const targetColor = useColor ? new THREE.Color(data.color) : new THREE.Color(0x4488ff);

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
  // No-op
}
