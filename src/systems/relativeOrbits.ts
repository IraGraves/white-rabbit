/**
 * @file relativeOrbits.ts
 * @description Dynamic relative orbit trails for non-heliocentric coordinate systems.
 *
 * This file handles the visualization of orbital paths when viewing the solar system from
 * Earth-centered (Geocentric), Barycentric, or Tychonic perspectives. It creates epicycle
 * patterns for planets as seen from Earth.
 *
 * Performance optimization: "Incremental Update"
 * - Maintains a persistent deque of high-resolution points for each planet.
 * - Only calculates NEW points at the head (or tail) when time advances.
 * - Re-uploads the geometry buffer (fast) instead of re-calculating positions (slow).
 * - Ensures smooth epicycles by locking step size to Earth's movement.
 */
import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { AU_TO_SCENE, config } from '../config';
import { createOrbitLineMaterial } from '../materials/OrbitLineMaterial';
import { calculateKeplerianPosition } from '../physics/orbits';
import type { CelestialBodyData, PlanetWrapper } from '../types';

// Reusable vectors to avoid garbage collection
const _tempVec = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _centerPos = new THREE.Vector3();

// Global scratch buffer to reuse memory for geometry updates (avoids GC thrashing)
const MAX_POINTS_BUFFER = 50000;
const scratchPositions = new Float32Array(MAX_POINTS_BUFFER * 3);

interface CoarseSampler {
  t1: number;
  t2: number;
  p1: THREE.Vector3;
  p2: THREE.Vector3;
  coarseStep: number;
}

interface OrbitState {
  points: { x: number; y: number; z: number; t: number }[];
  lastUpdateTime: number; // Time of the last "Grid" point
  lastRenderTime?: number; // Time of the last visual frame update
  sampler?: CoarseSampler;
}

// Global state cache
const orbitStates = new Map<string, OrbitState>();
const lastSystemMode = { value: '' }; // Track system changes to reset cache

// Global resolution for Line2 materials
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

let globalFrameCount = 0;

/**
 * Updates the resolution for orbit line materials.
 * Should be called on window resize.
 * @param width - New window width
 * @param height - New window height
 */
export function resizeRelativeOrbits(width: number, height: number): void {
  resolution.set(width, height);
}

/**
 * Gets heliocentric position for a body at a given time
 */
function getHeliocentricPosition(data: CelestialBodyData, time: Date, target: THREE.Vector3) {
  if (data.body) {
    const vec = Astronomy.HelioVector(
      Astronomy.Body[data.body as keyof typeof Astronomy.Body],
      time
    );
    target.set(vec.x, vec.y, vec.z);
  } else if (data.elements) {
    const vec = calculateKeplerianPosition(data.elements, time);
    target.set(vec.x, vec.y, vec.z);
  } else {
    target.set(0, 0, 0);
  }
  return target;
}

/**
 * Calculates a single relative position at a specific time
 * Optimized with Coarse Sampler for target body
 */
function calculateRelativePosition(
  data: CelestialBodyData,
  tMs: number,
  system: string,
  allBodiesData: CelestialBodyData[],
  earthCache?: Map<number, THREE.Vector3>,
  sampler?: CoarseSampler
): { x: number; y: number; z: number; t: number } {
  const t = new Date(tMs);

  // 1. Calculate Target (Planet) Position
  if (data.name === 'Sun') {
    _targetPos.set(0, 0, 0);
  } else if (sampler) {
    // --- OPTIMIZED SAMPLER LOGIC ---
    // Advance sampler if needed
    // Assuming sequential access or close proximity

    // Jump forward (common case)
    while (tMs > sampler.t2) {
      sampler.t1 = sampler.t2;
      sampler.p1.copy(sampler.p2);
      sampler.t2 += sampler.coarseStep;
      getHeliocentricPosition(data, new Date(sampler.t2), sampler.p2);
    }

    // Jump backward (reverse scrubbing)
    while (tMs < sampler.t1) {
      sampler.t2 = sampler.t1;
      sampler.p2.copy(sampler.p1);
      sampler.t1 -= sampler.coarseStep;
      getHeliocentricPosition(data, new Date(sampler.t1), sampler.p1);
    }

    // Interpolate
    const alpha = (tMs - sampler.t1) / sampler.coarseStep;
    _targetPos.lerpVectors(sampler.p1, sampler.p2, alpha);
  } else {
    // Standard expensive call
    getHeliocentricPosition(data, t, _targetPos);
  }

  // 2. Calculate Center (Earth/Sun) Position
  // Earth needs high precision, so we use cache or direct calc (no coarse sampling)
  if (system === 'Geocentric' || system === 'Tychonic') {
    // Check Cache for Earth
    let found = false;
    if (earthCache && earthCache.has(tMs)) {
      _centerPos.copy(earthCache.get(tMs)!);
      found = true;
    }

    if (!found) {
      const earthData = allBodiesData.find((d: any) => d.name === 'Earth');
      if (earthData) {
        getHeliocentricPosition(earthData, t, _centerPos);
        if (earthCache) earthCache.set(tMs, _centerPos.clone());
      }
    }
  } else {
    const ssb = Astronomy.HelioVector(Astronomy.Body.SSB, t);
    _centerPos.set(ssb.x, ssb.y, ssb.z);
  }

  _tempVec.subVectors(_targetPos, _centerPos);

  return {
    x: _tempVec.x * AU_TO_SCENE,
    y: _tempVec.z * AU_TO_SCENE, // Y -> Z (Scene Up is Y, but orbit plane is XZ)
    z: -_tempVec.y * AU_TO_SCENE, // Z -> -Y
    t: tMs,
  };
}

