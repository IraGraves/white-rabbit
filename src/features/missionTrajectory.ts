/**
 * @file missionTrajectory.ts
 * @description Core trajectory calculation and path generation for space missions.
 *
 * This module handles:
 * - Catmull-Rom spline interpolation for smooth paths
 * - Body position calculation using Astronomy Engine
 * - Exit vector calculation for interstellar trajectories
 * - Waypoint position resolution with offset handling
 * - Flyby fillet generation for smooth planetary encounters
 */

import * as AstronomyLib from 'astronomy-engine';
const Astronomy = (AstronomyLib as any).default || AstronomyLib;
import * as THREE from 'three';
import { AU_TO_SCENE, config, REAL_PLANET_SCALE_FACTOR } from '../config';

// ...

import { customBodies } from '../data/missions';
import { calculateKeplerianPosition } from '../physics/orbits';
import type { CustomBody, MissionWaypoint } from '../types';

/**
 * Determines the type of a mission waypoint.
 * @param wp - The waypoint to classify
 * @returns 'exit' for deep space points, 'interpolate' for intermediate points, 'fixed' for known positions
 */
export function getMissionPointType(wp: MissionWaypoint): string {
  if (wp.dist && !wp.body && !wp.customBody && !wp.pos) return 'exit';
  if (!wp.body && !wp.customBody && !wp.pos && !wp.dist) return 'interpolate';
  return 'fixed';
}

/**
 * Generate smooth path points from waypoints using Catmull-Rom spline interpolation.
 * Also interpolates time between waypoints for accurate temporal positioning.
 * @param waypoints - Array of waypoints with position and date
 * @param segments - Number of interpolated segments (default: 100)
 * @returns Array of smoothly interpolated points with positions and dates
 */
export function createSmoothPath(
  waypoints: Array<{ pos: THREE.Vector3; date: number }>,
  segments: number = 100
): Array<{ pos: THREE.Vector3; date: number }> {
  if (!waypoints || waypoints.length < 2) {
    return waypoints || [];
  }

  const positions = waypoints.map((wp) => wp.pos);
  // Use 'centripetal' to handle the extreme scale difference between interplanetary legs (5 AU)
  // and the dense flyby fillets (0.02 AU). Uniform 'catmullrom' causes wild loops/overshoots here.
  // Since the corners are now "baked" Bezier curves, centripetal will follow them smoothly without cutting corners.
  const curve = new THREE.CatmullRomCurve3(positions, false, 'centripetal');

  const points = [];
  const numWaypoints = waypoints.length;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pos = curve.getPoint(t);

    // Interpolate Date
    // Since we use Uniform parameterization, t maps linearly to waypoint indices
    const floatIndex = t * (numWaypoints - 1);
    const lowerIndex = Math.floor(floatIndex);

    // Safety check just in case
    if (lowerIndex < 0) {
      points.push({ pos, date: waypoints[0].date });
      continue;
    }

    // Ensure upperIndex does not exceed array bounds
    const upperIndex = Math.min(lowerIndex + 1, numWaypoints - 1);
    const alpha = Math.max(0, floatIndex - lowerIndex);

    const date =
      waypoints[lowerIndex].date +
      (waypoints[upperIndex].date - waypoints[lowerIndex].date) * alpha;

    points.push({ pos, date });
  }

  return points;
}

/**
 * Gets the position of a celestial body at a specific date.
 * Supports both Astronomy Engine bodies and custom Keplerian elements.
 * @param bodyName - Name of the body (e.g., 'Earth', 'Jupiter')
 * @param dateStr - Date as string or Date object
 * @param customElements - Optional custom Keplerian elements for minor bodies
 * @returns Position in scene coordinates (AU)
 */
// Debug Astronomy Import
console.log('[Trajectory Debug] Astronomy Import Keys:', Object.keys(Astronomy || {}));
if (Astronomy && (Astronomy as any).default) {
  console.log(
    '[Trajectory Debug] Astronomy.default Keys:',
    Object.keys((Astronomy as any).default)
  );
}

