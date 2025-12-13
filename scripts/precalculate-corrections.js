import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as AstronomyLib from 'astronomy-engine';
const Astronomy = AstronomyLib.default || AstronomyLib;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORRECTED PATH matching process-trajectories.js output
const TRAJECTORY_DIR = path.join(__dirname, '../public/data/missions/binary');
const MISSIONS_FILE = path.join(__dirname, '../src/data/missions.ts');
const OUTPUT_FILE = path.join(__dirname, '../src/data/mission-corrections.json');

// Constants
const AU_TO_SCENE = 50;
const REAL_PLANET_SCALE_FACTOR = 500;
const REAL_SUN_SCALE_FACTOR = 20;

const MAX_PLANET_SCALE_REAL = 2500.0;
const MAX_SUN_SCALE_REAL = 70.0;

// Body Radii in km
const BODY_RADII_KM = {
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

function extractMissionInfo(content) {
  const missions = {};
  const missionBlockRegex = /{\s*id:\s*'([^']+)',[\s\S]*?waypoints:\s*\[([\s\S]*?)\]/g;
  let match;
  while ((match = missionBlockRegex.exec(content)) !== null) {
    const id = match[1];
    const waypointsBlock = match[2];
    const bodies = new Set(['Sun']);
    const bodyRegex = /(?:body|customBody):\s*'([^']+)'/g;
    let bodyMatch;
    while ((bodyMatch = bodyRegex.exec(waypointsBlock)) !== null) {
      bodies.add(bodyMatch[1]);
    }
    missions[id] = Array.from(bodies);
    console.log(`[DEBUG] Mission ${id} bodies:`, missions[id]);
  }
  return missions;
}

function getBodyPosition(bodyName, date) {
  if (bodyName === 'Sun') return { x: 0, y: 0, z: 0 };
  const body = Astronomy.Body[bodyName];
  if (!body) return null;
  const vec = Astronomy.HelioVector(body, date);
  return { x: vec.x, y: vec.z, z: -vec.y };
}

function shouldRun() {
  if (process.argv.includes('--force')) return true;
  if (!fs.existsSync(OUTPUT_FILE)) return true;
  return false;
}