/**
 * Initializes a new high-resolution orbit trail state
 */
function initializeOrbitState(
  data: CelestialBodyData,
  system: string,
  allBodiesData: CelestialBodyData[],
  endTimeMs: number,
  durationMs: number,
  stepMs: number,
  earthCache?: Map<number, THREE.Vector3>
): OrbitState {
  const points = [];

  // Align to grid
  const alignedEnd = Math.floor(endTimeMs / stepMs) * stepMs;
  const startTimeMs = alignedEnd - durationMs;

  // Initialize Sampler
  // 360 points per orbit -> smooth linear approximation
  const periodDays = data.period || 365.25;
  const coarseStepDays = Math.max(stepMs / (24 * 3600 * 1000), periodDays / 360); // At least 1 step size
  const coarseStepMs = coarseStepDays * 24 * 60 * 60 * 1000;

  let sampler: CoarseSampler | undefined;

  // Only use sampler if it actually saves calls (coarseStep > 1.5 * step)
  if (coarseStepMs > stepMs * 1.5 && data.name !== 'Sun') {
    const tStart = Math.floor(startTimeMs / coarseStepMs) * coarseStepMs;
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    getHeliocentricPosition(data, new Date(tStart), p1);
    getHeliocentricPosition(data, new Date(tStart + coarseStepMs), p2);

    sampler = {
      t1: tStart,
      t2: tStart + coarseStepMs,
      p1: p1,
      p2: p2,
      coarseStep: coarseStepMs,
    };
  }

  // Generate points
  for (let t = startTimeMs; t <= alignedEnd; t += stepMs) {
    points.push(calculateRelativePosition(data, t, system, allBodiesData, earthCache, sampler));
  }

  return { points, lastUpdateTime: alignedEnd, sampler };
}

/**
 * Incrementally updates the orbit state
 */
function updateOrbitState(
  state: OrbitState,
  data: CelestialBodyData,
  system: string,
  allBodiesData: CelestialBodyData[],
  targetTimeMs: number,
  durationMs: number,
  stepMs: number,
  earthCache?: Map<number, THREE.Vector3>
) {
  const lastTime = state.points[state.points.length - 1].t;
  const timeDiff = targetTimeMs - lastTime;

  // Detect Jumps
  if (Math.abs(timeDiff) > stepMs * 2000) {
    return initializeOrbitState(
      data,
      system,
      allBodiesData,
      targetTimeMs,
      durationMs,
      stepMs,
      earthCache
    );
  }

  const sampler = state.sampler;

  // Forward Time
  if (timeDiff > 0) {
    let nextTime = lastTime + stepMs;
    let added = 0;
    while (nextTime <= targetTimeMs) {
      state.points.push(
        calculateRelativePosition(data, nextTime, system, allBodiesData, earthCache, sampler)
      );
      nextTime += stepMs;
      added++;
      if (added > 2000) {
        break;
      }
    }
  }
  // Backward Time
  else if (timeDiff < -stepMs) {
    while (state.points.length > 0 && state.points[state.points.length - 1].t > targetTimeMs) {
      state.points.pop();
    }

    if (state.points.length > 0) {
      let firstTime = state.points[0].t;
      const targetStart = targetTimeMs - durationMs;

      // Reset sampler to start (if it exists) to ensure reverse iteration works effeciently or correct?
      // calculateRelativePosition handles reverse jumps automatically!

      let prevTime = firstTime - stepMs;
      let added = 0;
      while (prevTime >= targetStart) {
        state.points.unshift(
          calculateRelativePosition(data, prevTime, system, allBodiesData, earthCache, sampler)
        );
        prevTime -= stepMs;
        added++;
        if (added > 2000) break;
      }
    }
  }

  // Prune
  const cutoffTime = targetTimeMs - durationMs;
  let removeCount = 0;
  for (let i = 0; i < state.points.length; i++) {
    if (state.points[i].t < cutoffTime) removeCount++;
    else break;
  }
  if (removeCount > 0) {
    state.points.splice(0, removeCount);
  }

  state.lastUpdateTime = targetTimeMs;
  return state;
}

