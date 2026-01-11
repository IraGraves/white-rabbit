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
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { AU_TO_SCENE, REAL_PLANET_SCALE_FACTOR, config } from '../config';
import { textureManager } from '../managers/TextureManager';
import { patchMaterialForOrigin } from '../materials/MaterialFactory';
import { createOrbitLineMaterial } from '../materials/OrbitLineMaterial';
import type { CelestialBodyData, MoonData, MoonWrapper, PlanetWrapper } from '../types';
import { MoonGlobe } from './lod/MoonGlobe';

// Global resolution for Line2 materials
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

export function resizeMoons(width: number, height: number): void {
  resolution.set(width, height);
}

// --- Hermite Spline Interpolation for Smooth Orbits ---

/**
 * Cubic Hermite interpolation between two points with velocities.
 * @param p0 Start position
 * @param v0 Start velocity (tangent)
 * @param p1 End position
 * @param v1 End velocity (tangent)
 * @param t Parameter 0-1
 * @returns Interpolated position
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

  // Hermite basis functions
  const h00 = 2 * t3 - 3 * t2 + 1; // Position at start
  const h10 = t3 - 2 * t2 + t; // Tangent at start
  const h01 = -2 * t3 + 3 * t2; // Position at end
  const h11 = t3 - t2; // Tangent at end

  return new THREE.Vector3(
    h00 * p0.x + h10 * v0.x + h01 * p1.x + h11 * v1.x,
    h00 * p0.y + h10 * v0.y + h01 * p1.y + h11 * v1.y,
    h00 * p0.z + h10 * v0.z + h01 * p1.z + h11 * v1.z
  );
}

/**
 * Generates orbit points using Hermite spline interpolation.
 * Samples few control points with state vectors, generates dense output.
 * @param controlPoints Array of {pos, vel, time} control points
 * @param outputSteps Number of output points to generate
 * @returns Flat array of positions [x,y,z, x,y,z, ...]
 */
function generateHermiteOrbit(
  controlPoints: Array<{ pos: THREE.Vector3; vel: THREE.Vector3; time: number }>,
  outputSteps: number
): number[] {
  const points: number[] = [];
  const numSegments = controlPoints.length - 1;
  const stepsPerSegment = Math.ceil(outputSteps / numSegments);

  for (let seg = 0; seg < numSegments; seg++) {
    const cp0 = controlPoints[seg];
    const cp1 = controlPoints[seg + 1];

    // Calculate time span for velocity scaling
    const dt = (cp1.time - cp0.time) / (24 * 60 * 60 * 1000); // Convert ms to days

    // Scale velocities by time interval (vel is in AU/day, times dt gives AU)
    const v0Scaled = cp0.vel.clone().multiplyScalar(dt);
    const v1Scaled = cp1.vel.clone().multiplyScalar(dt);

    const numSteps = seg === numSegments - 1 ? stepsPerSegment + 1 : stepsPerSegment;

    for (let i = 0; i < numSteps; i++) {
      // Skip first point of subsequent segments (already added by previous)
      if (seg > 0 && i === 0) continue;

      const t = i / stepsPerSegment;
      const pos = hermiteInterpolate(cp0.pos, v0Scaled, cp1.pos, v1Scaled, t);
      points.push(pos.x, pos.y, pos.z);
    }
  }

  return points;
}

/**
 * Derivative of cubic Hermite interpolation (velocity/tangent at parameter t).
 * Used for arc length calculation.
 */
function hermiteDerivative(
  p0: THREE.Vector3,
  v0: THREE.Vector3,
  p1: THREE.Vector3,
  v1: THREE.Vector3,
  t: number
): THREE.Vector3 {
  const t2 = t * t;

  // Derivative of Hermite basis functions
  const h00p = 6 * t2 - 6 * t; // d/dt of (2t³ - 3t² + 1)
  const h10p = 3 * t2 - 4 * t + 1; // d/dt of (t³ - 2t² + t)
  const h01p = -6 * t2 + 6 * t; // d/dt of (-2t³ + 3t²)
  const h11p = 3 * t2 - 2 * t; // d/dt of (t³ - t²)

  return new THREE.Vector3(
    h00p * p0.x + h10p * v0.x + h01p * p1.x + h11p * v1.x,
    h00p * p0.y + h10p * v0.y + h01p * p1.y + h11p * v1.y,
    h00p * p0.z + h10p * v0.z + h01p * p1.z + h11p * v1.z
  );
}

