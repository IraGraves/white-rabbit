/**
 * @file missionGeometry.ts
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
import { AU_TO_SCENE, config } from '../config';
import { missionData } from '../data/missions';
import { createMissionLineMaterial } from '../materials/MissionLineMaterial';
import { TrajectoryLoader } from '../services/TrajectoryLoader';
// import { getInfluenceWindows } from './missionScaling';
import { missionLines } from './missionState';
import {
  createSmoothPath,
  densifyMissionPoints,
  getAbsoluteMissionWaypointPosition,
  getExitVector,
  getMissionPointType,
} from './missionTrajectory';
import { updateMissionTrajectories } from './missionUpdates';

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
  const loadPromises = missionData.map(async (mission) => {
    // Try to load high-precision binary data first
    const binaryData = await TrajectoryLoader.load(mission.id);
    let smoothPoints: Array<{ pos: THREE.Vector3; date: number }> | undefined;

    if (binaryData) {
      // Use binary data directly
      const positions = TrajectoryLoader.getGeometryData(mission.id);
      if (positions && positions.length >= 6) {
        smoothPoints = [];
        const rawArr = binaryData;
        const stride = 4;
        const count = rawArr.length / stride;

        for (let i = 0; i < count; i++) {
          const t = rawArr[i * stride];
          const x = rawArr[i * stride + 1];
          const y = rawArr[i * stride + 2];
          const z = rawArr[i * stride + 3];

          smoothPoints.push({
            pos: new THREE.Vector3(x, y, z), // AU
            date: t,
          });
        }
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
        if (last.pos.distanceToSquared(current.pos) > 1e-10) {
          filteredPoints.push(current);
        }
      }
      if (filteredPoints.length < 2) return;
      smoothPoints = filteredPoints;
    }

    // Create Line2 geometry
    const geometry = new LineGeometry();
    const positions: number[] = [];
    smoothPoints.forEach((p) => {
      const scaled = p.pos.clone().multiplyScalar(AU_TO_SCENE);
      positions.push(scaled.x, scaled.y, scaled.z);
    });

    geometry.setPositions(positions);

    const material = createMissionLineMaterial({
      color: mission.color ?? 0xffffff,
      linewidth: 3,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    });

    const line = new Line2(geometry, material);
    line.computeLineDistances();

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
    line.userData.pointCount = smoothPoints.length;
    line.userData.dateRange = `${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()}`;

    // Store original points for rebasing
    line.userData.originalPoints = smoothPoints.map((p) =>
      p.pos.clone().multiplyScalar(AU_TO_SCENE)
    );
    line.userData.trajectoryData = smoothPoints.map((p) => ({
      pos: p.pos.clone().multiplyScalar(AU_TO_SCENE),
      date: p.date,
    }));

    line.userData.localOrigin = new THREE.Vector3(0, 0, 0);

    scene.add(line);
    missionLines[mission.id] = line;
  });

  await Promise.all(loadPromises);

  // Force initial trajectory update
  updateMissionTrajectories(scene as THREE.Scene, true);

  return missionLines;
}
