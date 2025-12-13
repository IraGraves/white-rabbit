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
import { TrajectoryLoader } from '../services/TrajectoryLoader';
import { getBodyPosition } from './missionTrajectory';
import { applyDynamicCorrection } from './missionScaling';

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

  // 1. Try to use Corrected Trajectory Data (from missionUpdates)
  const line = missionLines[missionId];
  if (line?.userData?.correctedTrajectory) {
    const correctedData = line.userData.correctedTrajectory as {
      pos: THREE.Vector3;
      date: number;
    }[];
    if (correctedData && correctedData.length >= 2) {
      // Find bracketing points
      let lowerIdx = -1;
      for (let i = 0; i < correctedData.length - 1; i++) {
        if (correctedData[i].date <= time && correctedData[i + 1].date >= time) {
          lowerIdx = i;
          break;
        }
      }

      if (lowerIdx === -1) {
        // Before start or after end
        if (time < correctedData[0].date) return null;
        if (time > correctedData[correctedData.length - 1].date) return null;
        return null;
      }

      const wp1 = correctedData[lowerIdx];
      const wp2 = correctedData[lowerIdx + 1];

      // Linear interpolation
      const alpha = (time - wp1.date) / (wp2.date - wp1.date);
      const pos = new THREE.Vector3().lerpVectors(wp1.pos, wp2.pos, alpha);

      // Direction from interpolated segment
      const dir = new THREE.Vector3().subVectors(wp2.pos, wp1.pos).normalize();

      // Apply Local Origin Offset (for floating-point precision)
      if (line.userData?.localOrigin) {
        pos.sub(line.userData.localOrigin);
      }

      return { position: pos, direction: dir };
    }
  }

  // 2. Fallback: Try to use High-Precision Trajectory Data (Binary) - uncorrected
  const precisePos = TrajectoryLoader.getPositionAtTime(missionId, time);

  if (precisePos) {
    // Convert AU to Scene Units
    let pos = precisePos.clone().multiplyScalar(AU_TO_SCENE);

    // Calculate direction using a small delta (e.g. 1 hour)
    const delta = 3600 * 1000;
    const nextPos = TrajectoryLoader.getPositionAtTime(missionId, time + delta);
    const dir = new THREE.Vector3(0, 0, 1);

    if (nextPos) {
      const nextPosScene = nextPos.clone().multiplyScalar(AU_TO_SCENE);
      dir.subVectors(nextPosScene, pos).normalize();
    } else {
      // Try backward delta if at end
      const prevPos = TrajectoryLoader.getPositionAtTime(missionId, time - delta);
      if (prevPos) {
        const prevPosScene = prevPos.clone().multiplyScalar(AU_TO_SCENE);
        dir.subVectors(pos, prevPosScene).normalize();
      }
    }

    // Apply Dynamic Scale Correction (Push out if inside 1.05x radius)
    // 'pos' here is Heliocentric Scene Units
    const correctedPosHelper = applyDynamicCorrection(
      missionId,
      pos,
      time,
      config.sunScale,
      config.planetScale
    );
    pos.copy(correctedPosHelper);

    // Apply Coordinate System Correction
    const currentSystem = config.coordinateSystem;
    const correction = new THREE.Vector3(0, 0, 0);

    if (currentSystem === 'Geocentric' || currentSystem === 'Tychonic') {
      const earthPos = getBodyPosition('Earth', new Date(time));
      correction.copy(earthPos).multiplyScalar(AU_TO_SCENE);
    } else if (currentSystem === 'Barycentric') {
      const ssb = Astronomy.HelioVector(Astronomy.Body.SSB, new Date(time));
      correction.set(ssb.x, ssb.z, -ssb.y).multiplyScalar(AU_TO_SCENE);
    }

    pos.sub(correction);

    return { position: pos, direction: dir };
  }

  // 3. Fallback to interpolated position from stored trajectory (uncorrected)
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

  // Direction from interpolated segment
  const dirFallback = new THREE.Vector3().subVectors(wp2Fallback.pos, wp1Fallback.pos).normalize();

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
