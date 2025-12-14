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
import { getBodyPosition } from './missionTrajectory';

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
  let precisePos = TrajectoryLoader.getPositionAtTime(missionId, time);

  // If undefined/null, check if we are just slightly off the start/end bounds (e.g. rounding error or small mismatch)
  if (!precisePos) {
    const range = TrajectoryLoader.getDetailedRange(missionId);
    if (range) {
      if (time >= range.start - 86400000 && time <= range.start) {
        // Within 24 hours before start -> Clamp to start
        precisePos = TrajectoryLoader.getPositionAtTime(missionId, range.start);
      } else if (time >= range.end && time <= range.end + 86400000) {
        // Within 24 hours after end -> Clamp to end
        precisePos = TrajectoryLoader.getPositionAtTime(missionId, range.end);
      }
    }
  }

  if (precisePos) {
    // Convert AU to Scene Units
    const pos = precisePos.clone().multiplyScalar(AU_TO_SCENE);

    // Use a smaller delta (10s) for better tangent approximation at launch/flybys
    const delta = 10 * 1000;

    // Apply Coordinate System Correction
    const currentSystem = config.coordinateSystem;
    const correction = new THREE.Vector3(0, 0, 0);

    if (currentSystem === 'Geocentric' || currentSystem === 'Tychonic') {
      const earthPos = getBodyPosition('Earth', new Date(time));
      correction.copy(earthPos).multiplyScalar(AU_TO_SCENE);
    } else if (currentSystem === 'Barycentric') {
      const ssb = Astronomy.HelioVector(Astronomy.Body.SSB, new Date(time));
      // SSB is (x, y, z) in AU. Convert carefully if needed.
      // missionTrajectory.ts: getBodyPosition uses x=x, y=z, z=-y.
      // getMissionState currently uses: x=x, y=z, z=-y for Barycentric.
      correction.set(ssb.x, ssb.z, -ssb.y).multiplyScalar(AU_TO_SCENE);
    }

    // Calculate direction using corrected positions in the DISPLAY frame
    const nextTime = time + delta;
    const nextPos = TrajectoryLoader.getPositionAtTime(missionId, nextTime);
    const dir = new THREE.Vector3(0, 0, 1);

    if (nextPos) {
      const nextPosScene = nextPos.clone().multiplyScalar(AU_TO_SCENE);

      // Apply correction for NEXT position (frame moves!)
      const nextCorrection = new THREE.Vector3(0, 0, 0);
      if (currentSystem === 'Geocentric' || currentSystem === 'Tychonic') {
        const earthPosNext = getBodyPosition('Earth', new Date(nextTime));
        nextCorrection.copy(earthPosNext).multiplyScalar(AU_TO_SCENE);
      } else if (currentSystem === 'Barycentric') {
        const ssbNext = Astronomy.HelioVector(Astronomy.Body.SSB, new Date(nextTime));
        nextCorrection.set(ssbNext.x, ssbNext.z, -ssbNext.y).multiplyScalar(AU_TO_SCENE);
      }

      nextPosScene.sub(nextCorrection);

      // Diff of corrected positions
      const correctedPos = pos.clone().sub(correction);
      dir.subVectors(nextPosScene, correctedPos).normalize();
    } else {
      // Fallback for end of mission: backward diff
      const prevTime = time - delta;

      const prevPos = TrajectoryLoader.getPositionAtTime(missionId, prevTime);
      if (prevPos) {
        const prevPosScene = prevPos.clone().multiplyScalar(AU_TO_SCENE);

        // Apply correction for PREV position
        const prevCorrection = new THREE.Vector3(0, 0, 0);
        if (currentSystem === 'Geocentric' || currentSystem === 'Tychonic') {
          const earthPosPrev = getBodyPosition('Earth', new Date(prevTime));
          prevCorrection.copy(earthPosPrev).multiplyScalar(AU_TO_SCENE);
        } else if (currentSystem === 'Barycentric') {
          const ssbPrev = Astronomy.HelioVector(Astronomy.Body.SSB, new Date(prevTime));
          prevCorrection.set(ssbPrev.x, ssbPrev.z, -ssbPrev.y).multiplyScalar(AU_TO_SCENE);
        }

        prevPosScene.sub(prevCorrection);
        const correctedPos = pos.clone().sub(correction);

        dir.subVectors(correctedPos, prevPosScene).normalize();
      }
    }

    pos.sub(correction);

    return { position: pos, direction: dir };
  }

  // 3. Fallback to interpolated position from stored trajectory (uncorrected)
  const line = missionLines[missionId];
  if (!line || !line.userData.trajectoryData) return null;

  const trajData = line.userData.trajectoryData as { pos: THREE.Vector3; date: number }[];
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

  // Linear interpolation
  const alphaFallback = (time - wp1Fallback.date) / (wp2Fallback.date - wp1Fallback.date);
  const posFallback = new THREE.Vector3().lerpVectors(
    wp1Fallback.pos,
    wp2Fallback.pos,
    alphaFallback
  );

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

  // Calculate direction using CORRECTED positions (Frame-Aware)
  // We need to correct wp1 and wp2 positions for the CURRENT frame reference
  // Caution: Interpolated lines are static heliocentric. We need dynamic frame correction.

  // To get a proper direction vector in the display frame:
  // dir = (Pos(t+dt) - Frame(t+dt)) - (Pos(t) - Frame(t))

  // Here we have wp1 and wp2. WP2 is "future" relative to WP1.
  // We can approximate direction as (CorrectedWP2 - CorrectedWP1).

  // Already Scene Scaled? No, usually line data is scaled.
  // Wait, missionLines data is usually already scaled?
  // missionTrajectory.ts: points.push(pos.x * AU_TO_SCENE, ...)
  // Yes, they are Scaled Heliocentric.

  // So wp1Fallback.pos is Scene Units, Heliocentric.

  const correctionWP1 = new THREE.Vector3(0, 0, 0);
  const correctionWP2 = new THREE.Vector3(0, 0, 0);

  if (currentSystemFallback === 'Geocentric' || currentSystemFallback === 'Tychonic') {
    const t1 = new Date(wp1Fallback.date);
    const t2 = new Date(wp2Fallback.date);
    correctionWP1.copy(getBodyPosition('Earth', t1)).multiplyScalar(AU_TO_SCENE);
    correctionWP2.copy(getBodyPosition('Earth', t2)).multiplyScalar(AU_TO_SCENE);
  } else if (currentSystemFallback === 'Barycentric') {
    const t1 = new Date(wp1Fallback.date);
    const t2 = new Date(wp2Fallback.date);
    const ssb1 = Astronomy.HelioVector(Astronomy.Body.SSB, t1);
    const ssb2 = Astronomy.HelioVector(Astronomy.Body.SSB, t2);
    correctionWP1.set(ssb1.x, ssb1.z, -ssb1.y).multiplyScalar(AU_TO_SCENE);
    correctionWP2.set(ssb2.x, ssb2.z, -ssb2.y).multiplyScalar(AU_TO_SCENE);
  }

  const wp1Corrected = wp1Fallback.pos.clone().sub(correctionWP1);
  const wp2Corrected = wp2Fallback.pos.clone().sub(correctionWP2);

  const dirFallback = new THREE.Vector3().subVectors(wp2Corrected, wp1Corrected).normalize();

  return { position: posFallback, direction: dirFallback };
}