function calculateCorrections(missionId, trajectory, bodies) {
  const corrections = {};
  let count = 0;

  for (let i = 0; i < trajectory.length; i += 4) {
    const pointIdx = i / 4;
    const date = trajectory[i];
    const pos = { x: trajectory[i + 1], y: trajectory[i + 2], z: trajectory[i + 3] };
    const dateObj = new Date(date);

    for (const body of bodies) {
      const rKm = BODY_RADII_KM[body] || 2000;
      const rScene = (rKm / 149597870) * AU_TO_SCENE;
      const safeRadiusBase = rScene * 1.05;

      let maxScale = body === 'Sun' ? MAX_SUN_SCALE_REAL : MAX_PLANET_SCALE_REAL;

      const bPos = getBodyPosition(body, dateObj);
      if (!bPos) continue;

      const bPosScene = {
        x: bPos.x * AU_TO_SCENE,
        y: bPos.y * AU_TO_SCENE,
        z: bPos.z * AU_TO_SCENE,
      };

      const posScene = {
        x: pos.x * AU_TO_SCENE,
        y: pos.y * AU_TO_SCENE,
        z: pos.z * AU_TO_SCENE,
      };

      const dx = posScene.x - bPosScene.x;
      const dy = posScene.y - bPosScene.y;
      const dz = posScene.z - bPosScene.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (i === 0 && missionId === 'voyager1') {
        console.log(`[DEBUG] V1 Start: pos=`, pos, ` posScene=`, posScene, ` dist=`, dist);
      }

      const minScale = dist / safeRadiusBase;

      // Log Jupiter encounter
      if (body === 'Jupiter' && dist < 1.0 && Math.random() < 0.05) {
        console.log(
          `[DEBUG] Jupiter Enc: dist=${dist.toFixed(4)}, minScale=${minScale.toFixed(4)}`
        );
      }

      if (minScale < maxScale) {
        if (!corrections[pointIdx] || minScale < corrections[pointIdx].minScale) {
          corrections[pointIdx] = {
            minScale: parseFloat(minScale.toFixed(4)),
            body: body,
            bPos: [
              parseFloat(bPosScene.x.toFixed(5)),
              parseFloat(bPosScene.y.toFixed(5)),
              parseFloat(bPosScene.z.toFixed(5)),
            ],
          };
        }
      }
    }
  }

  // --- DENSIFICATION PASS ---
  // Iterate segments to add intermediate points if either endpoint is corrected
  const SEGMENT_STEPS = 15;
  const totalPoints = trajectory.length / 4;

  for (let i = 0; i < totalPoints - 1; i++) {
    // If this point OR next point has a correction, densify the segment
    if (corrections[i] || corrections[i + 1]) {
      const p1 = {
        x: trajectory[i * 4 + 1],
        y: trajectory[i * 4 + 2],
        z: trajectory[i * 4 + 3],
        date: trajectory[i * 4],
      };
      const p2 = {
        x: trajectory[(i + 1) * 4 + 1],
        y: trajectory[(i + 1) * 4 + 2],
        z: trajectory[(i + 1) * 4 + 3],
        date: trajectory[(i + 1) * 4],
      };

      const extraPoints = [];

      for (let step = 1; step < SEGMENT_STEPS; step++) {
        const t = step / SEGMENT_STEPS;

        // Linear Interpolation (Heliocentric AU)
        const intPos = {
          x: p1.x + (p2.x - p1.x) * t,
          y: p1.y + (p2.y - p1.y) * t,
          z: p1.z + (p2.z - p1.z) * t,
        };
        const intDate = p1.date + (p2.date - p1.date) * t;
        const intDateObj = new Date(intDate);

        // Calculate Correction for interpolated point
        // We reuse the logic: check all bodies, find minScale
        let bestCorrection = null;

        // Convert to Scene for distance checks
        const intPosScene = {
          x: intPos.x * AU_TO_SCENE,
          y: intPos.y * AU_TO_SCENE,
          z: intPos.z * AU_TO_SCENE,
        };

        for (const body of bodies) {
          const rKm = BODY_RADII_KM[body] || 2000;
          const rScene = (rKm / 149597870) * AU_TO_SCENE;
          const safeRadiusBase = rScene * 1.05;
          let maxScale = body === 'Sun' ? MAX_SUN_SCALE_REAL : MAX_PLANET_SCALE_REAL;

          const bPos = getBodyPosition(body, intDateObj);
          if (!bPos) continue;

          const bPosScene = {
            x: bPos.x * AU_TO_SCENE,
            y: bPos.y * AU_TO_SCENE,
            z: bPos.z * AU_TO_SCENE,
          };

          const dx = intPosScene.x - bPosScene.x;
          const dy = intPosScene.y - bPosScene.y;
          const dz = intPosScene.z - bPosScene.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const minScale = dist / safeRadiusBase;

          if (minScale < maxScale) {
            if (!bestCorrection || minScale < bestCorrection.minScale) {
              bestCorrection = {
                minScale: parseFloat(minScale.toFixed(4)),
                body: body,
                bPos: [
                  parseFloat(bPosScene.x.toFixed(5)),
                  parseFloat(bPosScene.y.toFixed(5)),
                  parseFloat(bPosScene.z.toFixed(5)),
                ],
              };
            }
          }
        }

        // Add to extra points (even if no correction?
        // User asked: "make sure that these points also have the updated correct body position..."
        // If no correction is needed (minScale > max), we technically don't need to store it
        // BUT for smoothness we probably want to draw the line anyway.
        // However, the runtime will interpolate linearly if we don't provide points.
        // So we only need to provide points if they *might* be corrected.
        // BUT if p1 is corrected and p2 is safe, the mid-points transition from corrected to safe.
        // If we don't provide them, the transition is linear in "corrected space"? No.
        // The runtime draws line p1 -> p2.
        // If p1 projected, p2 normal. Line is P1_proj -> P2.
        // If we want curve, we need P_mid_proj.
        // So we SHOULD include the point if it has a correction.
        // What if it is safe? Then we just store a "safe" point?
        // Or store it with minScale = high?
        // Let's store it if it has a correction.

        if (bestCorrection) {
          extraPoints.push({
            offsetT: parseFloat(t.toFixed(3)),
            ...bestCorrection,
          });
        }
      }

      if (extraPoints.length > 0) {
        if (!corrections[i]) {
          // Create placeholder entry if start point was safe
          corrections[i] = { minScale: 99999, body: 'None', bPos: [0, 0, 0] };
        }
        corrections[i].extraPoints = extraPoints;
      }
    }
  }

  count = Object.keys(corrections).length;
  return { corrections, count };
}

async function main() {
  console.log('[BUILD] Pre-calculating corrections (Fixed Import)...');

  if (!shouldRun()) {
    console.log('[BUILD] Skipped.');
    return;
  }

  const missions = extractMissionInfo(fs.readFileSync(MISSIONS_FILE, 'utf8'));
  const outputData = {};

  for (const [id, bodies] of Object.entries(missions)) {
    console.log(`Processing ${id}...`);
    const binPath = path.join(TRAJECTORY_DIR, `${id}.bin`); // Corrected Path

    if (!fs.existsSync(binPath)) {
      console.warn(`[WARN] No binary file found at ${binPath}`);
      continue;
    }

    const buffer = fs.readFileSync(binPath);
    const trajectory = new Float64Array(buffer.buffer);
    const { corrections, count } = calculateCorrections(id, trajectory, bodies);

    if (count > 0) {
      outputData[id] = corrections;
      console.log(`  -> Found ${count} corrections.`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
  console.log(`[BUILD] Saved to ${OUTPUT_FILE}`);
}

main().catch(console.error);
