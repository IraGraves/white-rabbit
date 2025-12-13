import * as THREE from 'three';
import { AU_TO_SCENE, config, REAL_PLANET_SCALE_FACTOR } from '../config';
import { missionData } from '../data/missions';
import { getBodyPosition } from './missions';

// Influence window around flybys (time in ms)
// 10 days before and after seems reasonable for meaningful scaling
const FLYBY_WINDOW = 10 * 24 * 3600 * 1000;

interface FlybyInfo {
  body: string;
  date: number;
  radius: number; // in AU
}

// Cache flyby definitions per mission to avoid re-parsing
const missionFlybys: Record<string, FlybyInfo[]> = {};

/**
 * Pre-parse mission waypoints to find flybys.
 */
function getMissionFlybys(missionId: string): FlybyInfo[] {
  if (missionFlybys[missionId]) return missionFlybys[missionId];

  const mission = missionData.find((m) => m.id === missionId);
  if (!mission) return [];

  const flybys: FlybyInfo[] = [];
  mission.waypoints.forEach((wp) => {
    if (wp.body && wp.body !== 'Earth') {
      // Skip Earth launch usually
      // We need approximate body radius.
      flybys.push({
        body: wp.body,
        date: new Date(wp.date).getTime(),
        radius: 0.0005, // Default influence core radius (approx Jupiter)
      });
    }
  });

  missionFlybys[missionId] = flybys;
  return flybys;
}

/**
 * Apply Planet Scale Correction to a point.
 * @param missionId
 * @param pointPos Absolute Position (Scene Units)
 * @param pointDate Timestamp
 */
// Approximate Body Radii in km (for proximity checks)
const BODY_RADII_KM: Record<string, number> = {
  Sun: 696340,
  Mercury: 2439,
  Venus: 6051,
  Earth: 6371,
  Mars: 3389,
  Jupiter: 69911,
  Saturn: 58232,
  Uranus: 25362,
  Neptune: 24622,
  Pluto: 1188,
  // Approximate for minor bodies
  '67P': 2,
  Gaspra: 6,
  Ida: 15,
  Arrokoth: 15,
  Ulysses: 0, // Virtual
};

export function getScaledMissionPosition(
  missionId: string,
  pointPos: THREE.Vector3,
  pointDate: number,
  correction: THREE.Vector3 = new THREE.Vector3()
): THREE.Vector3 {
  // 1. Always apply correction if defined (we don't skip 1.0 anymore because 1.0 = 500x visual)
  // if (config.planetScale <= 1.05) return pointPos;

  // 2. Find relevant flyby list
  const flybys = getMissionFlybys(missionId);
  if (flybys.length === 0) return pointPos;

  // 3. Altitude Preservation Strategy
  // User Requirement: "Just move it away from the planet taking into account the scaled radius, to keep the original distance"
  // NewPos = BodyPos + Dir * (VisualRadius + Altitude)
  // Altitude = RealDist - RealRadius

  // Find the closest body from the mission's flyby list (Spatial Search instead of Temporal)
  let bestBody = null;
  let minDistConfig = Infinity;
  let bestBodyPos = null;
  let bestVec = null;
  let bestRadiusScene = 0;

  // We need to check all potential bodies to find which one dominates
  // Optimization: Identify candidates based on TIME first.
  // Calculating Body Position (VSOP87) is expensive. We shouldn't do it for every body for every point.
  // Assumption: You are only ever spatially close to a body if you are temporally close to a defined event
  // (Launch, Flyby, Orbit Insertion).
  // Strategy: Sort flybys by time distance. Check the top 2 candidates.

  // Sort flybys by temporal distance to this point
  // Note: This allocation might be costly inside a tight loop?
  // Array.sort is O(N log N). Flybys length is small (avg 5).
  // But creating the array and sorting is overhead.
  // Better: Single pass find closest.

  let closestFlyby = null;
  let secondClosest = null;
  let minTime = Infinity;
  let secondMinTime = Infinity;

  for (let i = 0; i < flybys.length; i++) {
    const f = flybys[i];
    const dt = Math.abs(pointDate - f.date);
    if (dt < minTime) {
      secondMinTime = minTime;
      secondClosest = closestFlyby;

      minTime = dt;
      closestFlyby = f;
    } else if (dt < secondMinTime) {
      secondMinTime = dt;
      secondClosest = f;
    }
  }

  const bodiesToCheck = new Set<string>();
  if (closestFlyby) bodiesToCheck.add(closestFlyby.body);
  // Optional: Check second closest if it's within a reasonable overlap window?
  // It's safer to just check it. overhead is minimal (2 vs 5).
  if (secondClosest) bodiesToCheck.add(secondClosest.body);

  for (const bodyName of bodiesToCheck) {
    const bPosAU = getBodyPosition(bodyName, new Date(pointDate));
    // Apply offset correction
    const bPos = bPosAU.clone().multiplyScalar(AU_TO_SCENE).sub(correction);
    const v = new THREE.Vector3().subVectors(pointPos, bPos);
    const d = v.length();

    // Check physical radius
    const rKm = BODY_RADII_KM[bodyName] || 2000;
    const rScene = (rKm / 149597870) * AU_TO_SCENE;

    // Determine Influence Range (e.g. 10x Visual Radius or specific Hill Sphere proxy)
    // Normalize distance by radius to compare "closeness" across different sized bodies
    const normalizedDist = d / rScene;

    if (normalizedDist < minDistConfig) {
      minDistConfig = normalizedDist;
      bestBody = bodyName;
      bestBodyPos = bPos;
      bestVec = v;
      bestRadiusScene = rScene;
    }
  }

  // Cutoff at 3000 radii (well outside visual influence of 500-2500x scale)
  const MAX_INFLUENCE_RADII = 3000;
  if (!bestBody || minDistConfig > MAX_INFLUENCE_RADII || !bestVec || !bestBodyPos) {
    return pointPos;
  }

  // 4. Calculate Correction
  const bestDist = bestVec.length(); // Real Distance (Renamed from dist to avoid shadowing warning if any)
  const effectiveVisualScale = config.planetScale * REAL_PLANET_SCALE_FACTOR;

  const visualRadius = bestRadiusScene * effectiveVisualScale;
  const realRadius = bestRadiusScene;

  // Altitude = bestDist - realRadius
  // Note: If inside planet (bestDist < realRadius), altitude is negative.
  // We generally preserve that too (result will be inside visual planet, which is correct).
  const altitude = bestDist - realRadius;

  // Target Distance = VisualRadius + Altitude
  // Shift = VisualRadius - RealRadius
  const shift = visualRadius - realRadius;

  // 5. Blending (Fade Out)
  // We want full correction at the surface (and inside).
  // We want 0 correction far away.
  // The transition should happen "outside" the visual bubble.
  // Start Fading at: VisualRadius * 1.2
  // End Fading at: VisualRadius * 5.0

  const fadeStart = visualRadius * 1.2;
  const fadeEnd = visualRadius * 5.0;

  let weight = 0;

  if (bestDist < fadeStart) {
    weight = 1.0;
  } else if (bestDist > fadeEnd) {
    weight = 0.0;
  } else {
    // Linear transition region
    const t = (bestDist - fadeStart) / (fadeEnd - fadeStart);
    weight = 1.0 - t;
    weight = weight * weight * (3 - 2 * weight); // Smoothstep blending
  }

  if (weight <= 0.001) return pointPos;

  // Apply Correction
  // NewDist = RealDist + Shift * Weight
  const newDist = bestDist + shift * weight;

  return bestBodyPos.add(bestVec.normalize().multiplyScalar(newDist));
}

