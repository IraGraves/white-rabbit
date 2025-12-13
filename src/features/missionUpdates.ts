/**
 * @file missionUpdates.ts
 * @description Runtime updates and coordinate system handling for mission trajectories.
 *
 * This module handles:
 * - Mission visibility toggle based on config
 * - Coordinate system recalculation (Heliocentric, Geocentric, etc.)
 * - Per-frame visual uniform updates
 * - Local rebasing for floating-point precision
 */

import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';
import type { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import type { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { AU_TO_SCENE, config } from '../config';
import { missionData } from '../data/missions';
import { applyCorrection, getScaledPoint } from './missionScaling';
import { missionLines } from './missionState';
import {
  createSmoothPath,
  densifyMissionPoints,
  getAbsoluteMissionWaypointPosition,
  getBodyPosition,
  getExitVector,
  getMissionPointType,
} from './missionTrajectory';

let lastCoordinateSystem: string | null = null;

/**
 * Update mission visibility based on config.
 * Called when showMissions config values change.
 */
export function updateMissions(): void {
  Object.keys(missionLines).forEach((id) => {
    const key = id as keyof typeof config.showMissions;
    if (missionLines[id]) {
      missionLines[id].visible = config.showMissions[key];
    }
  });
}

// Extend window interface for global functions
declare global {
  interface Window {
    updateMissions?: () => void;
    _suppressMissionErrors?: boolean;
  }
}

// Register global update function
window.updateMissions = updateMissions;

/**
 * Updates mission trajectories when the coordinate system changes.
 * Recalculates all waypoints relative to the new center (e.g., Earth for Geocentric).
 * @param _scene - The scene (unused, but kept for consistency)
 * @param forceUpdate - If true, recalculate even if system hasn't changed
 */
export function updateMissionTrajectories(_scene: THREE.Scene, forceUpdate: boolean = false): void {
  const currentSystem = config.coordinateSystem;

  // Only update if the coordinate system has changed OR forced
  if (lastCoordinateSystem === currentSystem && !forceUpdate) {
    return;
  }

  lastCoordinateSystem = currentSystem;

  missionData.forEach((mission) => {
    const line = missionLines[mission.id];
    if (!line) return;

    // --- CHECK FOR BINARY DATA ---
    if (line.userData.hasBinaryData && line.userData.originalPoints) {
      // If forced update (e.g. Scale Change), re-analyze influence windows - DEPRECATED
      // if (forceUpdate) {
      //   line.userData.influenceWindows = getInfluenceWindows(mission.id, config.planetScale);
      // }

      const smoothPoints: { pos: THREE.Vector3; date: number }[] = [];

      // Helper to get correction vector in SCENE units
      const getCorrection = (time: number) => {
        const correction = new THREE.Vector3(0, 0, 0);
        if (currentSystem === 'Geocentric' || currentSystem === 'Tychonic') {
          const earthPos = getBodyPosition('Earth', new Date(time));
          correction.copy(earthPos).multiplyScalar(AU_TO_SCENE);
        } else if (currentSystem === 'Barycentric') {
          const ssb = Astronomy.HelioVector(Astronomy.Body.SSB, new Date(time));
          correction.set(ssb.x, ssb.z, -ssb.y).multiplyScalar(AU_TO_SCENE);
        }
        return correction;
      };

      const trajData = line.userData.trajectoryData as { pos: THREE.Vector3; date: number }[];

      if (trajData) {
        // Rebase all points with Point-Based Correction
        // Simple logic: Iterating 1:1 with loaded trajectory
        for (let i = 0; i < trajData.length; i++) {
          const p = trajData[i];
          const correction = getCorrection(p.date);

          // Use raw Heliocentric position for scaling check (matches JSON data)
          const helioPos = p.pos;

          // Apply Planet Scale Correction (Push out if inside 1.05x radius)
          // Result is still Heliocentric (returns object now)
          const { pos: correctedHelioPos, entry } = getScaledPoint(
            mission.id,
            i,
            helioPos,
            config.sunScale,
            config.planetScale
          );

          // Now convert to Local Coordinate System (e.g. Earth Centered)
          const finalPos = correctedHelioPos.clone().sub(correction);

          smoothPoints.push({ pos: finalPos, date: p.date });

          // Process Extra Points (Densification)
          if (entry && entry.extraPoints && i < trajData.length - 1) {
            const nextP = trajData[i + 1];

            entry.extraPoints.forEach((extra) => {
              const t = extra.offsetT;

              // Interpolate Heliocentric Position
              const interpHelioPos = new THREE.Vector3().lerpVectors(p.pos, nextP.pos, t);

              // Interpolate Date
              const interpDate = p.date + (nextP.date - p.date) * t;

              // Apply Correction to Interpolated Point
              const correctedInterpHelio = applyCorrection(
                interpHelioPos,
                extra,
                config.sunScale,
                config.planetScale
              );

              // Coordinate System Correction for Interpolated Date
              const interpCoordCorrection = getCorrection(interpDate);

              const finalInterpPos = correctedInterpHelio.clone().sub(interpCoordCorrection);

              smoothPoints.push({ pos: finalInterpPos, date: interpDate });
            });
          }
        }
      }

      // Store corrected trajectory for probe interpolation
      line.userData.correctedTrajectory = smoothPoints;

      // Update Geometry
      const newGeometry = new LineGeometry();
      const positions: number[] = [];
      let lastPos: THREE.Vector3 | null = null;

      const parentOffset = line.parent ? line.parent.position : new THREE.Vector3(0, 0, 0);

      smoothPoints.forEach((p) => {
        if (lastPos && p.pos.distanceToSquared(lastPos) < 0.00000001) return;

        const x = p.pos.x - parentOffset.x;
        const y = p.pos.y - parentOffset.y;
        const z = p.pos.z - parentOffset.z;

        positions.push(x, y, z);
        lastPos = p.pos;
      });

      if (positions.length < 6) return;

      newGeometry.setPositions(positions);
      line.geometry.dispose();
      line.geometry = newGeometry;

      if (newGeometry.computeBoundingSphere) {
        newGeometry.computeBoundingSphere();
      }

      line.frustumCulled = false;
      line.updateMatrix();
      line.updateMatrixWorld(true);

      return;
    }

    // --- FALLBACK: Non-binary data path ---
    const calculatedWaypoints = mission.waypoints.map((wp) => {
      let pos = new THREE.Vector3();
      const time = new Date(wp.date);

      pos = getAbsoluteMissionWaypointPosition(wp);

      // Handle Exit Points
      if (wp.dist && mission.exit && !wp.body && !wp.customBody && !wp.pos) {
        const exitVec = getExitVector(mission.exit.ra, mission.exit.dec);
        pos = exitVec.multiplyScalar(wp.dist);
        if (wp.offset) {
          const offsetVec = new THREE.Vector3(wp.offset.x || 0, wp.offset.y || 0, wp.offset.z || 0);
          pos.add(offsetVec);
        }
      }

      // Apply Coordinate System Correction
      const correction = new THREE.Vector3(0, 0, 0);

      if (currentSystem === 'Geocentric' || currentSystem === 'Tychonic') {
        const earthPos = getBodyPosition('Earth', wp.date);
        correction.copy(earthPos);
      } else if (currentSystem === 'Barycentric') {
        const ssb = Astronomy.HelioVector(Astronomy.Body.SSB, time);
        correction.set(ssb.x, ssb.z, -ssb.y);
      }

      pos.sub(correction);

      return {
        pos,
        date: time.getTime(),
        type: getMissionPointType(wp),
        dist: wp.dist,
      };
    });

    // Second pass to resolve 'interpolate'
    const finalPoints: { pos: THREE.Vector3; date: number }[] = [];

    for (let i = 0; i < calculatedWaypoints.length; i++) {
      const wp = calculatedWaypoints[i];

      if (wp.type === 'interpolate') {
        const prev = finalPoints[i - 1];
        let next = null;
        for (let j = i + 1; j < calculatedWaypoints.length; j++) {
          if (calculatedWaypoints[j].type !== 'interpolate') {
            next = calculatedWaypoints[j];
            break;
          }
        }

        if (prev && next) {
          const totalTime = next.date - prev.date;
          const elapsedTime = wp.date - prev.date;
          const alpha = elapsedTime / totalTime;
          const pos = new THREE.Vector3().lerpVectors(prev.pos, next.pos, alpha);
          finalPoints.push({ pos, date: wp.date });
        } else {
          finalPoints.push({ pos: new THREE.Vector3(0, 0, 0), date: wp.date });
        }
      } else {
        finalPoints.push({ pos: wp.pos, date: wp.date });
      }
    }

    // Densify and smooth
    const densifiedPoints = densifyMissionPoints(finalPoints, mission.waypoints);

    let smoothPoints: Array<{ pos: THREE.Vector3; date: number }> | undefined;
    try {
      smoothPoints = createSmoothPath(densifiedPoints, 12000);
    } catch (e) {
      console.warn(`Failed to update path for mission ${mission.id}:`, e);
      return;
    }

    if (!smoothPoints || smoothPoints.length < 2) {
      return;
    }

    // Filter degenerate points
    const filteredPoints = [smoothPoints[0]];
    for (let i = 1; i < smoothPoints.length; i++) {
      const last = filteredPoints[filteredPoints.length - 1];
      const current = smoothPoints[i];
      if (last.pos.distanceToSquared(current.pos) > 1e-6) {
        filteredPoints.push(current);
      }
    }
    if (filteredPoints.length < 2) return;
    smoothPoints = filteredPoints;

    // Update Line2 Geometry
    const geometry = line.geometry;
    const positions: number[] = [];
    smoothPoints.forEach((p) => {
      const scaled = p.pos.clone().multiplyScalar(AU_TO_SCENE);
      positions.push(scaled.x, scaled.y, scaled.z);
    });

    geometry.setPositions(positions);
    line.computeLineDistances();

    // Update stored data
    line.userData.originalPoints = smoothPoints.map((p) =>
      p.pos.clone().multiplyScalar(AU_TO_SCENE)
    );
    line.userData.trajectoryData = smoothPoints.map((p) => ({
      pos: p.pos.clone().multiplyScalar(AU_TO_SCENE),
      date: p.date,
    }));

    geometry.computeBoundingSphere();
    line.userData.localOrigin.set(0, 0, 0);
    line.position.set(0, 0, 0);
    line.userData.totalLength = null;
  });
}

/**
 * Updates visual uniforms for mission lines based on current simulation time.
 * Also handles continuous centering (Local Rebase) to prevent floating point jitter.
 * Should be called every frame.
 * @param currentSimTime - Current simulation time in milliseconds
 */
export function updateMissionVisuals(currentSimTime: number): void {
  try {
    const lines = Object.values(missionLines);
    if (lines.length === 0) return;

    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

    // --- Continuous Centering (Local Rebase) ---
    const missionGroup = (lines[0] as Line2).parent;
    if (!missionGroup || !missionGroup.parent) return;

    const universeGroup = missionGroup.parent;
    const virtualCameraPos = universeGroup.position.clone().negate();

    // Check for rebase (threshold 5000 = 100 AU)
    if (missionGroup.position.distanceTo(virtualCameraPos) > 5000.0) {
      missionGroup.position.copy(virtualCameraPos);

      if (missionGroup.userData.rebaseCount === undefined) missionGroup.userData.rebaseCount = 0;
      missionGroup.userData.rebaseCount++;

      // Trigger full recalculation
      const parentScene = missionGroup.parent;
      if (parentScene) {
        updateMissionTrajectories(parentScene as THREE.Scene, true);
      }
    }

    // Material Resolution & Uniforms Update
    lines.forEach((line) => {
      const mat = line.material as LineMaterial;
      if (mat.resolution) {
        mat.resolution.copy(resolution);
      }

      if (!line.visible) return;

      const startTime = line.userData.startTime;
      const duration = line.userData.duration;

      if (!line.userData.totalLength) {
        let dist = 0;
        const pts = line.userData.originalPoints;
        for (let i = 1; i < pts.length; i++) {
          dist += pts[i].distanceTo(pts[i - 1]);
        }
        line.userData.totalLength = dist;

        if (mat.uniforms?.uTotalLength) {
          mat.uniforms.uTotalLength.value = dist;
        }
      }

      if (startTime !== undefined && duration > 0) {
        let relativeTime = (currentSimTime - startTime) / duration;
        relativeTime = Math.max(0, Math.min(1, relativeTime));

        if (mat.uniforms?.uCurrentTime) {
          mat.uniforms.uCurrentTime.value = relativeTime;
        }
      }
    });
  } catch (e) {
    // Suppress spammy visual update errors
    if (!window._suppressMissionErrors) {
      console.warn('Mission update error:', e);
      window._suppressMissionErrors = true;
    }
  }
}
