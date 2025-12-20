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

// Global resolution for Line2 materials
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

export function resizeHeliocentricOrbits(width: number, height: number): void {
  resolution.set(width, height);
}

// --- Hermite Spline Interpolation for Smooth Planet Orbits ---

interface HermiteControlPoint {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  time: number;
}

/**
 * Cubic Hermite interpolation between two points with velocities.
 */
function hermiteInterpolate(
  p0: THREE.Vector3,
  v0: THREE.Vector3,
  p1: THREE.Vector3,
  v1: THREE.Vector3,
  t: number
): THREE.Vector3 {
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  return new THREE.Vector3(
    h00 * p0.x + h10 * v0.x + h01 * p1.x + h11 * v1.x,
    h00 * p0.y + h10 * v0.y + h01 * p1.y + h11 * v1.y,
    h00 * p0.z + h10 * v0.z + h01 * p1.z + h11 * v1.z
  );
}

/**
 * Derivative of cubic Hermite interpolation for arc length calculation.
 */
function hermiteDerivative(
  p0: THREE.Vector3,
  v0: THREE.Vector3,
  p1: THREE.Vector3,
  v1: THREE.Vector3,
  t: number
): THREE.Vector3 {
  const t2 = t * t;
  const h00p = 6 * t2 - 6 * t;
  const h10p = 3 * t2 - 4 * t + 1;
  const h01p = -6 * t2 + 6 * t;
  const h11p = 3 * t2 - 2 * t;

  return new THREE.Vector3(
    h00p * p0.x + h10p * v0.x + h01p * p1.x + h11p * v1.x,
    h00p * p0.y + h10p * v0.y + h01p * p1.y + h11p * v1.y,
    h00p * p0.z + h10p * v0.z + h01p * p1.z + h11p * v1.z
  );
}

// 5-point Gaussian quadrature for arc length
const GAUSS_WEIGHTS = [0.2369269, 0.4786287, 0.5688889, 0.4786287, 0.2369269];
const GAUSS_ABSCISSAE = [0.0469101, 0.2307653, 0.5, 0.7692347, 0.9530899];

function hermiteArcLength(
  p0: THREE.Vector3,
  v0: THREE.Vector3,
  p1: THREE.Vector3,
  v1: THREE.Vector3,
  tEnd: number = 1.0
): number {
  let sum = 0;
  const halfT = tEnd / 2;
  for (let i = 0; i < 5; i++) {
    const t = halfT * (GAUSS_ABSCISSAE[i] + 1);
    const derivative = hermiteDerivative(p0, v0, p1, v1, t);
    sum += GAUSS_WEIGHTS[i] * derivative.length();
  }
  return halfT * sum;
}

/**
 * Generates orbit points using Hermite spline interpolation.
 */
function generateHermiteOrbit(controlPoints: HermiteControlPoint[], outputSteps: number): number[] {
  const points: number[] = [];
  const numSegments = controlPoints.length - 1;
  const stepsPerSegment = Math.ceil(outputSteps / numSegments);

  for (let seg = 0; seg < numSegments; seg++) {
    const cp0 = controlPoints[seg];
    const cp1 = controlPoints[seg + 1];
    const dt = (cp1.time - cp0.time) / (24 * 60 * 60 * 1000);
    const v0Scaled = cp0.vel.clone().multiplyScalar(dt);
    const v1Scaled = cp1.vel.clone().multiplyScalar(dt);
    const numSteps = seg === numSegments - 1 ? stepsPerSegment + 1 : stepsPerSegment;

    for (let i = 0; i < numSteps; i++) {
      if (seg > 0 && i === 0) continue;
      const t = i / stepsPerSegment;
      const pos = hermiteInterpolate(cp0.pos, v0Scaled, cp1.pos, v1Scaled, t);
      points.push(pos.x, pos.y, pos.z);
    }
  }
  return points;
}

/**
 * Creates an orbit line for a planet with gradient fade and glow effects
 * @param {Object} data - Planet data object
 * @param {THREE.Group} orbitGroup - Group to add the orbit line to
 * @returns {Line2} The created orbit line
 */
