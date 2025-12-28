/**
 * @file geometry.ts
 * @description Line2 geometry creation and initialization for mission trajectories.
 *
 * This module handles:
 * - Creating Line2 geometry from trajectory points
 * - Loading high-precision binary trajectory data
 * - Setting up mission line materials and metadata
 * - Initial influence window analysis for scaling
 */

import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { AU_TO_SCENE, config } from '../../config';
import { missionData } from '../../data/missions';
import { createMissionLineMaterial } from '../../materials/MissionLineMaterial';
import { TrajectoryLoader } from '../../services/TrajectoryLoader';
import { type Vector3Like, vDistSq } from '../../utils/vectorUtils';
// import { getInfluenceWindows } from './scaling';
import { missionLines } from './state';
import {
  createSmoothPath,
  densifyMissionPoints,
  getAbsoluteMissionWaypointPosition,
  getExitVector,
  getMissionPointType,
} from './trajectory';
import { updateMissionTrajectories } from './updates';

// Global resolution for Line2 materials
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

/**
 * Updates the resolution for mission line materials.
 * Should be called on window resize.
 * @param width - New window width
 * @param height - New window height
 */
export function resizeMissionVisuals(width: number, height: number): void {
  resolution.set(width, height);
}

/**
 * Initialize mission trajectories and add them to the scene.
 * Loads high-precision binary data when available, falls back to interpolation.
 * @param scene - The Three.js scene or group to add missions to
 * @returns Record of mission lines keyed by mission ID
 */
