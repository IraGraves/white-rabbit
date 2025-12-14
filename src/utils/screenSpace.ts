/**
 * @file screenSpace.ts
 * @description Screen-space projection and distance calculation utilities.
 *
 * Provides helper functions for converting 3D world coordinates to 2D screen space
 * and calculating distances for UI hit detection and object selection.
 *
 * Key use cases:
 * - Tooltip hit detection for small/distant objects
 * - Focus mode object selection
 * - Constellation line segment proximity testing
 * - UI element positioning relative to 3D objects
 */

import * as THREE from 'three';
import type { CelestialBodyData, ObjectHitResult, PlanetWrapper, ScreenPosition } from '../types';

/**
 * Projects a 3D world position to 2D screen coordinates.
 * Returns null if the position is behind the camera.
 */
export function worldToScreen(
  worldPos: THREE.Vector3,
  camera: THREE.Camera
): ScreenPosition | null {
  const projected = worldPos.clone().project(camera);

  // Check if in front of camera
  if (projected.z < -1 || projected.z > 1) {
    return null;
  }

  // Convert normalized device coordinates to screen pixels
  const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
  const screenY = (-(projected.y * 0.5) + 0.5) * window.innerHeight;

  return { x: screenX, y: screenY, z: projected.z };
}

/**
 * Calculates the squared distance from a point to a line segment.
 * Using squared distance avoids expensive sqrt() for performance.
 */
export function distToSegmentSquared(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  // Segment length squared
  const l2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

  // Degenerate case: segment is a point
  if (l2 === 0) {
    return (px - x1) * (px - x1) + (py - y1) * (py - y1);
  }

  // Project point onto line, normalized to [0, 1] range
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t)); // Clamp to segment

  // Nearest point on segment
  const nearestX = x1 + t * (x2 - x1);
  const nearestY = y1 + t * (y2 - y1);

  // Squared distance to nearest point
  return (px - nearestX) * (px - nearestX) + (py - nearestY) * (py - nearestY);
}

/**
 * Finds the closest object to a screen position using generous screen-space hit detection.
 * Fallback method when precise 3D raycasting fails (e.g., for very small or distant objects).
 */
export function findClosestObjectScreenSpace(
  mouseX: number,
  mouseY: number,
  camera: THREE.Camera,
  planets: PlanetWrapper[],
  sun: THREE.Mesh | null,
  hitRadius = 20
): ObjectHitResult | null {
  let closest: ObjectHitResult | null = null;
  let minDist = hitRadius;

  /**
   * Internal helper to check distance and update closest object
   */
  const check = (
    mesh: THREE.Mesh | undefined,
    type: ObjectHitResult['type'],
    data: CelestialBodyData | Record<string, unknown>,
    parentName?: string
  ): void => {
    if (!mesh || !mesh.visible) return;

    // Get world position
    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);

    // Project to screen
    const screen = worldToScreen(worldPos, camera);
    if (!screen) return; // Behind camera

    // Calculate distance from mouse
    const dx = mouseX - screen.x;
    const dy = mouseY - screen.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < minDist) {
      minDist = dist;
      closest = { type, data, parentName };
    }
  };

  // Check Sun
  if (sun) {
    check(sun, 'sun', {});
  }

  // Check Planets and Moons
  planets.forEach((p) => {
    check(p.mesh, 'planet', p.data);
    if (p.moons) {
      p.moons.forEach((m) => {
        check(m.mesh, 'moon', m.data, p.data.name);
      });
    }
  });

  return closest;
}
