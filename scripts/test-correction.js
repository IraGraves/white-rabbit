import { getInfluenceWindows } from '../src/features/missionScaling';
import {
  config,
  REAL_PLANET_SCALE_FACTOR,
  REAL_SUN_SCALE_FACTOR,
  AU_TO_SCENE,
} from '../src/config';
import * as THREE from 'three';

// Mock Config
config.planetScale = 1.0; // 500x
config.sunScale = 1.0; // 20x

// Mock getBodyPosition
function getBodyPosition(body, date) {
  if (body === 'Jupiter') return new THREE.Vector3(5.2, 0, 0); // approx distance in AU
  return new THREE.Vector3(0, 0, 0);
}

// INLINED Logic from missionScaling.ts to test alignment
function getScaledMissionPositionWithWindows_TEST(pointPos, pointDate, windows, correction) {
  const activeWindow = windows.find((w) => pointDate >= w.start && pointDate <= w.end);

  if (!activeWindow) return pointPos;

  // 2. Perform Correction for Active Body
  const bPosAU = getBodyPosition(activeWindow.body, new Date(pointDate));
  const bPos = bPosAU.clone().multiplyScalar(AU_TO_SCENE).sub(correction);
  const vec = new THREE.Vector3().subVectors(pointPos, bPos);
  const dist = vec.length();

  let effectiveVisualScale = 1.0;
  if (activeWindow.body === 'Sun') {
    effectiveVisualScale = config.sunScale * REAL_SUN_SCALE_FACTOR;
  } else {
    effectiveVisualScale = config.planetScale * REAL_PLANET_SCALE_FACTOR;
  }

  const visualRadius = activeWindow.bodyRadiusScene * effectiveVisualScale;

  // Altitude Preservation
  const shift = visualRadius - activeWindow.bodyRadiusScene; // realRadius matches stored radius
  const fadeStart = visualRadius * 1.5;
  const fadeEnd = visualRadius * 4.0;

  console.log(
    `[LOGIC] Body: ${activeWindow.body}, Scale: ${effectiveVisualScale}, Radius: ${activeWindow.bodyRadiusScene}`
  );
  console.log(`[LOGIC] VisualRadius: ${visualRadius}, Dist: ${dist}`);
  console.log(`[LOGIC] FadeStart: ${fadeStart}, FadeEnd: ${fadeEnd}`);

  let weight = 0;

  if (dist < fadeStart) {
    weight = 1.0;
  } else if (dist > fadeEnd) {
    weight = 0.0;
  } else {
    const t = (dist - fadeStart) / (fadeEnd - fadeStart);
    weight = 1.0 - t;
    weight = weight * weight * (3 - 2 * weight);
  }

  console.log(`[LOGIC] Weight: ${weight}, Shift: ${shift}`);

  if (weight <= 0.001) return pointPos;

  const newDist = dist + shift * weight;
  return bPos.add(vec.normalize().multiplyScalar(newDist));
}

// --- RUN TEST ---
const missionId = 'voyager1';
const windows = getInfluenceWindows(missionId, config.planetScale);
const flybyTime = 1559869200000;

console.log(`[TEST] Windows: ${windows.length}`);
const active = windows.find((w) => flybyTime >= w.start && flybyTime <= w.end);

if (active) {
  // Setup Scenario: Point close to Jupiter
  const jupPos = new THREE.Vector3(5.2 * 50, 0, 0); // 260
  const offset = new THREE.Vector3(0.15, 0, 0);
  const pointPos = jupPos.clone().add(offset); // 260.15

  const scaledPos = getScaledMissionPositionWithWindows_TEST(
    pointPos,
    flybyTime,
    windows,
    new THREE.Vector3()
  );

  const newOffset = new THREE.Vector3().subVectors(scaledPos, jupPos);
  console.log(`[TEST] Result Dist: ${newOffset.length().toFixed(3)}`);
} else {
  console.error('No active window found!');
}