export function getBodyPosition(
  bodyName: string | null,
  dateStr: string | Date,
  customElements: CustomBody | null = null
): THREE.Vector3 {
  const date = new Date(dateStr);

  if (customElements) {
    const pos = calculateKeplerianPosition(customElements, date);
    // calculateKeplerianPosition returns {x, y, z} in HELIOCENTRIC coordinates
    // where Z is North Ecliptic Pole.
    // Scene coordinates: X=x, Y=z, Z=-y
    return new THREE.Vector3(pos.x, pos.z, -pos.y);
  }

  if (!bodyName) {
    return new THREE.Vector3(0, 0, 0);
  }

  if (!Astronomy || !Astronomy.Body) {
    console.error('[Trajectory Error] Astronomy Engine not loaded correctly!', Astronomy);
    return new THREE.Vector3(0, 0, 0);
  }

  const body = Astronomy.Body[bodyName as keyof typeof Astronomy.Body];
  if (!body) {
    // console.warn(`Body ${bodyName} not found in Astronomy engine`); // Reduce spam
    return new THREE.Vector3(0, 0, 0);
  }

  const vec = Astronomy.HelioVector(body, date);
  if (!vec) {
    console.warn(`Failed to calculate vector for ${bodyName} at ${date}`);
    return new THREE.Vector3(0, 0, 0);
  }

  // Debug Jupiter
  if (bodyName === 'Jupiter' && Math.random() < 0.001) {
    console.log(`[Trajectory Debug] Jupiter Position: ${vec.x}, ${vec.y}, ${vec.z}`);
  }

  // Convert Astronomy engine coordinates to Scene coordinates
  // Astronomy: x=Equinox, y=90deg, z=North
  // Scene: x=x, y=z, z=-y
  return new THREE.Vector3(vec.x, vec.z, -vec.y);
}

/**
 * Calculates exit vector direction for deep space missions.
 * Used for Voyager, Pioneer, and other interstellar trajectories.
 * @param raHours - Right Ascension in hours
 * @param decDeg - Declination in degrees
 * @returns Normalized direction vector in scene coordinates
 */
export function getExitVector(raHours: number, decDeg: number): THREE.Vector3 {
  const raRad = raHours * 15 * (Math.PI / 180);
  const decRad = decDeg * (Math.PI / 180);

  // Spherical to Cartesian (Heliocentric)
  const x = Math.cos(decRad) * Math.cos(raRad);
  const y = Math.cos(decRad) * Math.sin(raRad);
  const z = Math.sin(decRad);

  // Convert to Scene: X=x, Y=z, Z=-y
  return new THREE.Vector3(x, z, -y);
}

/**
 * Gets the absolute heliocentric position of a mission waypoint.
 * Applies dynamic scaling to offsets based on planet scale to prevent clipping.
 * @param wp - The waypoint to resolve
 * @returns Position in heliocentric scene coordinates (AU)
 */
