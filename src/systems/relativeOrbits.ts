/**
 * @file relativeOrbits.ts
 * @description Dynamic relative orbit trails for non-heliocentric coordinate systems.
 *
 * This file handles the visualization of orbital paths when viewing the solar system from
 * Earth-centered (Geocentric), Barycentric, or Tychonic perspectives. It creates epicycle
 * patterns for planets as seen from Earth.
 *
 * Performance optimization: Uses CatmullRomCurve3 spline interpolation
 * - Only samples 20-40 key points per epicycle loop using Astronomy Engine
 * - Interpolates smooth curves between key points (fast!)
 * - Results in 10-50x fewer astronomical calculations vs brute-force sampling
 *
 * Key features:
 * - Spline-based smooth curves from minimal astronomical samples
 * - Gradient shader support: Uses custom Line2 shader
 * - Memory efficient: Reuses geometry buffers where possible
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

// Cache for tracking last update times to avoid redundant calculations
const lastUpdateTimes = new Map<string, number>();
const UPDATE_THRESHOLD_MS = 1000 * 60 * 60; // Only recalculate if time moved by 1+ hour

// Global resolution for Line2 materials
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

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
 * Calculates the number of epicycle loops for a planet in one orbital period
 */
function calculateEpicycleLoops(periodDays: number) {
  const earthPeriod = 365.25;
  const planetPeriod = periodDays;
  const synodicPeriod = Math.abs(1 / (1 / earthPeriod - 1 / planetPeriod));
  const loopsPerPeriod = planetPeriod / synodicPeriod;
  return Math.max(1, loopsPerPeriod);
}

/**
 * Samples key points along the geocentric path using Astronomy Engine
 */
function sampleKeyPoints(
  data: CelestialBodyData,
  system: string,
  allBodiesData: CelestialBodyData[],
  startTimeMs: number,
  durationDays: number,
  numKeyPoints: number
) {
  const keyPoints: THREE.Vector3[] = [];

  for (let i = 0; i < numKeyPoints; i++) {
    const t = new Date(startTimeMs + (i / (numKeyPoints - 1)) * durationDays * 24 * 60 * 60 * 1000);

    if (data.name === 'Sun') {
      _targetPos.set(0, 0, 0);
    } else {
      getHeliocentricPosition(data, t, _targetPos);
    }

    if (system === 'Geocentric' || system === 'Tychonic') {
      const earthData = allBodiesData.find((d: any) => d.name === 'Earth');
      if (earthData) {
        getHeliocentricPosition(earthData, t, _centerPos);
      }
    } else {
      const ssb = Astronomy.HelioVector(Astronomy.Body.SSB, t);
      _centerPos.set(ssb.x, ssb.y, ssb.z);
    }

    _tempVec.subVectors(_targetPos, _centerPos);

    // Convert to Scene Coords (X, Z, -Y)
    keyPoints.push(
      new THREE.Vector3(
        _tempVec.x * AU_TO_SCENE,
        _tempVec.z * AU_TO_SCENE,
        -_tempVec.y * AU_TO_SCENE
      )
    );
  }

  return keyPoints;
}

/**
 * Creates a smooth spline curve from key points and samples render points
 */
function createSplineCurve(keyPoints: THREE.Vector3[], renderPointCount: number) {
  const curve = new THREE.CatmullRomCurve3(keyPoints, false, 'centripetal', 0.5);
  return curve.getPoints(renderPointCount - 1);
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
    return mat;
  }

  return createOrbitLineMaterial({
    color: colorVal,
    opacity: opacity,
    linewidth: isSun ? 3.5 : 2.5,
    resolution: resolution,
  });
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

  // Handle Heliocentric Mode
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

  bodiesToTrace.forEach((bodyObj: any) => {
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

    const durationDays = data.period || 730;
    const epicycleLoops = calculateEpicycleLoops(durationDays);
    const pointsPerLoop = system === 'Geocentric' ? 25 : 15;
    const keyPointCount = Math.max(50, Math.min(Math.ceil(epicycleLoops * pointsPerLoop), 3000));
    const renderPointCount = Math.max(300, Math.min(Math.ceil(epicycleLoops * 50), 6000));

    const cacheKey = `${data.name}_${system}`;
    const lastUpdate = lastUpdateTimes.get(cacheKey) || 0;
    const timeDelta = Math.abs(currentSimTime - lastUpdate);
    const needsRecalc = timeDelta > UPDATE_THRESHOLD_MS;

    const needsNewLine = !line;

    const currentCount = line ? (line.geometry as LineGeometry).attributes.instanceStart?.count : 0;
    const countChanged = line && currentCount !== renderPointCount - 1;

    if (needsNewLine || countChanged) {
      if (line) {
        line.geometry.dispose();
        (line.material as any).dispose();
        relativeOrbitGroup.remove(line);
      }

      const geometry = new LineGeometry();

      const material = getOrCreateMaterial(data, null);
      line = new Line2(geometry, material);
      line.name = `${data.name}_Trail`;
      line.frustumCulled = false;
      relativeOrbitGroup.add(line);

      // Force update since it's new
      lastUpdateTimes.set(cacheKey, 0);
    } else {
      getOrCreateMaterial(data, line);
    }

    line.visible = true;

    if (needsRecalc || needsNewLine || countChanged) {
      const MAX_PAST_RATIO = 0.9;
      const pastDuration = durationDays * MAX_PAST_RATIO;
      const startTimeMs = currentSimTime - pastDuration * 24 * 60 * 60 * 1000;

      // STEP 1: Sample key points
      const keyPoints = sampleKeyPoints(
        data,
        system,
        allBodiesData,
        startTimeMs,
        durationDays,
        keyPointCount
      );

      // STEP 2: Smooth spline
      const renderPoints = createSplineCurve(keyPoints, renderPointCount);

      // STEP 3: Update geometry
      const positions: number[] = [];
      for (let i = 0; i < renderPoints.length; i++) {
        positions.push(renderPoints[i].x, renderPoints[i].y, renderPoints[i].z);
      }

      const geo = line.geometry as LineGeometry;
      geo.setPositions(positions);

      // Compute distances for shader gradients
      line.computeLineDistances();

      // Rough approximation of total length:
      let len = 0;
      for (let i = 1; i < renderPoints.length; i++) {
        len += renderPoints[i].distanceTo(renderPoints[i - 1]);
      }

      const mat = line.material as any;
      if (mat.uniforms) {
        if (mat.uniforms.uTotalLength) mat.uniforms.uTotalLength.value = len || 1.0;

        let centerLen = 0;
        const centerIndex = Math.floor(renderPoints.length * MAX_PAST_RATIO);
        for (let i = 1; i <= centerIndex && i < renderPoints.length; i++) {
          centerLen += renderPoints[i].distanceTo(renderPoints[i - 1]);
        }

        if (mat.uniforms.uCenterDistance) {
          mat.uniforms.uCenterDistance.value = centerLen;
        }
      }

      lastUpdateTimes.set(cacheKey, currentSimTime);
    }
  });

  if (system === 'Tychonic') {
    orbitGroup.visible = true;
    relativeOrbitGroup.visible = true;
  }
}