// Optimization: Pre-calculate "Influence Windows" at load time.
// Since the visual scale can change (up to 2500x), we need to capture any segment
// where the probe IS potentially within the "Max Visual Bubble".
// Max Visual Radius = RealRadius * 2500.
// Fade End = 5.0 * Visual Radius.
// So Limit = RealRadius * 2500 * 5.0 = 12,500 Radii.
// We map these segments to time ranges.

export interface InfluenceWindow {
  body: string;
  start: number;
  end: number;
  // Cache physically static info
  bodyRadiusScene: number;
}

export function analyzeMissionInfluence(
  missionId: string,
  trajectory: { pos: THREE.Vector3; date: number }[],
  currentPlanetScale: number
): InfluenceWindow[] {
  const flybys = getMissionFlybys(missionId);
  if (!flybys.length || !trajectory.length) return [];

  const effectiveVisualScale = currentPlanetScale * REAL_PLANET_SCALE_FACTOR;

  const windows: InfluenceWindow[] = [];
  let currentWindow: InfluenceWindow | null = null;

  // Reuse the temporal sorting helper to find candidates efficiently
  // We can just iterate the trajectory linearly.

  // Optimization: Flybys are sorted by date usually?
  // Let's just use the robust "Check all relevant flybys" approach but cached.

  for (let i = 0; i < trajectory.length; i++) {
    const p = trajectory[i];
    const pointDate = p.date;

    // 1. Find candidates (Temporal)
    let bestCandidate = null;
    let minDt = Infinity;

    // Simple linear scan of flybys (N is small)
    for (const f of flybys) {
      const dt = Math.abs(pointDate - f.date);
      if (dt < minDt) {
        minDt = dt;
        bestCandidate = f;
      }
    }

    if (!bestCandidate) continue;

    // 2. Check Distance (Expensive part, done once)
    // Get Body Position
    const rKm = BODY_RADII_KM[bestCandidate.body] || 2000;
    const rScene = (rKm / 149597870) * AU_TO_SCENE;
    // Threshold: VisualRadius * 3.0 (Matches FadeEnd * 1.5 for security)
    // FadeEnd is VisualRadius * 2.0.
    // So we capture points well beyond the fade out.
    const threshold = rScene * effectiveVisualScale * 3.0;

    const bPosAU = getBodyPosition(bestCandidate.body, new Date(pointDate));
    // p.pos is Absolute Scene Coordinate (AU * 50). bPosAU is AU.
    // We need to compare in same space.
    // trajectory points are PRE-SCALED to Scene Units.
    const bPos = bPosAU.clone().multiplyScalar(AU_TO_SCENE);

    const d = p.pos.distanceTo(bPos);

    if (d < threshold) {
      // Inside Influence
      if (
        currentWindow &&
        currentWindow.body === bestCandidate.body &&
        pointDate - currentWindow.end < 30 * 24 * 3600 * 1000
      ) {
        // Extend window (allow 30 day gaps to bridge noisy data?)
        currentWindow.end = pointDate;
      } else {
        // New Window
        // Close old
        if (currentWindow) windows.push(currentWindow);

        currentWindow = {
          body: bestCandidate.body,
          start: pointDate,
          end: pointDate,
          bodyRadiusScene: rScene,
        };
      }
    } else {
      // Outside
      if (currentWindow) {
        windows.push(currentWindow);
        currentWindow = null;
      }
    }
  }

  // Push last
  if (currentWindow) windows.push(currentWindow);

  // Merge overlapping or close windows?
  // Logic above handles basic extension.

  return windows;
}

