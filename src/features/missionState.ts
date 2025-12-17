/**
 * @file missionState.ts
 * @description Shared state and mission position interpolation for space missions.
 *
 * This module handles:
 * - Shared mission lines storage
 * - Mission state interpolation (position and direction at any time)
 * - Coordinate system corrections
 */
import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';
import type { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { AU_TO_SCENE, config } from '../config';
import { customBodies } from '../data/missions';
import { calculateKeplerianPosition } from '../physics/orbits';
import { TrajectoryLoader } from '../services/TrajectoryLoader';
import { getBodyPosition, hermiteInterpolateState } from './missionTrajectory';

// Missions that use Keplerian orbit instead of trajectory data
const ORBIT_ONLY_MISSIONS: Record<string, string> = {
  teslaRoadster: 'Tesla Roadster', // Maps mission ID to customBodies key
};

// Shared storage for mission lines (accessible by other modules)
export const missionLines: Record<string, Line2> = {};

/**
 * Gets the interpolated position and flight direction of a mission at a specific date.
 * Uses piecewise linear interpolation between waypoints to ensure temporal accuracy,
 * especially at flyby dates.
 * @param missionId - The mission identifier
 * @param date - Target date as Date, number (timestamp), or string
 * @returns Object with position and direction vectors, or null if not available
 */
export function getMissionState(
  missionId: string,
  date: Date | number | string
): { position: THREE.Vector3; direction: THREE.Vector3 } | null {
  const time = typeof date === 'string' || date instanceof Date ? new Date(date).getTime() : date;

  // 0. Handle orbit-only missions (use Keplerian elements instead of trajectory)
  const orbitBodyName = ORBIT_ONLY_MISSIONS[missionId];
  if (orbitBodyName) {
    const elements = customBodies[orbitBodyName];
    if (elements) {
      const currentDate = new Date(time);
      const pos = calculateKeplerianPosition(elements, currentDate);

      // Convert to scene coordinates - MUST match planets.ts updatePlanets()
      // planets.ts uses: mesh.x = pos.x, mesh.z = -pos.y, mesh.y = pos.z
      const scenePos = new THREE.Vector3(
        pos.x * AU_TO_SCENE,
        pos.z * AU_TO_SCENE,
        -pos.y * AU_TO_SCENE
      );

      // Calculate direction via finite difference
      const delta = 3600 * 1000; // 1 hour
      const nextPos = calculateKeplerianPosition(elements, new Date(time + delta));
      const nextScenePos = new THREE.Vector3(
        nextPos.x * AU_TO_SCENE,
        nextPos.z * AU_TO_SCENE,
        -nextPos.y * AU_TO_SCENE
      );
      const dir = new THREE.Vector3().subVectors(nextScenePos, scenePos).normalize();

      // Note: NO coordinate system correction needed here!
      // The orbit line is in heliocentric coordinates and moves with universeGroup.
      // The probe (added to missionGroup inside universeGroup) should also be heliocentric.
      // The coordinate system transformation is handled by moving the entire universeGroup.

      return { position: scenePos, direction: dir };
    }
  }

  // 1. Fallback: Try to use High-Precision Trajectory Data (Binary) - uncorrected
  // Now returns { pos, v }
  let preciseState = TrajectoryLoader.getStateAtTime(missionId, time);

  // If undefined/null, check if we are just slightly off the start/end bounds (e.g. rounding error or small mismatch)
  if (!preciseState) {
    const range = TrajectoryLoader.getDetailedRange(missionId);
    if (range) {
      if (time >= range.start - 86400000 && time <= range.start) {
        // Within 24 hours before start -> Clamp to start
        preciseState = TrajectoryLoader.getStateAtTime(missionId, range.start);
      } else if (time >= range.end && time <= range.end + 86400000) {
        // Within 24 hours after end -> Clamp to end
        preciseState = TrajectoryLoader.getStateAtTime(missionId, range.end);
      }
    }
  }

  if (preciseState) {
    // Convert AU to Scene Units
    const pos = preciseState.pos.clone().multiplyScalar(AU_TO_SCENE);

    // Velocity is in AU/Day.
    // Direction is just normalized velocity.
    // Note: If coordinate system is NOT Ecliptic, we need to rotate velocity too.

    // Original velocity in Heliocentric Ecliptic (AU/Day)
    const vel = preciseState.v.clone();

    // Apply Coordinate System Correction to Position
    const currentSystem = config.coordinateSystem;
    const correction = new THREE.Vector3(0, 0, 0);

    if (currentSystem === 'Geocentric' || currentSystem === 'Tychonic') {
      const earthPos = getBodyPosition('Earth', new Date(time));
      correction.copy(earthPos).multiplyScalar(AU_TO_SCENE);

      // Velocity Correction:
      // V_display = V_probe - V_center
      // Calculate Earth velocity via finite difference (AU/Day)
      // delta = 1 minute = 1/(24*60) days
      const dtDays = 1.0 / 1440.0;
      const tNext = time + dtDays * 86400000.0;

      const p1 = Astronomy.HelioVector(Astronomy.Body.Earth, new Date(time));
      const p2 = Astronomy.HelioVector(Astronomy.Body.Earth, new Date(tNext));

      // Velocity in AU/Day
      // coordinate flip: x -> x, y -> z, z -> -y
      const vx = (p2.x - p1.x) / dtDays;
      const vy = (p2.z - p1.z) / dtDays; // z comes from y
      const vz = (-p2.y - -p1.y) / dtDays; // y comes from -z

      const earthVel = new THREE.Vector3(vx, vy, vz);

      // Subtract Earth velocity from Probe velocity to get Geocentric Velocity
      vel.sub(earthVel);
    } else if (currentSystem === 'Barycentric') {
      const ssb = Astronomy.HelioVector(Astronomy.Body.SSB, new Date(time));
      correction.set(ssb.x, ssb.z, -ssb.y).multiplyScalar(AU_TO_SCENE);

      // Velocity Correction for Barycentric
      // V_display = V_probe - V_SSB
      const dtDays = 1.0 / 1440.0;
      const tNext = time + dtDays * 86400000.0;

      const p1 = Astronomy.HelioVector(Astronomy.Body.SSB, new Date(time));
      const p2 = Astronomy.HelioVector(Astronomy.Body.SSB, new Date(tNext));

      const vx = (p2.x - p1.x) / dtDays;
      const vy = (p2.z - p1.z) / dtDays;
      const vz = (-p2.y - -p1.y) / dtDays;

      const ssbVel = new THREE.Vector3(vx, vy, vz);

      vel.sub(ssbVel);
    }

    pos.sub(correction);

    // Normalize velocity to get direction
    const dir = vel.normalize();

    // If velocity is zero (unlikely in orbit), fallback to (0,0,1) or strict check?
    if (dir.lengthSq() < 0.0001) {
      dir.set(0, 0, 1);
    }

    return { position: pos, direction: dir };
  }

  // 3. Fallback: Interpolate from runtime waypoints (or trajectory data)
  const line = missionLines[missionId];
  if (!line || (!line.userData.runtimeWaypoints && !line.userData.trajectoryData)) return null;

  // Try precise runtime waypoints first (for Hermite)
  let interpolatedState = line.userData.runtimeWaypoints
    ? interpolateFromWaypoints(line, time)
    : null;

  // If no state (e.g. no velocities for loose waypoints), fallback to Dense `trajectoryData`
  if (!interpolatedState) {
    const trajData = line.userData.trajectoryData as {
      pos: THREE.Vector3;
      date: number;
      v?: THREE.Vector3;
    }[];
    if (!trajData || trajData.length < 2) return null;

    // Find bracketing waypoints
    let lowerIdx2 = -1;
    for (let i = 0; i < trajData.length - 1; i++) {
      if (trajData[i].date <= time && trajData[i + 1].date >= time) {
        lowerIdx2 = i;
        break;
      }
    }

    // If before start or after end
    if (lowerIdx2 === -1) {
      if (time < trajData[0].date) return null;
      if (time > trajData[trajData.length - 1].date) return null;
      return null;
    }

    const wp1Fallback = trajData[lowerIdx2];
    const wp2Fallback = trajData[lowerIdx2 + 1];

    const totalTimeFallback = wp2Fallback.date - wp1Fallback.date;
    const alphaFallback = (time - wp1Fallback.date) / totalTimeFallback;
    const dtDaysFallback = totalTimeFallback / 86400000.0;

    let posFallback: THREE.Vector3;
    let dirFallback: THREE.Vector3;

    // Use Hermite Interpolation on dense data if available (Strict requirement)
    // We expect 'v' to be present now as baked data includes it.
    if (wp1Fallback.v && wp2Fallback.v) {
      const state = hermiteInterpolateState(
        wp1Fallback.pos,
        wp1Fallback.v,
        wp2Fallback.pos,
        wp2Fallback.v,
        alphaFallback,
        dtDaysFallback
      );
      posFallback = state.pos;
      dirFallback = state.v.normalize();
    } else {
      // Fallback for missing V (Strict: NO Linear Interpolation)
      return null;
    }

    interpolatedState = { position: posFallback, direction: dirFallback };
  }

  if (!interpolatedState) {
    return null;
  }

  const { position: posFallback, direction: dirFallback } = interpolatedState;

  // Apply Coordinate System Correction
  const currentSystemFallback = config.coordinateSystem;
  const correctionFallback = new THREE.Vector3(0, 0, 0);

  if (currentSystemFallback === 'Geocentric' || currentSystemFallback === 'Tychonic') {
    const earthPos = getBodyPosition('Earth', new Date(time));
    correctionFallback.copy(earthPos).multiplyScalar(AU_TO_SCENE);
  } else if (currentSystemFallback === 'Barycentric') {
    const ssb = Astronomy.HelioVector(Astronomy.Body.SSB, new Date(time));
    correctionFallback.set(ssb.x, ssb.z, -ssb.y).multiplyScalar(AU_TO_SCENE);
  }

  posFallback.sub(correctionFallback);

  return { position: posFallback, direction: dirFallback };
}

/**
 * Helper to interpolate position using runtime waypoints
 */
function interpolateFromWaypoints(
  line: Line2,
  time: number
): { position: THREE.Vector3; direction: THREE.Vector3 } | null {
  const waypoints = line.userData.runtimeWaypoints as Array<{
    pos: THREE.Vector3;
    date: number;
    v?: THREE.Vector3;
  }>;

  if (!waypoints || waypoints.length < 2) return null;

  // Find segment
  let idx = -1;
  for (let i = 0; i < waypoints.length - 1; i++) {
    if (time >= waypoints[i].date && time <= waypoints[i + 1].date) {
      idx = i;
      break;
    }
  }

  if (idx === -1) {
    return null;
  }

  const p1 = waypoints[idx];
  const p2 = waypoints[idx + 1];

  const totalTime = p2.date - p1.date;
  if (totalTime <= 0) return { position: p1.pos.clone(), direction: new THREE.Vector3(0, 0, 1) };

  const alpha = (time - p1.date) / totalTime;
  const dtDays = totalTime / 86400000.0;

  // Hermite Interpolation if velocities exist
  if (p1.v && p2.v) {
    const state = hermiteInterpolateState(p1.pos, p1.v, p2.pos, p2.v, alpha, dtDays);
    return { position: state.pos, direction: state.v.normalize() };
  }

  // Strict: No Linear Fallback for sparse waypoints
  return null;
}