export function getAbsoluteMissionWaypointPosition(wp: MissionWaypoint): THREE.Vector3 {
  let pos = new THREE.Vector3(0, 0, 0);

  // 1. Base Position
  if (wp.body) {
    pos = getBodyPosition(wp.body, wp.date);
  } else if (wp.customBody && customBodies[wp.customBody]) {
    pos = getBodyPosition(null, wp.date, customBodies[wp.customBody]);
  } else if (wp.pos) {
    pos = wp.pos.clone();
  } else if (wp.dist) {
    // Dist is handled by context (exit vector) usually, but return 0 here
    return new THREE.Vector3(0, 0, 0);
  }

  // 2. Apply Offset (Scale-Aware)
  if (wp.offset) {
    // If it's a body-relative waypoint, scale the offset with the planet
    // so the trajectory doesn't end up inside the expanded planet.
    let scale = 1;
    if (wp.body || wp.customBody) {
      // Scale factor based on planet scale config (minimum 1x to prevent invisibility)
      const factor = Math.max(1, config.planetScale * REAL_PLANET_SCALE_FACTOR);
      scale = factor;
    }

    const offsetVec = new THREE.Vector3(wp.offset.x || 0, wp.offset.y || 0, wp.offset.z || 0);
    pos.add(offsetVec.multiplyScalar(scale));
  } else if (wp.lat !== undefined && wp.lon !== undefined && wp.body) {
    // Dynamic Geolocation Offset for launch sites
    const factor = Math.max(1, config.planetScale * REAL_PLANET_SCALE_FACTOR);

    // Get Sidereal Time
    const date = new Date(wp.date);
    const gst = Astronomy.SiderealTime(date);

    // Convert Lon to RA
    const lonHours = wp.lon / 15.0;
    const raLocal = (gst + lonHours + 24) % 24;
    const decLocal = wp.lat;

    // Convert RA/Dec to Cartesian
    const raRad = (raLocal * 15 * Math.PI) / 180;
    const decRad = (decLocal * Math.PI) / 180;

    const x = Math.cos(decRad) * Math.cos(raRad);
    const y = Math.cos(decRad) * Math.sin(raRad);
    const z = Math.sin(decRad);

    // Scale by Altitude (Radius + Alt)
    const radiusAU = 0.000045;
    const sceneOffset = new THREE.Vector3(x, z, -y).multiplyScalar(radiusAU * factor);
    pos.add(sceneOffset);
  }

  return pos;
}

/**
 * Densifies mission points by adding approach/departure helpers at flybys.
 * This fixes "sharp corner" artifacts by forcing the spline to curve around planets
 * using quadratic Bezier curves at flyby points.
 * @param points - Original trajectory points
 * @param waypoints - Mission waypoint definitions
 * @returns Densified points with smooth flyby curves
 */
export function densifyMissionPoints(
  points: { pos: THREE.Vector3; date: number }[],
  waypoints: MissionWaypoint[]
): { pos: THREE.Vector3; date: number }[] {
  const densified: { pos: THREE.Vector3; date: number }[] = [];
  const FILLET_DIST = 0.2 * AU_TO_SCENE;

  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const wp = waypoints[i];

    // Check if this is a Planetary Flyby (has 'body' and neighbors)
    // We don't fillet Earth (Launch) or Endpoints, only middle flybys.
    if (wp.body && i > 0 && i < points.length - 1) {
      const prev = points[i - 1];
      const next = points[i + 1];

      // 1. Approach Point
      const vecIn = new THREE.Vector3().subVectors(curr.pos, prev.pos);
      const distIn = vecIn.length();
      const offsetIn = Math.min(distIn * 0.1, FILLET_DIST);
      const appPos = curr.pos.clone().sub(vecIn.normalize().multiplyScalar(offsetIn));
      const appAlpha = offsetIn / distIn;
      const appDate = curr.date - (curr.date - prev.date) * appAlpha;

      // 2. Departure Point
      const vecOut = new THREE.Vector3().subVectors(next.pos, curr.pos);
      const distOut = vecOut.length();
      const offsetOut = Math.min(distOut * 0.1, FILLET_DIST);
      const depPos = curr.pos.clone().add(vecOut.normalize().multiplyScalar(offsetOut));
      const depAlpha = offsetOut / distOut;
      const depDate = curr.date + (next.date - curr.date) * depAlpha;

      // 3. Generate Bezier Curve points (Quadratic Bezier)
      const NUM_SUB_STEPS = 8;
      for (let k = 0; k <= NUM_SUB_STEPS; k++) {
        const t = k / NUM_SUB_STEPS;

        // Quadratic Bezier Formula: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const p0 = appPos;
        const p1 = curr.pos;
        const p2 = depPos;

        const pos = new THREE.Vector3()
          .copy(p0)
          .multiplyScalar((1 - t) * (1 - t))
          .add(p1.clone().multiplyScalar(2 * (1 - t) * t))
          .add(p2.clone().multiplyScalar(t * t));

        const date = appDate + (depDate - appDate) * t;
        densified.push({ pos, date });
      }
    } else {
      // Pass through normal point
      densified.push(curr);
    }
  }

  return densified;
}
