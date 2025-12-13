import * as THREE from 'three';
import { AU_TO_SCENE, REAL_PLANET_SCALE_FACTOR, REAL_SUN_SCALE_FACTOR } from '../config';
import * as rawCorrections from '../data/mission-corrections.json';

const missionCorrections = (rawCorrections as any).default || rawCorrections;

export interface ExtraPoint extends CorrectionEntry {
  offsetT: number;
}

export interface CorrectionEntry {
  minScale: number;
  body: string;
  bPos: [number, number, number];
  extraPoints?: ExtraPoint[];
}

import { getBodyPosition } from './missionTrajectory';

// ... interface definitions ...

interface MissionCorrections {
  [pointIdx: string]: CorrectionEntry;
}

// Map missionId -> Set of bodies to check (derived from data or hardcoded for efficiency)
// For now, checking all major planets + Sun is safe but expensive.
// Better: Check commonly visited bodies.
const MISSION_BODIES: Record<string, string[]> = {
  voyager1: ['Sun', 'Earth', 'Jupiter', 'Saturn'],
  voyager2: ['Sun', 'Earth', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
  pioneer10: ['Sun', 'Earth', 'Jupiter'],
  pioneer11: ['Sun', 'Earth', 'Jupiter', 'Saturn'],
  galileo: ['Sun', 'Earth', 'Venus', 'Jupiter', 'Gaspra', 'Ida'],
  cassini: ['Sun', 'Earth', 'Venus', 'Jupiter', 'Saturn'],
  newHorizons: ['Sun', 'Earth', 'Jupiter', 'Pluto', 'Arrokoth'],
  parkerSolarProbe: ['Sun', 'Venus'],
  juno: ['Sun', 'Earth', 'Jupiter'],
  rosetta: ['Sun', 'Earth', 'Mars', '67P', 'Steins', 'Lutetia'],
  ulysses: ['Sun', 'Earth', 'Jupiter'],
};

// Body Radii (Duplicate from build script or move to shared config?)
// Moving to shared config would be best, but for now reproducing here to avoid large refactor.
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
  '67P': 2,
  Gaspra: 6,
  Ida: 15,
  Arrokoth: 15,
  Ulysses: 0,
};

/**
 * Dynamically calculates correction for any point in time.
 * Used for Probes (continuous time) and Waypoints (sparse).
 */
export function applyDynamicCorrection(
  missionId: string,
  originalHelioPos: THREE.Vector3, // Must be Heliocentric Scene Units
  date: Date | number,
  currentSunScale: number,
  currentPlanetScale: number
): THREE.Vector3 {
  const bodies = MISSION_BODIES[missionId] || ['Sun', 'Earth', 'Jupiter'];
  const dateObj = typeof date === 'number' ? new Date(date) : date;

  let bestCorrection: { minScale: number; body: string; bPos: THREE.Vector3 } | null = null;

  for (const body of bodies) {
    // 1. Get Body Position (Heliocentric Scene)
    // Note: getBodyPosition returns AU. Need to convert.
    const bPosAU = getBodyPosition(body, dateObj);
    if (!bPosAU) continue;

    const bPos = bPosAU.clone().multiplyScalar(AU_TO_SCENE);

    // 2. Calculate Distance
    const dist = originalHelioPos.distanceTo(bPos);

    // 3. Calculate Safe Radius & Min Scale
    const rKm = BODY_RADII_KM[body] || 2000;
    const rScene = (rKm / 149597870) * AU_TO_SCENE;
    const safeRadiusBase = rScene * 1.05;

    if (safeRadiusBase <= 0) continue;

    const minScale = dist / safeRadiusBase;

    let maxScale = body === 'Sun' ? 70.0 : 2500.0; // Hardcoded limits matching build script

    if (minScale < maxScale) {
      if (!bestCorrection || minScale < bestCorrection.minScale) {
        bestCorrection = { minScale, body, bPos };
      }
    }
  }

  if (bestCorrection) {
    // Reuse applyCorrection logic
    // Construct a pseudo-entry
    const entry: CorrectionEntry = {
      minScale: bestCorrection.minScale,
      body: bestCorrection.body,
      bPos: [bestCorrection.bPos.x, bestCorrection.bPos.y, bestCorrection.bPos.z],
    };
    return applyCorrection(originalHelioPos, entry, currentSunScale, currentPlanetScale);
  }

  return originalHelioPos;
}

/**
 * Helper to apply the "Push Out" correction logic.
 */
export function applyCorrection(
  originalPos: THREE.Vector3,
  correction: CorrectionEntry,
  currentSunScale: number,
  currentPlanetScale: number
): THREE.Vector3 {
  let activeScale = 1.0;
  if (correction.body === 'Sun') {
    activeScale = currentSunScale * REAL_SUN_SCALE_FACTOR;
  } else {
    activeScale = currentPlanetScale * REAL_PLANET_SCALE_FACTOR;
  }

  // If we haven't reached the scale where the body hits the point, do nothing.
  if (activeScale <= correction.minScale) return originalPos;

  // Calculate Correction
  const bPos = new THREE.Vector3(correction.bPos[0], correction.bPos[1], correction.bPos[2]);
  const vec = new THREE.Vector3().subVectors(originalPos, bPos);

  const scaleFactor = activeScale / correction.minScale;

  // Apply scaling to the vector
  vec.multiplyScalar(scaleFactor);

  return bPos.add(vec);
}

/**
 * Calculates corrected position for a point if scaling breach occurs.
 * Returns the original position if no correction is needed.
 */
export function getScaledPoint(
  missionId: string,
  pointIdx: number,
  originalPos: THREE.Vector3,
  currentSunScale: number,
  currentPlanetScale: number
): { pos: THREE.Vector3; entry?: CorrectionEntry } {
  const missionData = (missionCorrections as Record<string, MissionCorrections>)[missionId];
  if (!missionData) return { pos: originalPos };

  const entry = missionData[pointIdx.toString()];
  if (!entry) return { pos: originalPos };

  const correctedPos = applyCorrection(originalPos, entry, currentSunScale, currentPlanetScale);

  return { pos: correctedPos, entry };
}

// Re-export constants if needed by other modules, or remove if unused.
// Keeping exports minimal to avoid breakage if other files import them.
export type ScalingStatus = 'SCALED' | 'NORMAL';