// 5-point Gaussian quadrature weights and abscissae for [0, 1] interval
const GAUSS_WEIGHTS = [0.2369269, 0.4786287, 0.5688889, 0.4786287, 0.2369269];
const GAUSS_ABSCISSAE = [0.0469101, 0.2307653, 0.5, 0.7692347, 0.9530899];

/**
 * Calculate arc length of a Hermite segment from t=0 to t=tEnd.
 * Uses 5-point Gaussian quadrature for accuracy.
 * @param p0 Start position
 * @param v0 Start velocity (scaled by time interval)
 * @param p1 End position
 * @param v1 End velocity (scaled by time interval)
 * @param tEnd End parameter (0-1), defaults to 1 for full segment
 * @returns Arc length in scene units
 */
function hermiteArcLength(
  p0: THREE.Vector3,
  v0: THREE.Vector3,
  p1: THREE.Vector3,
  v1: THREE.Vector3,
  tEnd: number = 1.0
): number {
  // Gaussian quadrature: ∫₀^tEnd |H'(t)| dt ≈ tEnd/2 * Σ wᵢ * |H'((tEnd/2)(xᵢ+1))|
  let sum = 0;
  const halfT = tEnd / 2;

  for (let i = 0; i < 5; i++) {
    const t = halfT * (GAUSS_ABSCISSAE[i] + 1); // Map [-1,1] to [0, tEnd]
    const derivative = hermiteDerivative(p0, v0, p1, v1, t);
    sum += GAUSS_WEIGHTS[i] * derivative.length();
  }

  return halfT * sum;
}

// Type for Hermite control point
interface HermiteControlPoint {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  time: number;
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

// iTowns MoonGlobe Instance (replaces old MoonQuadtree)
let moonGlobe: MoonGlobe | null = null;

/**
 * Creates a moon mesh with texture support
 * @param {Object} moonData - Moon data object
 * @param {THREE.WebGLRenderer} renderer - Optional renderer for iTowns integration
 * @returns {THREE.Mesh} Moon mesh
 */
function createMoonMesh(
  moonData: MoonData,
  scene: THREE.Object3D,
  renderer?: THREE.WebGLRenderer
): THREE.Mesh {
  const moonGeo = new THREE.SphereGeometry(moonData.radius, 64, 64); // Increased segments for displacement

  let moonMat: THREE.Material;

  // Check if this is Earth's Moon for iTowns LOD Rendering
  if (moonData.name === 'Moon' && renderer) {
    console.log('--- Creating Moon with iTowns GlobeView ---');

    // Initialize MoonGlobe with iTowns
    console.log('🌑 [DEBUG] Instantiating MoonGlobe for:', moonData.name);
    try {
      moonGlobe = new MoonGlobe({
        renderer: renderer,
        radius: moonData.radius,
        textureManager: textureManager,
        scene: scene,
      });
      console.log('🌑 [DEBUG] MoonGlobe Instantiated:', !!moonGlobe);
    } catch (e) {
      console.error('🌑 [DEBUG] MoonGlobe Instantiation FAILED:', e);
    }

    // Get the mesh group from MoonGlobe
    if (!moonGlobe) {
      console.error('🌑 [CRITICAL] MoonGlobe is null after instantiation!');
      // Fallback or throw?
      // Just return a dummy to prevent crash
      return new THREE.Mesh();
    }
    const meshGroup = moonGlobe.getGroup();

    // Apply axial tilt to the group
    if (moonData.axialTilt !== undefined) {
      meshGroup.rotation.z = (moonData.axialTilt * Math.PI) / 180;
    }

    // Create container mesh (for compatibility with existing code structure)
    const containerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    containerMesh.name = 'MoonContainer';
    containerMesh.add(meshGroup);

    containerMesh.castShadow = true;
    containerMesh.receiveShadow = true;
    containerMesh.frustumCulled = false; // Important: children are larger/dynamic
    containerMesh.userData.isMoon = true;
    containerMesh.userData.moonGlobe = moonGlobe;
    containerMesh.scale.setScalar(config.planetScale);

    return containerMesh;
  } else if (moonData.name === 'Moon' && !renderer) {
    // Fallback: Earth's Moon without renderer (shouldn't happen in normal flow)
    console.warn('Moon creation without renderer - using simple sphere fallback');
    const stdMat = new THREE.MeshStandardMaterial({ color: moonData.color || 0xaaaaaa });
    patchMaterialForOrigin(stdMat);
    textureManager.loadTexture(
      `${import.meta.env.BASE_URL}assets/textures/moon.jpg`,
      stdMat,
      moonData.name,
      true,
      moonData.category
    );
    moonMat = stdMat;
  } else {
    // Standard Moon (not Earth's Moon)
    const stdMat = new THREE.MeshStandardMaterial({ color: moonData.color });
    patchMaterialForOrigin(stdMat);
    if (moonData.texture) {
      textureManager.loadTexture(moonData.texture, stdMat, moonData.name, true, moonData.category);
    }
    moonMat = stdMat;
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
  const moonAxisGeo = new LineGeometry();
  moonAxisGeo.setPositions([0, -moonAxisLength, 0, 0, moonAxisLength, 0]);

  const moonAxisMat = new LineMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    linewidth: 3, // px
    resolution: resolution,
  });
  const moonAxisLine = new Line2(moonAxisGeo, moonAxisMat);
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