// Updated Signature
export function getScaledMissionPositionWithWindows(
  pointPos: THREE.Vector3,
  pointDate: number,
  windows: InfluenceWindow[],
  correction: THREE.Vector3 = new THREE.Vector3()
): THREE.Vector3 {
  // 1. Check if inside any window
  // Optimization: Windows are sorted by time.
  // Use .find or just loop. N is small (1-10).
  const activeWindow = windows.find((w) => pointDate >= w.start && pointDate <= w.end);

  if (!activeWindow) return pointPos;

  // 2. Perform Correction for Active Body
  // We already know the body and radius!

  const bPosAU = getBodyPosition(activeWindow.body, new Date(pointDate));
  const bPos = bPosAU.clone().multiplyScalar(AU_TO_SCENE).sub(correction);
  const vec = new THREE.Vector3().subVectors(pointPos, bPos);
  const dist = vec.length();

  // 3. Scaling Logic (Same as before)
  const effectiveVisualScale = config.planetScale * REAL_PLANET_SCALE_FACTOR;
  const visualRadius = activeWindow.bodyRadiusScene * effectiveVisualScale;
  const realRadius = activeWindow.bodyRadiusScene;

  // Altitude Preservation
  const shift = visualRadius - realRadius;
  const fadeStart = visualRadius * 1.5;
  // Fade Length must be > Shift Amount to strictly ensure d(VisualDist)/d(RealDist) > 0.
  // Shift approx 1.0 VR. So FadeLength must be > 1.0 VR.
  // 1.5 to 4.0 gives Length 2.5. Safe slope.
  const fadeEnd = visualRadius * 4.0;

  let weight = 0;

  // DEBUG: Voyager 1 Jupiter
  /*
  if (activeWindow.body === 'Jupiter' && Math.random() < 0.01) {
       console.log(`[Scaling Debug] Dist: ${dist}, VisualR: ${visualRadius}, RealR: ${realRadius}, Shift: ${shift}, FadeStart: ${fadeStart}, FadeEnd: ${fadeEnd}`);
  }
  */

  if (dist < fadeStart) {
    weight = 1.0;
  } else if (dist > fadeEnd) {
    weight = 0.0;
  } else {
    const t = (dist - fadeStart) / (fadeEnd - fadeStart);
    weight = 1.0 - t;
    weight = weight * weight * (3 - 2 * weight);
  }

  // Debug for Jupiter (Voyager 1 approx)
  if (weight <= 0.001) return pointPos;

  const newDist = dist + shift * weight;
  return bPos.add(vec.normalize().multiplyScalar(newDist));
}

export type ScalingStatus = 'SCALED' | 'GAP' | 'NORMAL';

export function getScalingStatus(
  pointPos: THREE.Vector3,
  pointDate: number,
  windows: InfluenceWindow[],
  currentPlanetScale: number,
  correction: THREE.Vector3
): { status: ScalingStatus; visualRadius: number; bodyPos: THREE.Vector3 } {
    const activeWindow = windows.find((w) => pointDate >= w.start && pointDate <= w.end);
    
    if (!activeWindow) return { status: 'NORMAL', visualRadius: 0, bodyPos: new THREE.Vector3() };
    
    // Calculate Dist
    const bPosAU = getBodyPosition(activeWindow.body, new Date(pointDate));
    const bPos = bPosAU.clone().multiplyScalar(AU_TO_SCENE).sub(correction);
    const dist = pointPos.distanceTo(bPos);
    
    const effectiveVisualScale = currentPlanetScale * REAL_PLANET_SCALE_FACTOR;
    const visualRadius = activeWindow.bodyRadiusScene * effectiveVisualScale;
    
    // Limits
    // Extended Bridge: Bridge goes from 5.0x down to 1.1x.
    // Widened to consume more points for a smoother Bezier transition.
    const innerLimit = visualRadius * 1.1;
    const outerLimit = visualRadius * 5.0; // The Gap Boundary
    
    if (dist <= innerLimit) return { status: 'SCALED', visualRadius, bodyPos: bPos };
    if (dist <= outerLimit) return { status: 'GAP', visualRadius, bodyPos: bPos };
    return { status: 'NORMAL', visualRadius, bodyPos: bPos };
}