/**
 * Creates or updates the gradient material for a relative orbit line
 */
function getOrCreateMaterial(data: CelestialBodyData, line: Line2 | null) {
  const isSun = data.name === 'Sun';
  const showColors = config.showPlanetColors;
  const showDwarfColors = config.showDwarfPlanetColors;
  const isDwarf = data.type === 'dwarf';
  const isTesla = data.name === 'Tesla Roadster';
  const useColor = isTesla ? true : isDwarf ? showDwarfColors : showColors;

  const defaultColor = 0x4488ff;
  const colorVal = isSun
    ? data.color || 0xffff00
    : useColor
      ? data.color || defaultColor
      : 0x4488ff; // Default bluish

  const opacity = isSun ? 0.8 : useColor ? 0.9 : 0.9;

  // If line exists, update its material color and return it
  if (line) {
    const mat = line.material as any;
    const target = new THREE.Color(colorVal);
    if (!mat.color.equals(target)) {
      mat.color.copy(target);
    }
    // Ensure mode is set for existing lines
    if (mat.uniforms && mat.uniforms.uMode) mat.uniforms.uMode.value = 1.0;

    // Ensure shader uniforms are accessible via userData if compiled
    if (mat.userData && mat.userData.shader && mat.userData.shader.uniforms) {
      // Sync uniforms object reference if needed or just rely on userData.shader.uniforms being the source of truth
      // The Line2 renderer uses the material properties/uniforms?
      // LineMaterial DOES NOT expose custom uniforms on .uniforms property directly usually.
      // They are hidden in the shader.
      // We must update via mat.userData.shader.uniforms
    }

    return mat;
  }

  const mat = createOrbitLineMaterial({
    color: colorVal,
    opacity: opacity,
    linewidth: isSun ? 3.5 : 2.5,
    resolution: resolution,
  });

  // Set explicit mode for Sliding Window (Geocentric)
  // Note: These will only apply after compilation if we set them on the shader uniforms.
  // But createOrbitLineMaterial returns a LineMaterial which has its own uniforms?
  // No, we injected them in onBeforeCompile. Values set here might be lost if we don't store them.
  // Actually, standard practice is to wait for compile or shim the properties.
  // For now, we trust OrbitLineMaterial setup.

  return mat;
}

/**
 * Updates relative orbits dynamically using Line2
 */