export function createOrbitLine(data: CelestialBodyData, orbitGroup: THREE.Group): Line2 | null {
  if (!data.body && !data.elements) return null;

  let points: number[] = [];
  const steps = 360;
  const startTime = new Date(config.date);
  const periodDays = data.period || 365;
  const periodMs = periodDays * 24 * 60 * 60 * 1000;

  // Use Hermite splines for smooth orbit generation
  const numControlPoints = 24;
  const controlPoints: HermiteControlPoint[] = [];

  for (let i = 0; i <= numControlPoints; i++) {
    const tNorm = i / numControlPoints;
    const tOffset = tNorm * periodMs;
    const t = new Date(startTime.getTime() + tOffset);

    let pos: THREE.Vector3;
    let vel: THREE.Vector3;

    if (data.body) {
      // Use HelioState for direct position + velocity
      const bodyKey = data.body as keyof typeof Astronomy.Body;
      const state = Astronomy.HelioState(Astronomy.Body[bodyKey], t);

      // Position in scene coordinates (X=x, Y=z, Z=-y)
      pos = new THREE.Vector3(state.x * AU_TO_SCENE, state.z * AU_TO_SCENE, -state.y * AU_TO_SCENE);

      // Velocity in scene coordinates (same transform, AU/day -> scene/day)
      vel = new THREE.Vector3(
        state.vx * AU_TO_SCENE,
        state.vz * AU_TO_SCENE,
        -state.vy * AU_TO_SCENE
      );
    } else if (data.elements) {
      // Keplerian: use finite difference for velocity (1 minute delta)
      const vec = calculateKeplerianPosition(data.elements, t);
      pos = new THREE.Vector3(vec.x * AU_TO_SCENE, vec.z * AU_TO_SCENE, -vec.y * AU_TO_SCENE);

      const dtMs = 60 * 1000; // 1 minute
      const tNext = new Date(t.getTime() + dtMs);
      const vecNext = calculateKeplerianPosition(data.elements, tNext);
      const dtDays = dtMs / (24 * 60 * 60 * 1000);
      vel = new THREE.Vector3(
        ((vecNext.x - vec.x) / dtDays) * AU_TO_SCENE,
        ((vecNext.z - vec.z) / dtDays) * AU_TO_SCENE,
        (-(vecNext.y - vec.y) / dtDays) * AU_TO_SCENE
      );
    } else {
      continue;
    }

    controlPoints.push({ pos, vel, time: startTime.getTime() + tOffset });
  }

  // Generate dense output via Hermite interpolation
  if (controlPoints.length > 1) {
    points = generateHermiteOrbit(controlPoints, steps);
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
  orbitLine.userData.points = points;

  // Store Hermite control points with SCALED velocities for arc length calculation
  const hermiteData: HermiteControlPoint[] = [];
  const segmentArcLengths: number[] = [];

  for (let i = 0; i <= numControlPoints; i++) {
    const tNorm = i / numControlPoints;
    const tOffset = tNorm * periodMs;
    const t = new Date(startTime.getTime() + tOffset);

    let pos: THREE.Vector3;
    let velRaw: THREE.Vector3;

    if (data.body) {
      const bodyKey = data.body as keyof typeof Astronomy.Body;
      const state = Astronomy.HelioState(Astronomy.Body[bodyKey], t);
      pos = new THREE.Vector3(state.x * AU_TO_SCENE, state.z * AU_TO_SCENE, -state.y * AU_TO_SCENE);
      velRaw = new THREE.Vector3(
        state.vx * AU_TO_SCENE,
        state.vz * AU_TO_SCENE,
        -state.vy * AU_TO_SCENE
      );
    } else if (data.elements) {
      const vec = calculateKeplerianPosition(data.elements, t);
      pos = new THREE.Vector3(vec.x * AU_TO_SCENE, vec.z * AU_TO_SCENE, -vec.y * AU_TO_SCENE);
      const dtMs = 60 * 1000;
      const tNext = new Date(t.getTime() + dtMs);
      const vecNext = calculateKeplerianPosition(data.elements, tNext);
      const dtDays = dtMs / (24 * 60 * 60 * 1000);
      velRaw = new THREE.Vector3(
        ((vecNext.x - vec.x) / dtDays) * AU_TO_SCENE,
        ((vecNext.z - vec.z) / dtDays) * AU_TO_SCENE,
        (-(vecNext.y - vec.y) / dtDays) * AU_TO_SCENE
      );
    } else {
      continue;
    }

    // Scale velocity by segment time interval
    const dtDays = periodDays / numControlPoints;
    const vel = velRaw.clone().multiplyScalar(dtDays);
    hermiteData.push({ pos, vel, time: startTime.getTime() + tOffset });
  }

  // Pre-compute arc lengths for each segment
  for (let seg = 0; seg < numControlPoints; seg++) {
    const arcLen = hermiteArcLength(
      hermiteData[seg].pos,
      hermiteData[seg].vel,
      hermiteData[seg + 1].pos,
      hermiteData[seg + 1].vel,
      1.0
    );
    segmentArcLengths.push(arcLen);
  }

  orbitLine.userData.hermiteControlPoints = hermiteData;
  orbitLine.userData.segmentArcLengths = segmentArcLengths;

  orbitGroup.add(orbitLine);

  return orbitLine;
}

/**
 * Finds the index of the closest point on the orbit using coarse linear scan + refinement.
 * Uses Euclidean distance for accuracy (avoids angle wraparound issues).
 * @param points - Flat array [x,y,z, x,y,z, ...] of orbit positions
 * @param target - Target position (planet mesh) in orbit's local space
 * @param numPoints - Number of points in the orbit
 * @returns Index (integer) of closest point
 */
function findClosestPointIndex(points: number[], target: THREE.Vector3, numPoints: number): number {
  // Phase 1: Coarse scan (every 12th point = ~30 samples for 360 points)
  let bestIndex = 0;
  let bestDistSq = Infinity;
  const stride = Math.max(1, Math.floor(numPoints / 30));

  for (let i = 0; i < numPoints; i += stride) {
    const idx = i * 3;
    const dx = points[idx] - target.x;
    const dy = points[idx + 1] - target.y;
    const dz = points[idx + 2] - target.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      bestIndex = i;
    }
  }

  // Phase 2: Refine around best match (±stride)
  const searchStart = Math.max(0, bestIndex - stride);
  const searchEnd = Math.min(numPoints - 1, bestIndex + stride);

  for (let i = searchStart; i <= searchEnd; i++) {
    const idx = i * 3;
    const dx = points[idx] - target.x;
    const dy = points[idx + 1] - target.y;
    const dz = points[idx + 2] - target.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      bestIndex = i;
    }
  }

  return bestIndex;
}