  let points: number[] = [];
  const steps = 120; // Resolution

  // Use Hermite splines for Jovian moons and Earth's Moon (type 'real' with body 'Moon')
  const useHermite =
    (moonData.type === 'jovian' && moonData.moonIndex !== undefined) ||
    (moonData.type === 'real' && moonData.body === 'Moon');

  if (useHermite) {
    // Sample 8 control points with state vectors
    const numControlPoints = 8;
    const controlPoints: Array<{ pos: THREE.Vector3; vel: THREE.Vector3; time: number }> = [];

    for (let i = 0; i <= numControlPoints; i++) {
      const tNorm = i / numControlPoints;
      const tOffset = tNorm * period * 24 * 60 * 60 * 1000;
      const t = new Date(startTime + tOffset);

      let pos: THREE.Vector3;
      let vel: THREE.Vector3;

      if (moonData.type === 'jovian' && moonData.moonIndex !== undefined) {
        const jm = Astronomy.JupiterMoons(t);
        const moonStates = [jm.io, jm.europa, jm.ganymede, jm.callisto];
        const moonState = moonStates[moonData.moonIndex];

        // Position in scene coordinates (X=x, Y=z, Z=-y)
        pos = new THREE.Vector3(
          moonState.x * AU_TO_SCENE,
          moonState.z * AU_TO_SCENE,
          -moonState.y * AU_TO_SCENE
        );

        // Velocity in scene coordinates (same transform)
        vel = new THREE.Vector3(
          moonState.vx * AU_TO_SCENE,
          moonState.vz * AU_TO_SCENE,
          -moonState.vy * AU_TO_SCENE
        );
      } else {
        // Earth's Moon - use HelioState subtraction for geocentric position + velocity
        const moonHelio = Astronomy.HelioState(Astronomy.Body.Moon, t);
        const earthHelio = Astronomy.HelioState(Astronomy.Body.Earth, t);

        // Geocentric position = Moon - Earth (in AU)
        const geoX = moonHelio.x - earthHelio.x;
        const geoY = moonHelio.y - earthHelio.y;
        const geoZ = moonHelio.z - earthHelio.z;

        // Geocentric velocity = Moon velocity - Earth velocity (in AU/day)
        const geoVx = moonHelio.vx - earthHelio.vx;
        const geoVy = moonHelio.vy - earthHelio.vy;
        const geoVz = moonHelio.vz - earthHelio.vz;

        // Convert to scene coordinates (X=x, Y=z, Z=-y)
        pos = new THREE.Vector3(geoX * AU_TO_SCENE, geoZ * AU_TO_SCENE, -geoY * AU_TO_SCENE);
        vel = new THREE.Vector3(geoVx * AU_TO_SCENE, geoVz * AU_TO_SCENE, -geoVy * AU_TO_SCENE);
      }

      controlPoints.push({ pos, vel, time: startTime + tOffset });
    }

    // Generate dense output via Hermite interpolation
    points = generateHermiteOrbit(controlPoints, steps);
  } else {
    // Original point-by-point sampling for simple circular moons
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

  // Create Connector Line if it doesn't exist
  if (!orbitLine.userData.connector) {
    const connectorGeo = new LineGeometry();
    connectorGeo.setPositions([0, 0, 0, 0, 0, 0]); // Init
    const connectorMat = new LineMaterial({
      color: 0xffffff,
      linewidth: 2.5,
      resolution: resolution,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const connector = new Line2(connectorGeo, connectorMat);
    connector.name = 'Connector';
    connector.visible = false;
    orbitLine.add(connector);
    orbitLine.userData.connector = connector;
  }

  // Cache data
  moonData.orbitStartMs = startTime;
  moonData.cumulativeDistances = cumulativeDistances;
  moonData.totalOrbitalLength = totalLen;
  moonData.orbitPoints = points; // Store raw points for position-based lookup

  // For Hermite moons: store control points with SCALED velocities for arc length calculation
  const storeHermite =
    (moonData.type === 'jovian' && moonData.moonIndex !== undefined) ||
    (moonData.type === 'real' && moonData.body === 'Moon');

  if (storeHermite) {
    // Rebuild control points with scaled velocities for arc length
    const numControlPoints = 8;
    const hermiteData: HermiteControlPoint[] = [];
    const segmentArcLengths: number[] = [];

    for (let i = 0; i <= numControlPoints; i++) {
      const tNorm = i / numControlPoints;
      const tOffset = tNorm * period * 24 * 60 * 60 * 1000;
      const t = new Date(startTime + tOffset);

      let pos: THREE.Vector3;
      let velRaw: THREE.Vector3;

      if (moonData.type === 'jovian' && moonData.moonIndex !== undefined) {
        const jm = Astronomy.JupiterMoons(t);
        const moonStates = [jm.io, jm.europa, jm.ganymede, jm.callisto];
        const moonState = moonStates[moonData.moonIndex];

        pos = new THREE.Vector3(
          moonState.x * AU_TO_SCENE,
          moonState.z * AU_TO_SCENE,
          -moonState.y * AU_TO_SCENE
        );

        velRaw = new THREE.Vector3(
          moonState.vx * AU_TO_SCENE,
          moonState.vz * AU_TO_SCENE,
          -moonState.vy * AU_TO_SCENE
        );
      } else {
        // Earth's Moon - use HelioState subtraction for geocentric position + velocity
        const moonHelio = Astronomy.HelioState(Astronomy.Body.Moon, t);
        const earthHelio = Astronomy.HelioState(Astronomy.Body.Earth, t);

        const geoX = moonHelio.x - earthHelio.x;
        const geoY = moonHelio.y - earthHelio.y;
        const geoZ = moonHelio.z - earthHelio.z;
        const geoVx = moonHelio.vx - earthHelio.vx;
        const geoVy = moonHelio.vy - earthHelio.vy;
        const geoVz = moonHelio.vz - earthHelio.vz;

        pos = new THREE.Vector3(geoX * AU_TO_SCENE, geoZ * AU_TO_SCENE, -geoY * AU_TO_SCENE);
        velRaw = new THREE.Vector3(geoVx * AU_TO_SCENE, geoVz * AU_TO_SCENE, -geoVy * AU_TO_SCENE);
      }

      // Scale velocity by segment time interval (period / numControlPoints days)
      const dtDays = period / numControlPoints;
      const vel = velRaw.clone().multiplyScalar(dtDays);

      hermiteData.push({ pos, vel, time: startTime + tOffset });
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

    // Store for use in updateOrbitGeometry
    (
      moonData as MoonData & {
        hermiteControlPoints?: HermiteControlPoint[];
        segmentArcLengths?: number[];
      }
    ).hermiteControlPoints = hermiteData;
    (moonData as MoonData & { segmentArcLengths?: number[] }).segmentArcLengths = segmentArcLengths;
  }
}

/**
 * Finds the index of the closest point on the orbit using coarse linear scan + refinement.
 * Uses stride of 12 for consistency with planet orbit search.
 * @param points - Flat array [x,y,z, x,y,z, ...] of orbit positions
 * @param target - Target position (moon mesh) in orbit's local space
 * @param numPoints - Number of points in the orbit
 * @returns Index (integer) of closest point
 */
function findClosestMoonPointIndex(
  points: number[],
  target: THREE.Vector3,
  numPoints: number
): number {
  // Exclude last point (pt[numPoints-1] == pt[0] for closed orbits, would cause distance jump)
  const searchLimit = numPoints - 1;

  // Phase 1: Coarse scan (every 5th point)
  let bestIndex = 0;
  let bestDistSq = Infinity;
  const stride = 5;

  for (let i = 0; i < searchLimit; i += stride) {
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
  const searchEnd = Math.min(searchLimit - 1, bestIndex + stride);

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
 * Updates the orbit line gradient (uniforms) based on the moon's actual position.
 * Uses position-based lookup for accuracy over long simulation periods.
 * Does NOT regenerate geometry unless it's missing.
 * @param moonData - Moon data object
 * @param moonMesh - The moon's mesh (for position lookup). Optional during initial creation.
 */
function updateOrbitGeometry(moonData: MoonData, moonMesh?: THREE.Mesh): void {
  // If no geometry generated yet, generate it
  if (!moonData.cumulativeDistances) {
    generateMoonOrbitGeometry(moonData);
  }

  const orbitLine = moonData.orbitLine as Line2;
  if (!orbitLine) return;

  // Skip position-based lookup if no mesh provided (initial creation)
  if (!moonMesh) return;

  const period = moonData.period || 27.3;
  const periodMs = period * 24 * 60 * 60 * 1000;

  // Special handling for Hermite moons: use exact Hermite arc length
  const extendedMoonData = moonData as MoonData & {
    hermiteControlPoints?: HermiteControlPoint[];
    segmentArcLengths?: number[];
  };

  const useHermiteUpdate =
    ((moonData.type === 'jovian' && moonData.moonIndex !== undefined) ||
      (moonData.type === 'real' && moonData.body === 'Moon')) &&
    extendedMoonData.hermiteControlPoints &&
    extendedMoonData.segmentArcLengths;

  if (useHermiteUpdate) {
    const orbitStartMs = moonData.orbitStartMs ?? config.date.getTime();
    const timeSinceStart = config.date.getTime() - orbitStartMs;
    const tNorm = timeSinceStart / periodMs;

    // Check if we need to regenerate (orbit wrapped around)
    if (tNorm >= 1.0 || tNorm < 0) {
      generateMoonOrbitGeometry(moonData);
      return;
    }
  }

  // --- Unified Geometric Update (All Moons) ---
  const points = moonData.orbitPoints as number[] | undefined;
  if (!points || points.length === 0) return;

  // Get moon position in orbitLine's local space
  const worldPos = new THREE.Vector3();
  moonMesh.getWorldPosition(worldPos);
  const localPos = orbitLine.worldToLocal(worldPos.clone());

  // Find closest point using existing helper
  const numPoints = points.length / 3;
  const closestIndex = findClosestMoonPointIndex(points, localPos, numPoints);
  const i = closestIndex;

  // Get Neighbors for Tangent (handle closed loop wrap 0==End)
  let iPrev = i - 1;
  if (iPrev < 0) iPrev = numPoints - 2; // Wrap 0 -> N-2 (since N-1 is dup of 0)

  let iNext = i + 1;
  if (iNext >= numPoints) iNext = 1; // Wrap last -> 1 (since last is dup of 0)

  const idx3 = i * 3;
  const idxPrev = iPrev * 3;
  const idxNext = iNext * 3;

  const pCurrent = new THREE.Vector3(points[idx3], points[idx3 + 1], points[idx3 + 2]);
  const pPrev = new THREE.Vector3(points[idxPrev], points[idxPrev + 1], points[idxPrev + 2]);
  const pNext = new THREE.Vector3(points[idxNext], points[idxNext + 1], points[idxNext + 2]);

  // Tangent at P_current
  const tangent = new THREE.Vector3().subVectors(pNext, pPrev).normalize();

  // Project vector (Moon - P_current) onto Tangent
  const vecToMoon = new THREE.Vector3().subVectors(localPos, pCurrent);
  const projection = vecToMoon.dot(tangent);

  // Determine closest vertex "behind" moon
  let k = i;
  if (projection < 0) {
    k = k - 1;
    if (k < 0) k = numPoints - 2; // Wrap
  }

  // Snap main line to vertex k (hiding segment k -> k+1)
  const distances = moonData.cumulativeDistances;
  if (distances && k >= 0 && k < distances.length) {
    const currentDist = distances[k];
    if (orbitLine.material.uniforms.uCenterDistance) {
      orbitLine.material.uniforms.uCenterDistance.value = currentDist;
    }
  }

  // Update Connector (Moon -> Vertex[k])
  const connector = orbitLine.userData.connector as Line2 | undefined;
  if (connector) {
    connector.visible = true;

    // Vertex K position
    const pK = new THREE.Vector3(points[k * 3], points[k * 3 + 1], points[k * 3 + 2]);

    // Connector: Moon Local (localPos) -> Vertex K (pK)
    connector.geometry.setPositions([localPos.x, localPos.y, localPos.z, pK.x, pK.y, pK.z]);

    // Set White Color (matches glow)
    (connector.material as LineMaterial).color.setHex(0xffffff);
  }

  // Update Color
  const baseColor = moonData.color || 0x77aaee;
  const targetColor = config.showPlanetColors
    ? new THREE.Color(baseColor)
    : new THREE.Color(0x77aaee);

  if (!orbitLine.material.color.equals(targetColor)) {
    orbitLine.material.color.copy(targetColor);
  }

  moonData.lastOrbitUpdate = config.date.getTime();
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

  // Populate with initial points (static geometry only, no mesh available yet)
  updateOrbitGeometry(moonData);
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
  const steps = 120;

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

  // Populate with initial points (static geometry only, no mesh available yet)
  updateOrbitGeometry(moonData);
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
  orbitLinesGroup: THREE.Group,
  scene: THREE.Object3D,
  renderer?: THREE.WebGLRenderer
): MoonWrapper[] {
  const moons: MoonWrapper[] = [];
  if (!planetData.moons) return moons;

  planetData.moons.forEach((moonData: MoonData) => {
    // Create moon mesh (common for all types)
    const moonMesh = createMoonMesh(moonData, scene, renderer);
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
export function updateMoonPositions(
  planet: PlanetWrapper,
  allPlanets: PlanetWrapper[],
  camera: THREE.Camera | null = null
): void {
  // Update iTowns MoonGlobe LOD
  // Debug log every 1000 calls to avoid spam, or finding a specific condition
  if (planet.data.name === 'Earth' && Math.random() < 0.005) {
    console.log('🌑 [DEBUG] updateMoonPositions - Earth. Globe:', !!moonGlobe, 'Camera:', !!camera);
  }

  if (moonGlobe && camera) {
    moonGlobe.update(camera);
  } else if (planet.data.name === 'Earth' && (!moonGlobe || !camera)) {
    // Periodic warning if missing
    if (Math.random() < 0.01)
      console.warn('🌑 [DEBUG] MoonGlobe Update SKIPPED. Globe:', !!moonGlobe, 'Camera:', !!camera);
  }

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
      // Base rotation to face parent
      let rotation = Math.atan2(xOffset, zOffset) + Math.PI;

      // Add prime meridian offset if the texture's 0° longitude doesn't align with mesh -Z
      // For Moon: LROC texture has 0° at ~far side center, we need +π to show near side
      // Fine-tune this value if the Moon face is still rotated
      const primeMeridianOffset = -Math.PI / 2; // -90° offset for LROC texture alignment
      rotation += primeMeridianOffset;

      m.mesh.rotation.y = rotation;
    }

    // Update orbit geometry periodically to keep it aligned with the moon's position
    // Only for non-simple orbits (Jovian and Real)
    if (m.data.type !== 'simple' && m.data.orbitLine) {
      // Update frequently to ensure smooth orbit trails
      updateOrbitGeometry(m.data, m.mesh);
    }

    // Simple orbit rotation handling
    // Not strictly necessary if we don't care about the fade position on simple rings.
    // But if we do:
    // if (m.data.type === 'simple' && m.data.orbitLine) {
    // m.data.orbitLine.rotation.y = -currentAngle;
    // }

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
  // We don't manually update gradients anymore.
}

/**
 * Updates lighting uniforms for Moon LOD materials.
 * Must be called AFTER controls.update() so that universeGroup has been positioned.
 * @param {Array} planets - Array of planet wrappers
 * @param {THREE.Mesh} sun - The Sun mesh
 */
export function updateMoonLighting(planets: PlanetWrapper[], sun: THREE.Mesh): void {
  // Ensure the UniverseGroup (parent) has updated its MatrixWorld after controls.update()
  if (sun.parent) {
    sun.parent.updateMatrixWorld(true);
  }

  const sunWorldPos = new THREE.Vector3();
  sun.getWorldPosition(sunWorldPos);

  planets.forEach((p) => {
    if (p.moons) {
      p.moons.forEach((m) => {
        // Check if this is a Moon with our iTowns MoonGlobe
        const globe = m.mesh.userData.moonGlobe;
        if (globe) {
          const moonWorldPos = new THREE.Vector3();
          m.mesh.getWorldPosition(moonWorldPos);

          // Direction from Moon to Sun
          const direction = new THREE.Vector3().subVectors(sunWorldPos, moonWorldPos).normalize();
          globe.setSunDirection(direction);
        }
      });
    }
  });
}

/**
 * Updates the MoonGlobe LOD renderer steps (Tiles set processing).
 * Must be called every frame with the active camera.
 * @param camera - The active camera
 */
export function updateMoons(camera: THREE.Camera): void {
  // Update the single moonGlobe instance if it exists
  if (moonGlobe) {
    moonGlobe.update(camera);
  }
}