export function updateRelativeOrbits(
  orbitGroup: THREE.Group,
  relativeOrbitGroup: THREE.Group,
  planets: PlanetWrapper[],
  _sun: THREE.Mesh
) {
  const system = config.coordinateSystem;

  if (orbitGroup.parent) {
    relativeOrbitGroup.rotation.copy(orbitGroup.parent.rotation);
  }

  // Reset cache if system changed
  if (system !== lastSystemMode.value) {
    orbitStates.clear();
    relativeOrbitGroup.clear(); // Clear old lines
    lastSystemMode.value = system;
  }

  // Handle Heliocentric Mode (Early Exit)
  if (system === 'Heliocentric') {
    orbitGroup.visible = true;
    relativeOrbitGroup.visible = false;

    orbitGroup.children.forEach((child: any) => {
      const isDwarf = planets.some(
        (p: any) => p.data.type === 'dwarf' && child.name === `${p.data.name}_Orbit`
      );
      const isPlanet = planets.some(
        (p: any) => p.data.type !== 'dwarf' && child.name === `${p.data.name}_Orbit`
      );
      const isTesla = child.name === 'Tesla Roadster_Orbit';

      if (isTesla) {
        child.visible = config.showMissions.teslaRoadster;
      } else if (isDwarf) {
        child.visible = config.showDwarfPlanetOrbits && config.showDwarfPlanets;
      } else if (isPlanet) {
        child.visible = config.showPlanetOrbits && config.showPlanets;
      } else {
        child.visible = true;
      }
    });
    return;
  }

  // Handle Non-Heliocentric Modes
  orbitGroup.visible = false;
  relativeOrbitGroup.visible = true;

  const allBodiesData = planets.map((p) => p.data);
  const bodiesToTrace: { data: CelestialBodyData }[] = [...planets];

  if (system === 'Geocentric' || system === 'Tychonic') {
    bodiesToTrace.push({
      data: { name: 'Sun', body: 'Sun', color: 0xffff00, period: 365.25 } as any,
    });
  } else if (system === 'Barycentric') {
    bodiesToTrace.push({
      data: { name: 'Sun', body: 'Sun', color: 0xffff00, period: 12 * 365.25 } as any,
    });
  }

  const currentSimTime = config.date.getTime();

  // Shared cache for Earth positions within this frame
  // Keys are absolute timestamps (step aligned).
  const earthCache = new Map<number, THREE.Vector3>();

  globalFrameCount++;

  bodiesToTrace.forEach((bodyObj: any, index: number) => {
    const data = bodyObj.data;

    // Check Visibility
    let isVisible = true;
    if (data.name === 'Tesla Roadster') {
      isVisible = config.showMissions.teslaRoadster;
    } else if (data.type === 'dwarf') {
      isVisible = config.showDwarfPlanetOrbits && config.showDwarfPlanets;
    } else if (data.name === 'Sun') {
      isVisible = config.showSunOrbits && config.showSun;
    } else {
      isVisible = config.showPlanetOrbits && config.showPlanets;
    }

    if ((system === 'Geocentric' || system === 'Tychonic') && data.name === 'Earth') {
      isVisible = false;
    }
    if (system === 'Tychonic' && data.name !== 'Sun') {
      isVisible = false;
    }

    let line = relativeOrbitGroup.getObjectByName(`${data.name}_Trail`) as Line2;

    if (!isVisible) {
      if (line) line.visible = false;
      return;
    }

    // --- INCREMENTAL UPDATE LOGIC ---

    const durationDays = data.period || 365.25;

    // Step Size Logic
    let baseStepDays = 2.0;

    if (durationDays > 50000) {
      // Neptune (60k) and beyond -> 6.0 days
      baseStepDays = 6.0;
    } else if (durationDays > 20000) {
      // Uranus (30k) -> 4.0 days (User requested multiple of 2)
      baseStepDays = 4.0;
    }

    const targetMaxPoints = 10000;
    const minStepForLimit = durationDays / targetMaxPoints;

    const stepDays = Math.max(baseStepDays, minStepForLimit);
    const stepMs = stepDays * 24 * 60 * 60 * 1000;

    const trailDurationMs = durationDays * 24 * 60 * 60 * 1000;

    const cacheKey = `${data.name}_${system}`;
    let state = orbitStates.get(cacheKey);
    let isNew = false;

    if (!state) {
      state = initializeOrbitState(
        data,
        system,
        allBodiesData,
        currentSimTime,
        trailDurationMs,
        stepMs,
        earthCache
      );
      orbitStates.set(cacheKey, state);
      isNew = true;
    } else {
      // Update State (Staggered)
      const timeSinceLast = Math.abs(currentSimTime - state.lastUpdateTime);
      const staggerInterval = 2; // Spread updates over 2 frames to balance load
      const isStaggerFrame = (globalFrameCount + index) % staggerInterval === 0;

      // Force update if lagging too much (High Speed Safety) to prevent visual artifacts
      const isLagging = timeSinceLast > stepMs * 4;

      if (timeSinceLast > stepMs && (isStaggerFrame || isLagging)) {
        state = updateOrbitState(
          state,
          data,
          system,
          allBodiesData,
          currentSimTime,
          trailDurationMs,
          stepMs,
          earthCache
        );
        orbitStates.set(cacheKey, state);
        isNew = true;
      }
    }

    // --- DUAL LINE RENDERING ---
    // 1. Main Static Trail (Cached points, updated on Grid Step)
    // 2. Head Dynamic Segment (Bridge to current time, updated every frame)

    let lineMain = relativeOrbitGroup.getObjectByName(`${data.name}_Trail`) as Line2;
    let lineHead = relativeOrbitGroup.getObjectByName(`${data.name}_Head`) as Line2;

    if (!lineMain) {
      const mat = getOrCreateMaterial(data, null);
      lineMain = new Line2(new LineGeometry(), mat);
      lineMain.name = `${data.name}_Trail`;
      relativeOrbitGroup.add(lineMain);
      isNew = true;
    } else {
      getOrCreateMaterial(data, lineMain);
    }

    if (!lineHead) {
      const mat = lineMain.material.clone(); // Clone to allow different uniforms/offsets if needed
      // But we need to link the shader userData!
      (mat as any).userData = { ...(lineMain.material as any).userData };

      lineHead = new Line2(new LineGeometry(), mat);
      lineHead.name = `${data.name}_Head`;
      relativeOrbitGroup.add(lineHead);
    } else {
      // Sync color etc
      getOrCreateMaterial(data, lineHead);
    }

    lineMain.visible = true;
    lineHead.visible = true;

    // --- Update Static Trail (Only if Grid Changed or New) ---
    // We assume state.points has been updated by logic above if needed.
    // Check if we need to re-upload cached geometry.
    // We can track a 'geometryVersion' in OrbitState? Or just use isNew/time check?
    // state.points only changes when updateOrbitState returns.

    // Let's assume we recalculate Main ONLY if 'isNew' was true (OrbitState updated/created this frame).
    // Note: updateOrbitState is called above if time > step.

    // We need to store the computed length of the main trail to offset the head.
    // Let's store it on the line userData to avoid modifying OrbitState interface right now.
    if (lineMain.userData.worldLen === undefined) lineMain.userData.worldLen = 0;

    if (isNew) {
      let vCount = 0;
      // Copy state.points to scratch
      for (let i = 0; i < state.points.length; i++) {
        const p = state.points[i];
        const idx = vCount * 3;
        scratchPositions[idx] = p.x;
        scratchPositions[idx + 1] = p.y;
        scratchPositions[idx + 2] = p.z;
        vCount++;
        if (vCount >= MAX_POINTS_BUFFER) break;
      }

      if (vCount >= 2) {
        lineMain.geometry.setPositions(scratchPositions.subarray(0, vCount * 3));
        lineMain.computeLineDistances();

        // Calculate Length
        let dist = 0;
        for (let i = 1; i < vCount; i++) {
          const idx = i * 3;
          const idxP = (i - 1) * 3;
          const dx = scratchPositions[idx] - scratchPositions[idxP];
          const dy = scratchPositions[idx + 1] - scratchPositions[idxP + 1];
          const dz = scratchPositions[idx + 2] - scratchPositions[idxP + 2];
          dist += Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        lineMain.userData.worldLen = dist;
      } else {
        lineMain.visible = false;
      }
    }

    // --- Update Dynamic Head (Every Frame) ---
    // From last cached point -> currentHead
    const currentHead = calculateRelativePosition(
      data,
      currentSimTime,
      system,
      allBodiesData,
      earthCache,
      state.sampler
    );

    if (state.points.length > 0) {
      const lastP = state.points[state.points.length - 1];

      // Head Segment Geometry
      // 0: Last Cached
      // 1: Current Realtime
      const headPos = [lastP.x, lastP.y, lastP.z, currentHead.x, currentHead.y, currentHead.z];
      lineHead.geometry.setPositions(headPos);
      lineHead.computeLineDistances();

      const dx = currentHead.x - lastP.x;
      const dy = currentHead.y - lastP.y;
      const dz = currentHead.z - lastP.z;
      const headLen = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const totalLen = lineMain.userData.worldLen + headLen;

      // Update Uniforms
      const updateUniforms = (line: Line2, offset: number, total: number) => {
        const mat = line.material as any;
        // Update material uniforms directly (linked to shader in onBeforeCompile)
        // This ensures updates work even before the shader is compiled/cached on userData
        if (mat.uniforms) {
          if (mat.uniforms.uTotalLength) mat.uniforms.uTotalLength.value = total;
          if (mat.uniforms.uCenterDistance) mat.uniforms.uCenterDistance.value = total;
          if (mat.uniforms.uTrailLength) mat.uniforms.uTrailLength.value = total;
          if (mat.uniforms.uDistanceOffset) mat.uniforms.uDistanceOffset.value = offset;
        }
      };

      updateUniforms(lineMain, 0, totalLen);
      updateUniforms(lineHead, lineMain.userData.worldLen, totalLen);
    } else {
      lineHead.visible = false;
    }
  });

  if (system === 'Tychonic') {
    orbitGroup.visible = true;
    relativeOrbitGroup.visible = true;
  }
} // End updateRelativeOrbits