/**
 * Updates all orbit line gradients based on current planet positions.
 * Uses angular binary search to find closest point on orbit to planet mesh.
 * This fixes drift over long simulation periods by syncing with actual positions.
 */
export function updateAllOrbitGradients(orbitGroup: THREE.Group, planets: PlanetWrapper[]): void {
  orbitGroup.children.forEach((child) => {
    const line = child as Line2;
    if (!line.userData.planetData || !line.userData.cumulativeDistances) return;

    // Auto-update visibility for Tesla Roadster based on config
    if (line.userData.planetData.name === 'Tesla Roadster') {
      line.visible = config.showMissions.teslaRoadster;
    }

    // Auto-update visibility for Tesla Roadster based on config
    if (line.userData.planetData.name === 'Tesla Roadster') {
      line.visible = config.showMissions.teslaRoadster;
    }

    let currentDist: number;

    // --- Smooth Geometric Projection ---
    // Instead of relying on time (which drifts due to Kepler speed variation vs Hermite linear speed),
    // we find the closest point physically on the orbit line and project the planet onto it.

    // 1. Get raw points and cumulative distances
    const points = line.userData.points as number[] | undefined;
    if (!points) return;
    const distances = line.userData.cumulativeDistances as number[];
    const totalLen = line.userData.totalLength as number;

    // 2. Get planet position in orbit's local space
    const planet = planets.find((p) => p.data.name === line.userData.planetData.name);
    if (!planet) return;

    const worldPos = new THREE.Vector3();
    planet.mesh.getWorldPosition(worldPos);
    const localPos = line.worldToLocal(worldPos.clone());

    // 3. Find closest index (coarse scan + refinement)
    const numPoints = points.length / 3;
    const closestIndex = findClosestPointIndex(points, localPos, numPoints);

    // 4. Calculate smooth distance via tangent projection
    // Get P_current
    const i = closestIndex;
    const idx3 = i * 3;
    const pCurrent = new THREE.Vector3(points[idx3], points[idx3 + 1], points[idx3 + 2]);

    // Get Neighbors (handle wrap-around for closed loops)
    // Points has 361 elements (0..360), where 0 and 360 are coincident
    // Predecessor
    let iPrev = i - 1;
    if (iPrev < 0) iPrev = numPoints - 2; // Wrap to 359 (since 360==0)

    // Successor
    let iNext = i + 1;
    if (iNext >= numPoints) iNext = 1; // Wrap to 1 (skip 0/360 dup)

    const idxPrev = iPrev * 3;
    const idxNext = iNext * 3;

    const pPrev = new THREE.Vector3(points[idxPrev], points[idxPrev + 1], points[idxPrev + 2]);
    const pNext = new THREE.Vector3(points[idxNext], points[idxNext + 1], points[idxNext + 2]);

    // Tangent at P_current (approximate Central Difference)
    const tangent = new THREE.Vector3().subVectors(pNext, pPrev).normalize();

    // Project vector (Planet - P_current) onto Tangent
    const vecToPlanet = new THREE.Vector3().subVectors(localPos, pCurrent);
    const projection = vecToPlanet.dot(tangent);

    // 5. Final Distance
    currentDist = distances[i] + projection;

    // Handle wrap-around of the distance value itself
    if (currentDist < 0) currentDist += totalLen;
    if (currentDist > totalLen) currentDist -= totalLen;

    const mat = line.material as LineMaterial & {
      uniforms?: { uTotalLength?: { value: number }; uCenterDistance?: { value: number } };
    };

    if (mat.uniforms?.uCenterDistance) {
      mat.uniforms.uCenterDistance.value = currentDist;
    }

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