export async function initializeMissions(scene: THREE.Object3D): Promise<Record<string, Line2>> {
  // Missions that are orbit-only (no trajectory line)
  const ORBIT_ONLY_MISSIONS = ['teslaRoadster'];

  // Load baking configuration
  let bakingConfig = { defaultAngle: 1.0, exceptions: {} as Record<string, number> };
  try {
    const resp = await fetch('data/missions/baking_config.json');
    if (resp.ok) {
      bakingConfig = await resp.json();
    }
  } catch (e) {
    console.warn('Failed to load baking config, using defaults', e);
  }

  const loadPromises = missionData.map(async (mission) => {
    // Skip orbit-only missions (e.g., Tesla Roadster uses Keplerian orbit, not trajectory)
    if (ORBIT_ONLY_MISSIONS.includes(mission.id)) {
      return;
    }

    // Try to load high-precision binary data first
    const binaryData = await TrajectoryLoader.load(mission.id);
    // Updated to include v (velocity)
    let smoothPoints: Array<{ pos: Vector3Like; date: number; v?: Vector3Like }> | undefined;

    let angleLimit: number | undefined;

    if (binaryData) {
      // Use "baking" to generate smooth visualization from sparse data
      // Check if data is Stride 7 (Pos + Vel)
      // HEURISTIC: Check if length divisible by 7 AND index 4 (VX) is small.
      // If index 4 is a timestamp (> 1e9), it's Stride 4 (Next T).
      const isStride7 =
        binaryData.length > 0 && binaryData.length % 7 === 0 && Math.abs(binaryData[4]) < 1000; // 1000 AU/d is impossible (c is ~173)

      if (isStride7) {
        // Calculate limit
        angleLimit = bakingConfig.exceptions[mission.id] || bakingConfig.defaultAngle;

        // Yes, we have velocity! Bake it.
        const { generateBakedTrajectory } = await import('./trajectory');
        smoothPoints = generateBakedTrajectory(binaryData, angleLimit);
      } else {
        console.warn(
          `Mission ${mission.id} has invalid binary data format (not Stride 7). Ignoring.`
        );
      }
    }

    // Fallback to interpolation if no binary data
    if (!smoothPoints) {
      // Calculate positions for all waypoints
      const calculatedWaypoints = mission.waypoints.map((wp) => {
        const pos = getAbsoluteMissionWaypointPosition(wp);
        const type = getMissionPointType(wp);

        return {
          pos,
          date: new Date(wp.date).getTime(),
          type,
          dist: wp.dist,
        };
      });

      // Second pass to resolve 'exit' and 'interpolate'
      const finalPoints = [];

      for (let i = 0; i < calculatedWaypoints.length; i++) {
        const wp = calculatedWaypoints[i];

        if (wp.pos) {
          finalPoints.push({ pos: wp.pos, date: wp.date });
        } else if (wp.type === 'exit') {
          if (mission.exit) {
            const exitVec = getExitVector(mission.exit.ra, mission.exit.dec);
            const pos = exitVec.multiplyScalar(wp.dist || 0);
            finalPoints.push({ pos, date: wp.date });
          } else {
            finalPoints.push({ pos: new THREE.Vector3(0, 0, 0), date: wp.date });
          }
        } else if (wp.type === 'interpolate') {
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

      // Densify points near planets
      const densifiedPoints = densifyMissionPoints(finalPoints, mission.waypoints);

      try {
        smoothPoints = createSmoothPath(densifiedPoints, 12000);
      } catch (e) {
        console.warn(`Failed to create path for mission ${mission.id}:`, e);
        return;
      }
    }

    if (!smoothPoints || smoothPoints.length < 2) {
      return;
    }

    // Filter degenerate points
    if (!binaryData) {
      const filteredPoints = [smoothPoints[0]];
      for (let i = 1; i < smoothPoints.length; i++) {
        const last = filteredPoints[filteredPoints.length - 1];
        const current = smoothPoints[i];
        if (vDistSq(last.pos, current.pos) > 1e-10) {
          filteredPoints.push(current);
        }
      }
      if (filteredPoints.length < 2) return;
      smoothPoints = filteredPoints;
    }

    // Create Line2 geometry
    const geometry = new LineGeometry();
    const pointCount = smoothPoints.length;
    const positions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      const p = smoothPoints[i];
      positions[i * 3] = p.pos.x * AU_TO_SCENE;
      positions[i * 3 + 1] = p.pos.y * AU_TO_SCENE;
      positions[i * 3 + 2] = p.pos.z * AU_TO_SCENE;
    }

    geometry.setPositions(positions);

    const material = createMissionLineMaterial({
      color: mission.color ?? 0xffffff,
      linewidth: 3,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    });

    const line = new Line2(geometry, material);
    line.computeLineDistances();

    // Precise View Transformation:
    // We disable auto-update because we manually feed the View Matrix in the shader.
    // The mesh must stay at (0,0,0).
    line.matrixAutoUpdate = false;
    line.position.set(0, 0, 0);
    line.updateMatrix();
    line.updateMatrixWorld(true);

    // Store metadata
    const startTime = smoothPoints[0].date;
    const endTime = smoothPoints[smoothPoints.length - 1].date;
    const duration = endTime - startTime;

    line.userData.id = mission.id;
    line.userData.startTime = startTime;
    line.userData.duration = duration;
    line.visible = config.showMissions[mission.id as keyof typeof config.showMissions];
    line.userData.hasBinaryData = !!binaryData;
    line.frustumCulled = false;

    // Debug Metadata
    line.name = `Trajectory: ${mission.name}`;
    line.userData.missionName = mission.name;
    line.userData.pointCount = smoothPoints.length; // Baked Count
    line.userData.bakingAngle = angleLimit; // Store for stats
    line.userData.originalPointCount = binaryData
      ? binaryData.length / (binaryData.length % 7 === 0 ? 7 : 4)
      : smoothPoints.length;

    line.userData.dateRange = `${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()}`;

    // Store trajectory data for rebasing and interpolation (positions scaled to scene units)
    line.userData.trajectoryData = smoothPoints.map((p) => ({
      pos: { x: p.pos.x * AU_TO_SCENE, y: p.pos.y * AU_TO_SCENE, z: p.pos.z * AU_TO_SCENE },
      date: p.date,
      v: p.v
        ? { x: p.v.x * AU_TO_SCENE, y: p.v.y * AU_TO_SCENE, z: p.v.z * AU_TO_SCENE }
        : undefined,
    }));

    line.userData.localOrigin = new THREE.Vector3(0, 0, 0);

    // Compute cumulative distances for geometric projection
    const kumulativeDistances: number[] = [0];
    let totalDist = 0;
    for (let i = 0; i < pointCount - 1; i++) {
      const p1 = smoothPoints[i].pos;
      const p2 = smoothPoints[i + 1].pos;
      const dist = Math.sqrt(
        ((p2.x - p1.x) * AU_TO_SCENE) ** 2 +
          ((p2.y - p1.y) * AU_TO_SCENE) ** 2 +
          ((p2.z - p1.z) * AU_TO_SCENE) ** 2
      );
      totalDist += dist;
      kumulativeDistances.push(totalDist);
    }
    line.userData.cumulativeDistances = kumulativeDistances;
    line.userData.totalLength = totalDist;

    // Store processed runtime waypoints for high-precision probe interpolation
    // We filter down to just the resolved points that have dates
    // Note: finalPoints (from above fallback logic) or we need to map the ORIGINAL waypoints?
    // The fallback logic above (calculatedWaypoints -> finalPoints) helps resolve 'body' relative positions.
    // But it didn't strictly preserve 'v'.
    // Let's re-map the original waypoints using getAbsoluteMissionWaypointPosition to get fresh absolute positions + velocities.

    // We only need this if we DON'T have binary data (or if we want to support mixed mode).
    // The prompt implies "For all other probes" (non-Tesla).
    // If binary data exists, `getMissionState` uses it.
    // If NO binary data, we use the fallback.
    // So we should populate `runtimeWaypoints` inside the !binaryData block or just generally if needed.
    // However, `getAbsoluteMissionWaypointPosition` is expensive to call every frame, but cheap to call once here.

    const runtimeWaypoints = mission.waypoints
      .map((wp) => {
        const pos = getAbsoluteMissionWaypointPosition(wp);
        // Scale velocity: v is AU/Day. Scene is AU_TO_SCENE * AU.
        // So v_scene = v_au * AU_TO_SCENE.
        const v = wp.v ? wp.v.clone().multiplyScalar(AU_TO_SCENE) : undefined;
        return {
          pos,
          date: new Date(wp.date).getTime(),
          v,
        };
      })
      .sort((a, b) => a.date - b.date);

    line.userData.runtimeWaypoints = runtimeWaypoints;

    scene.add(line);
    missionLines[mission.id] = line;
  });

  await Promise.all(loadPromises);

  // Force initial trajectory update
  updateMissionTrajectories(scene as THREE.Scene, true);

  return missionLines;
}
