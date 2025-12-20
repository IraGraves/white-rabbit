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

import * as THREE from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { Line2 } from 'three/examples/jsm/lines/Line2.js';
import type { SimulationControl } from '../api/SimulationControl';
import { AU_TO_SCENE, config } from '../config';
import { missionData } from '../data/missions';
import { vDistSq, vSub, type Vector3Like } from '../utils/vectorUtils';
import { getMissionState, missionLines } from './missionState';
import {
  createSmoothPath,
  getAbsoluteMissionWaypointPosition,
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
    _debugCounter?: number;
    SimulationControl?: SimulationControl;
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
  // Visual Trajectories must ALWAYS be Heliocentric to align with the Planets in the UniverseGroup.
  // The UniverseGroup itself is moved to simulate Geocentric/Other views.
  // const currentSystem = 'Heliocentric'; // Unused

  // Check if we need to run (checking global config just for "change" detection is risky if we ignore it).
  // But if we force Heliocentric, we only need to run ONCE (or on data load).
  // AND we need to run if `forceUpdate` is true (rebase).
  // The old logic cached `lastCoordinateSystem`. If we hardcode 'Heliocentric', `lastCoordinateSystem` check might fail.

  // if (lastCoordinateSystem === config.coordinateSystem && !forceUpdate) ...
  // We can just proceed. Recalculating Heliocentric -> Heliocentric is fine/fast enough if lazy?

  // Actually, let's keep the check but use the real config for 'change detection',
  // but use 'Heliocentric' for the math.
  // Wait, if user switches to Geocentric, we do NOT want to update the geometry (it stays Helio).
  // So we should return immediately if not forceUpdate?

  // But `updateMissionTrajectories` is CALLED when coordinate system changes.
  // If we want checking 'Geocentric' to NOT change geometry, we just do nothing?

  // Correct behavior:
  // 1. Geometry is ALWAYS Heliocentric.
  // 2. We only update if `forceUpdate` (Rebase) or Data Loaded.
  // 3. Changing `config.coordinateSystem` should NOT trigger geometry rebuild.

  // So:
  if (!forceUpdate && lastCoordinateSystem === 'Heliocentric') {
    // If we are already initialized (Helio), and just switching UI systems, do nothing.
    // Update global tracker
    lastCoordinateSystem = config.coordinateSystem;
    return;
  }

  lastCoordinateSystem = config.coordinateSystem;
  // Proceed with 'Heliocentric' math.

  missionData.forEach((mission) => {
    const line = missionLines[mission.id];
    if (!line) return;

    // --- CHECK FOR BINARY DATA ---
    if (line.userData.hasBinaryData && line.userData.trajectoryData) {
      const smoothPoints: { pos: THREE.Vector3; date: number }[] = [];

      // Helper to get correction vector in SCENE units
      const getCorrection = (_time: number) => {
        // Force Heliocentric: Correction is always ZERO.
        return new THREE.Vector3(0, 0, 0);
      };

      const trajData = line.userData.trajectoryData as { pos: Vector3Like; date: number }[];

      if (trajData) {
        // Rebase all points with Point-Based Correction
        // Simple logic: Iterating 1:1 with loaded trajectory
        for (let i = 0; i < trajData.length; i++) {
          const p = trajData[i];
          const correction = getCorrection(p.date);

          // Use raw Heliocentric position for scaling check (matches JSON data)
          const helioPos = p.pos;

          // Now convert to Local Coordinate System (e.g. Earth Centered)
          // vSub returns a plain object. We convert to THREE.Vector3 for the geometry generation loop.
          // Note: 'correction' is a THREE.Vector3, which is compatible with Vector3Like for vSub.
          const finalPosLike = vSub(helioPos, correction);
          const finalPos = new THREE.Vector3(finalPosLike.x, finalPosLike.y, finalPosLike.z);

          // DEBUG: Rebase Check
          if (i === 0) {
            console.log(
              `[Trajectory Debug] First Rebased Point (Mission ${mission.id}): Raw=${helioPos.x.toFixed(10)}, Correction=${correction.x.toFixed(10)}, Result=${finalPos.x.toFixed(10)}`
            );
          }

          smoothPoints.push({ pos: finalPos, date: p.date });
        }
      }

      // Store corrected trajectory for probe interpolation (Legacy name kept for compatibility, now just coordinate-corrected)
      line.userData.correctedTrajectory = smoothPoints;

      // Update Geometry
      const newGeometry = new LineGeometry();

      // First pass: Count valid points to allocate buffer
      // (We filter dense points, so we can't know exact size upfront without a loop or over-allocating)
      // Over-allocating is safer/faster than push. Let's allocate max size and slice?
      // Actually, standard array push for filtering is fine if we convert to Float32Array at the end suitable for setPositions.
      // But user wanted NO intermediate number[]...
      // Let's use two passes or a growable approach?
      // Or just map 1:1 and filter implicit?
      // The filter `p.pos.distanceToSquared(lastPos) < 0.0025` reduces point count.

      // Let's stick to a temporary array of discrete numbers for the filter logic,
      // BUT strictly convert to Float32Array before setPositions.
      // Wait, the user wants NO number[] intermediate if possible.
      // "Ensure the relative positions are calculated as Float64 and then stored in a Float32Array (not Int32)."

      // Let's use a pre-allocated Float32Array of max size (smoothPoints.length * 3)
      // and keep a cursor.

      const maxFloats = smoothPoints.length * 3;
      const tempPositions = new Float32Array(maxFloats);
      let floatIndex = 0;
      let lastPos: THREE.Vector3 | null = null;

      // NOTE: Use raw heliocentric coordinates.
      // The scene hierarchy (universeGroup/missionGroup transforms) handles rebasing.
      // Adding globalOffset here would cause double-transformation.

      smoothPoints.forEach((p) => {
        // Filter out dense points
        if (lastPos && p.pos.distanceToSquared(lastPos) < 0.0025) return;

        tempPositions[floatIndex++] = p.pos.x;
        tempPositions[floatIndex++] = p.pos.y;
        tempPositions[floatIndex++] = p.pos.z;

        lastPos = p.pos;
      });

      if (floatIndex < 18) return; // Need at least 6 points (6 * 3 = 18 floats)

      // Slice exact size
      const positions = tempPositions.subarray(0, floatIndex);

      newGeometry.setPositions(positions);
      line.geometry.dispose();
      line.geometry = newGeometry;

      // Update stored data for gradient/length calculations
      line.computeLineDistances();

      // Calculate new total length
      let newTotalLen = 0;
      // We can use the geometry's line distances if available,
      // but easier to sum purely based on the positions we just pushed
      for (let i = 0; i < positions.length / 3 - 1; i++) {
        const i3 = i * 3;
        const j3 = (i + 1) * 3;
        const dx = positions[j3] - positions[i3];
        const dy = positions[j3 + 1] - positions[i3 + 1];
        const dz = positions[j3 + 2] - positions[i3 + 2];
        newTotalLen += Math.sqrt(dx * dx + dy * dy + dz * dz);
      }

      line.userData.totalLength = newTotalLen;
      if (line.material instanceof LineMaterial && line.material.uniforms.uTotalLength) {
        line.material.uniforms.uTotalLength.value = newTotalLen;
      }

      // Note: trajectoryData positions remain in original heliocentric coordinates
      // updateMissionVisuals applies globalOffset when updating geometry each frame

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
      // const time = new Date(wp.date); // Unused

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
      // Since currentSystem is forced to 'Heliocentric' above, this block is effectively disabled.
      // We keep the structure simple or just remove it.

      // if (currentSystem === 'Geocentric' || currentSystem === 'Tychonic') { ... }
      // Removed to resolve lint errors and enforce Heliocentric geometry.
      // pos.sub(correction); // No-op

      return {
        pos,
        date: new Date(wp.date).getTime(),
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
    // createSmoothPath returns { pos: Vector3Like, date: number }[]
    let smoothPoints: Array<{ pos: Vector3Like; date: number }> | undefined;
    try {
      // createSmoothPath now accepts Vector3Like, and finalPoints are THREE.Vector3 (compatible)
      smoothPoints = createSmoothPath(finalPoints, 12000);
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
      // Use vDistSq for Vector3Like
      if (vDistSq(last.pos, current.pos) > 1e-6) {
        filteredPoints.push(current);
      }
    }
    if (filteredPoints.length < 2) return;
    smoothPoints = filteredPoints;

    // Update Line2 Geometry
    const geometry = line.geometry;
    const positions: number[] = [];
    smoothPoints.forEach((p) => {
      // Manual scaling: p.pos is Vector3Like
      const x = p.pos.x * AU_TO_SCENE;
      const y = p.pos.y * AU_TO_SCENE;
      const z = p.pos.z * AU_TO_SCENE;
      positions.push(x, y, z);
    });

    geometry.setPositions(positions);
    line.computeLineDistances();

    // Update stored data
    // Scale and convert to Vector3Like for storage (matching binary path)
    line.userData.trajectoryData = smoothPoints.map((p) => ({
      pos: { x: p.pos.x * AU_TO_SCENE, y: p.pos.y * AU_TO_SCENE, z: p.pos.z * AU_TO_SCENE },
      date: p.date,
    }));

    // Note: trajectoryData already contains positions, no need for separate originalPoints

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
export function updateMissionVisuals(currentSimTime: number, camera?: THREE.Camera): void {
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

      const trajData = line.userData.trajectoryData as { pos: Vector3Like; date: number }[];
      if (camera && trajData && trajData.length >= 2) {
        // DIRECT WORLD-TO-CAMERA SYNC
        // We use controls.getVirtualPosition() as the single source of truth for the camera's
        // logical world position. This matches the Probe's positioning logic EXACTLY.
        const simCtrl = window.SimulationControl;
        let virtualCameraX = 0;
        let virtualCameraY = 0;
        let virtualCameraZ = 0;

        if (simCtrl?.controls?.getVirtualPosition) {
          const vPos = simCtrl.controls.getVirtualPosition();
          virtualCameraX = vPos.x;
          virtualCameraY = vPos.y;
          virtualCameraZ = vPos.z;
        } else {
          // Fallback if controls not ready (should generally not happen during runtime)
          const universeGroup = line.parent?.parent;
          if (universeGroup) {
            virtualCameraX = -universeGroup.position.x;
            virtualCameraY = -universeGroup.position.y;
            virtualCameraZ = -universeGroup.position.z;
          }
        }

        // Update Geometry Buffer
        // We use a Float32Array to avoid massive allocations every frame, if possible?
        // Line2.setPositions expects number[]. Three.js Line2 implementation might be inefficient here.
        // But for < 1000 points it's fine.
        // We must include the bridge segments!
        const originalCount = line.userData.originalPointCount ?? trajData.length;
        const totalCount = line.userData.pointCount ?? trajData.length;
        const positions: number[] = new Array(totalCount * 3);

        // 1. Copy Standard Trajectory (Applying Rebase)
        for (let i = 0; i < originalCount; i++) {
          const p = trajData[i]?.pos;
          if (p) {
            positions[i * 3] = p.x - virtualCameraX;
            positions[i * 3 + 1] = p.y - virtualCameraY;
            positions[i * 3 + 2] = p.z - virtualCameraZ;
          }
        }

        // 2. Dynamic Bridge Injection
        // Find current segment index
        // We can optimize this search since time matches linear index mostly, but binary search or simple scan is fine for 400 pts.
        let currentIndex = -1;
        for (let i = 0; i < originalCount - 1; i++) {
          if (trajData[i].date <= currentSimTime && trajData[i + 1].date > currentSimTime) {
            currentIndex = i;
            break;
          }
        }

        // Default Bridge State: Collapsed at end of line (Hidden)
        const bx = positions[(originalCount - 1) * 3];
        const by = positions[(originalCount - 1) * 3 + 1];
        const bz = positions[(originalCount - 1) * 3 + 2];

        // Fill remaining slots with default first
        for (let k = originalCount; k < totalCount; k++) {
          positions[k * 3] = bx;
          positions[k * 3 + 1] = by;
          positions[k * 3 + 2] = bz;
        }

        if (currentIndex !== -1 && getMissionState) {
          // Get Probe Position (Analytic)
          // We need the probe position in visual space (Rebased)
          // getMissionState returns Heliocentric.
          const probeState = getMissionState(line.userData.id, currentSimTime);

          if (probeState) {
            const probX = probeState.position.x - virtualCameraX;
            const probY = probeState.position.y - virtualCameraY;
            const probZ = probeState.position.z - virtualCameraZ;

            // Dynamic Bridge via Insertion:
            // Build [P0...Pn, Probe, Pn+1...Plast], pad remainder with last point

            const finalPositions: number[] = new Array(totalCount * 3);
            let fpIdx = 0;

            // 1. Head (P0 ... Pn)
            const headEnd = currentIndex + 1; // inclusive of Pn
            for (let i = 0; i < headEnd; i++) {
              finalPositions[fpIdx++] = positions[i * 3];
              finalPositions[fpIdx++] = positions[i * 3 + 1];
              finalPositions[fpIdx++] = positions[i * 3 + 2];
            }

            // 2. Bridge (Probe)
            finalPositions[fpIdx++] = probX;
            finalPositions[fpIdx++] = probY;
            finalPositions[fpIdx++] = probZ;

            // 3. Tail (Pn+1 ... Plast)
            for (let i = headEnd; i < originalCount; i++) {
              finalPositions[fpIdx++] = positions[i * 3];
              finalPositions[fpIdx++] = positions[i * 3 + 1];
              finalPositions[fpIdx++] = positions[i * 3 + 2];
            }

            // 4. Padding (Repeat Last) to fill buffer
            const lastIdx = fpIdx / 3 - 1;
            const lX = finalPositions[lastIdx * 3];
            const lY = finalPositions[lastIdx * 3 + 1];
            const lZ = finalPositions[lastIdx * 3 + 2];

            while (fpIdx < finalPositions.length) {
              finalPositions[fpIdx++] = lX;
              finalPositions[fpIdx++] = lY;
              finalPositions[fpIdx++] = lZ;
            }

            line.geometry.setPositions(finalPositions);
            return; // Done
          }
        }

        // Fallback (No bridge active or probe hidden): Just fill normally
        line.geometry.setPositions(positions);

        // Update View Rotation Matrix (Rotation Only)
        if (mat.uniforms.uViewRotationMatrix) {
          // Ensure matrices are fresh - Essential for preventing frame-delay jitter
          camera.updateMatrixWorld(true);
          camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

          const viewMatrix = camera.matrixWorldInverse.clone();
          // Zero out translation to make it a pure rotation matrix
          viewMatrix.elements[12] = 0;
          viewMatrix.elements[13] = 0;
          viewMatrix.elements[14] = 0;
          mat.uniforms.uViewRotationMatrix.value.copy(viewMatrix);
        }
      }

      const startTime = line.userData.startTime;
      const duration = line.userData.duration;

      if (!line.userData.totalLength) {
        let dist = 0;
        const trajPts = line.userData.trajectoryData as { pos: Vector3Like }[];
        for (let i = 1; i < trajPts.length; i++) {
          const p1 = trajPts[i - 1].pos;
          const p2 = trajPts[i].pos;
          const dx = p2.x - p1.x,
            dy = p2.y - p1.y,
            dz = p2.z - p1.z;
          dist += Math.sqrt(dx * dx + dy * dy + dz * dz);
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
