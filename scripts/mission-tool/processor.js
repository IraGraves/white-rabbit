import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../../public/data/missions/binary');
const INFO_DIR = path.join(__dirname, '../../public/data/missions/info');

// Ensure output dirs exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(INFO_DIR)) {
  fs.mkdirSync(INFO_DIR, { recursive: true });
}

// --- Math Helpers ---

function jdToMs(jd) {
  return (jd - 2440587.5) * 86400 * 1000;
}

class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  static sub(a, b) {
    return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
  }
  static add(a, b) {
    return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
  }
  static mul(a, s) {
    return new Vec3(a.x * s, a.y * s, a.z * s);
  } // scalar
  len() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  angleTo(v) {
    const d = this.dot(v);
    const l = this.len() * v.len();
    if (l === 0) return 0;
    return Math.acos(Math.max(-1, Math.min(1, d / l)));
  }
}

// --- Interpolation ---

/**
 * Returns the position at normalized time t (0..1) using Cubic Hermite Spline
 * @param {Vec3} p0 Start Position
 * @param {Vec3} v0 Start Velocity
 * @param {Vec3} p1 End Position
 * @param {Vec3} v1 End Velocity
 * @param {number} t Normalized Time (0..1)
 * @param {number} T Total Duration (in same units as Velocity, e.g. Days)
 */
function hermite(t, p0, v0, p1, v1, T) {
  const t2 = t * t;
  const t3 = t * t * t;

  // Basis functions
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  // P(t) = h00*P0 + h10*(V0*T) + h01*P1 + h11*(V1*T)
  const term1 = Vec3.mul(p0, h00);
  const term2 = Vec3.mul(v0, T * h10);
  const term3 = Vec3.mul(p1, h01);
  const term4 = Vec3.mul(v1, T * h11);

  return Vec3.add(Vec3.add(term1, term2), Vec3.add(term3, term4));
}

// --- Data Fetching ---

function parseHorizonsCSV(content) {
  const lines = content.split('\n');
  const points = [];
  let reading = false;

  for (const line of lines) {
    if (line.trim() === '$$SOE') {
      reading = true;
      continue;
    }
    if (line.trim() === '$$EOE') {
      break;
    }
    if (!reading) continue;

    const parts = line.split(',');
    if (parts.length < 8) continue;

    const jd = parseFloat(parts[0]);
    const x = parseFloat(parts[2]);
    const y = parseFloat(parts[3]);
    const z = parseFloat(parts[4]);
    const vx = parseFloat(parts[5]);
    const vy = parseFloat(parts[6]);
    const vz = parseFloat(parts[7]);

    if (!Number.isNaN(jd) && !Number.isNaN(x)) {
      points.push({ jd, x, y, z, vx, vy, vz });
    }
  }
  return points;
}

async function fetchHorizonsCSV(id, center, start, end, step, onProgress = () => {}) {
  const baseUrl = 'https://ssd.jpl.nasa.gov/api/horizons.api';

  // Ensure dates are in Horizons format (YYYY-MM-DD HH:MM)
  const safeStart = start.replace('T', ' ');
  const safeEnd = end.replace('T', ' ');

  // --- Batching Logic ---
  // Approximate point count check to avoid 90k line limit

  let t1, t2;
  if (start.startsWith('JD')) {
    // Parse Julian Date
    const jd = parseFloat(start.substring(2));
    t1 = (jd - 2440587.5) * 86400000;
  } else {
    t1 = new Date(start).getTime();
  }

  if (end.startsWith('JD')) {
    const jd = parseFloat(end.substring(2));
    t2 = (jd - 2440587.5) * 86400000;
  } else {
    t2 = new Date(end).getTime();
  }

  const durationMs = t2 - t1;

  // Parse step size (e.g. "1 d", "10 m", "1 h")
  let stepMs = 86400000; // Default 1 day
  const match = step.match(/(\d+)\s*([a-z]+)/i);
  if (match) {
    const val = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (unit.startsWith('d')) stepMs = val * 86400000;
    else if (unit.startsWith('h')) stepMs = val * 3600000;
    else if (unit.startsWith('m')) stepMs = val * 60000;
    else if (unit.startsWith('s')) stepMs = val * 1000;
  }

  if (durationMs > 0) {
    const estimatedPoints = durationMs / stepMs;
    const CHUNK_LIMIT = 50000; // Safe limit below 90k

    if (estimatedPoints > CHUNK_LIMIT) {
      console.log(
        `Request too large (~${Math.floor(estimatedPoints)} points). Splitting into chunks...`
      );
      const chunks = [];

      let currentT = t1;
      while (currentT < t2) {
        let chunkEndT = currentT + CHUNK_LIMIT * stepMs;
        if (chunkEndT > t2) chunkEndT = t2;

        const sDate = new Date(currentT).toISOString().slice(0, 19);
        const eDate = new Date(chunkEndT).toISOString().slice(0, 19);

        const chunkMsg = `  Fetching chunk: ${sDate} -> ${eDate}`;
        console.log(chunkMsg);
        onProgress(chunkMsg); // Use the callback

        // Recursive call
        try {
          const chunkPoints = await fetchHorizonsCSV(id, center, sDate, eDate, step);

          // Avoid duplicate point at seam
          if (chunks.length > 0 && chunkPoints.length > 0) {
            // If times are very close, skip first point of new chunk
            const lastP = chunks[chunks.length - 1];
            const firstP = chunkPoints[0];
            if (Math.abs(firstP.jd - lastP.jd) < 1e-6) {
              chunkPoints.shift();
            }
          }
          // Safe push loop to avoid stack overflow
          for (const p of chunkPoints) chunks.push(p);
        } catch (e) {
          console.error(`  Chunk failed: ${e.message}`);
          throw e;
        }
        currentT = chunkEndT;
      }
      return chunks;
    }
  }
  // --- End Batching Logic ---

  const params = new URLSearchParams({
    format: 'text',
    COMMAND: `'${id}'`,
    OBJ_DATA: 'NO',
    MAKE_EPHEM: 'YES',
    EPHEM_TYPE: 'VECTORS',
    CENTER: `'${center}'`, // Defaults to 500@10 now
    START_TIME: `'${safeStart}'`,
    STOP_TIME: `'${safeEnd}'`,
    STEP_SIZE: `'${step}'`,
    VEC_TABLE: '2',
    REF_SYSTEM: 'ICRF',
    REF_PLANE: 'FRAME',
    CSV_FORMAT: 'YES',
    OUT_UNITS: 'AU-D',
  });

  console.log(`Fetching ${id} [${step}]...`);
  const response = await fetch(`${baseUrl}?${params.toString()}`);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Horizons connect error: ${response.status} - ${errText}`);
  }
  const text = await response.text();
  return parseHorizonsCSV(text);
}

// --- Metadata Fetching ---
async function fetchMissionMetadata(id) {
  const startRaw = await probeHorizons(id, '1000-01-01', '1000-01-02');
  const endRaw = await probeHorizons(id, '3000-01-01', '3000-01-02');

  let start = '';
  let end = '';

  // Look for: "prior to A.D. 1977-SEP-05 13:59:24.3830"
  // Regex matches "A.D. <date> <time>"
  const startRegex1 =
    /prior\s+to\s+A\.D\.\s*(\d{4}-[A-Za-z]{3}-\d{2}(?:\s+\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?)?)/i;
  const rangeRegex =
    /between\s+A\.D\.\s*(\d{4}-[A-Za-z]{3}-\d{2}.*?)\s+and\s+A\.D\.\s*(\d{4}-[A-Za-z]{3}-\d{2}.*?)\s+/i;

  const startMatch1 = startRaw.match(startRegex1);
  const rangeMatch = startRaw.match(rangeRegex);

  if (rangeMatch) {
    start = formatDateForInput(rangeMatch[1], true); // Round UP for Start
    end = formatDateForInput(rangeMatch[2], false); // Round DOWN for End
  } else if (startMatch1) {
    start = formatDateForInput(startMatch1[1], true); // Round UP for Start
  }

  // Look for: "after A.D. 2025-JAN-01 12:00:00"
  const endRegex1 =
    /after\s+A\.D\.\s*(\d{4}-[A-Za-z]{3}-\d{2}(?:\s+\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?)?)/i;
  const endMatch1 = endRaw.match(endRegex1);

  if (endMatch1) {
    end = formatDateForInput(endMatch1[1], false); // Round DOWN for End
  } else if (!end && rangeMatch) {
    // already set
  }

  // Extract Name: "Target body name: Voyager 1 (Spacecraft) (-31)"
  console.log('DEBUG HEADER:', startRaw.slice(0, 100)); // Debug log
  // Extract Name
  // Standard Header: "Target body name: Voyager 1 (Spacecraft) (-31)"
  // Error Message: "No ephemeris for target "Voyager 1 (spacecraft)""

  let name = '';
  const nameRegex1 = /Target body name:\s*([^(]+?)(?:\s*\(|$)/i;
  const nameRegex2 = /No ephemeris for target\s+"(.*?)"/i;

  const m1 = startRaw.match(nameRegex1);
  const m2 = startRaw.match(nameRegex2);

  if (m1) {
    name = m1[1].trim();
  } else if (m2) {
    // m2[1] might be "Voyager 1 (spacecraft)"
    // We want just "Voyager 1"
    name = m2[1].replace(/\s*\(.*?\)/, '').trim();
  }

  console.log(`[Metadata] Detected Name: ${name}, Start: ${start}, End: ${end}`);
  return { start, end, name, raw: `${startRaw.slice(0, 200)} ... ${endRaw.slice(0, 200)}` };
}

async function probeHorizons(id, t1, t2) {
  const baseUrl = 'https://ssd.jpl.nasa.gov/api/horizons.api';
  const params = new URLSearchParams({
    format: 'text',
    COMMAND: `'${id}'`,
    OBJ_DATA: 'NO',
    MAKE_EPHEM: 'YES',
    EPHEM_TYPE: 'VECTORS',
    CENTER: `'500@10'`,
    START_TIME: `'${t1}'`,
    STOP_TIME: `'${t2}'`,
    STEP_SIZE: `'1 d'`,
  });
  const res = await fetch(`${baseUrl}?${params.toString()}`);
  if (!res.ok) throw new Error('Horizons probe failed');
  return await res.text();
}

function formatDateForInput(horizonsDateStr, roundUp = false) {
  // Input might be: "1977-Sep-05 13:59:24.3830" or just "1977-Sep-05"
  if (!horizonsDateStr) return '';
  const clean = horizonsDateStr.replace(/TDB/i, '').trim();

  // Append 'UTC' to attempt consistent parsing
  const d = new Date(clean + (clean.endsWith('Z') ? '' : ' UTC'));

  if (Number.isNaN(d.getTime())) {
    // Fallback: try without appending UTC
    const d2 = new Date(clean);
    if (Number.isNaN(d2.getTime())) return '';
    // Use d2 if d failed
    d.setTime(d2.getTime());
  }

  // Round seconds to ensure TDB/UTC parsing doesn't exceed bounds
  if (d.getMilliseconds() > 0) {
    if (roundUp) {
      // Start Date: Round UP to be safely INSIDE the range (Start + epsilon)
      d.setSeconds(d.getSeconds() + 1);
      d.setMilliseconds(0);
    } else {
      // End Date: Round DOWN to be safely INSIDE the range (End - epsilon)
      d.setMilliseconds(0);
    }
  }

  // Return format compatible with datetime-local: YYYY-MM-DDTHH:mm:ss
  return d.toISOString().slice(0, 19);
}

// --- Processing Logic ---

/**
 * Filter points that can be accurately reconstructed using Hermite interpolation
 */
function filterPoints(points, tolerance = 1e-5) {
  if (points.length < 3) return points;

  const kept = [points[0]];
  let lastIdx = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const pStart = points[lastIdx];
    const pEnd = points[i + 1]; // Try to skip 'i'
    const pTest = points[i]; // Test if 'i' is redundant

    const T = pEnd.jd - pStart.jd;
    const t = (pTest.jd - pStart.jd) / T;

    const vStart = new Vec3(pStart.x, pStart.y, pStart.z);
    const velStart = new Vec3(pStart.vx, pStart.vy, pStart.vz);
    const vEnd = new Vec3(pEnd.x, pEnd.y, pEnd.z);
    const velEnd = new Vec3(pEnd.vx, pEnd.vy, pEnd.vz);
    const vTest = new Vec3(pTest.x, pTest.y, pTest.z);

    const interpolated = hermite(t, vStart, velStart, vEnd, velEnd, T);
    const error = Vec3.sub(vTest, interpolated).len();

    if (error > tolerance) {
      // Cannot skip 'i', it's needed
      kept.push(points[i]);
      lastIdx = i;
    }
  }

  kept.push(points[points.length - 1]);
  return kept;
}

// --- Main Process ---

async function generateTrajectory({
  missionId,
  horizonId,
  centerId,
  startDate,
  endDate,
  stepSizeCoarse,
  stepSizeFine,
  refinementAngle = ANGLE_THRESHOLD_DEFAULT,
  refinementTol = REFINE_TOL_DEFAULT_KM,
  compressionTolerance = COMPRESSION_TOL_DEFAULT_KM,
  onProgress = () => {},
}) {
  console.log(`Generating ${missionId} (${startDate} -> ${endDate})`);
  onProgress(`Starting generation for ${missionId}...`);

  // 0. Fetch and Save General Info
  onProgress('Fetching mission metadata...');
  await fetchAndSaveMissionInfo(missionId, horizonId, centerId, startDate);

  // 1. Coarse Pass
  onProgress(`Fetching coarse data (step: ${stepSizeCoarse})...`);
  const points = await fetchHorizonsCSV(
    horizonId,
    centerId,
    startDate,
    endDate,
    stepSizeCoarse,
    onProgress
  );

  console.log(`Coarse pass: ${points.length} points.`);
  onProgress(`Coarse pass complete: ${points.length} points.`);

  if (points.length === 0) {
    console.error(
      `Debug: Failed Request -> ID: ${horizonId}, Start: ${startDate}, End: ${endDate}`
    );
    throw new Error('No coarse points fetched. Check dates.');
  }

  const missionStartJD = points[0].jd;
  const missionEndJD = points[points.length - 1].jd;

  // 2. Identify Complex Regions (Double Test)
  // Test A: Angular Divergence
  // Test B: Skip-Neighbor Interpolation Error
  onProgress('Analyzing trajectory for refinement...');

  const complexRanges = [];

  const angleDeg = parseFloat(refinementAngle) || 15;
  const ANGLE_THRESHOLD = angleDeg * (Math.PI / 180);

  const refineTolKm = parseFloat(refinementTol) || 50;
  const REFINE_TOL_AU = refineTolKm / 149597870.7; // Convert km to AU

  const compTolKm = parseFloat(compressionTolerance) || 50;
  const outTol = compTolKm / 149597870.7; // Convert km to AU

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    let needsRefinement = false;

    // --- TEST 1: Angular Divergence ---
    const v1 = new Vec3(p1.vx, p1.vy, p1.vz);
    const v2 = new Vec3(p2.vx, p2.vy, p2.vz);
    const angle = v1.angleTo(v2);

    if (angle > ANGLE_THRESHOLD) {
      needsRefinement = true;
    }

    // --- TEST 2: Skip-Neighbor Hermite Error ---
    if (!needsRefinement && i < points.length - 2) {
      const p3 = points[i + 2];

      const duration = p3.jd - p1.jd; // Days
      const tNorm = (p2.jd - p1.jd) / duration;

      const v1Vec = new Vec3(p1.vx, p1.vy, p1.vz);
      const startPos = new Vec3(p1.x, p1.y, p1.z);

      const v3Vec = new Vec3(p3.vx, p3.vy, p3.vz);
      const endPos = new Vec3(p3.x, p3.y, p3.z);

      const predictedP2 = hermite(tNorm, startPos, v1Vec, endPos, v3Vec, duration);
      const actualP2 = new Vec3(p2.x, p2.y, p2.z);
      const diff = Vec3.sub(predictedP2, actualP2);
      const distAU = diff.len();

      if (distAU > REFINE_TOL_AU) {
        needsRefinement = true;
      }
    }

    if (needsRefinement) {
      // Extend window by 1 day on each side, but CLAMP to mission bounds
      const rStart = Math.max(p1.jd - 1.0, missionStartJD);
      const rEnd = Math.min(p2.jd + 1.0, missionEndJD);
      complexRanges.push({ start: rStart, end: rEnd });
    }
  }

  console.log(`Identified ${complexRanges.length} segments needing refinement.`);

  // 3. Fine Pass
  // Fetch higher res data for complex ranges (e.g. 10 mins)
  // We combine contiguous ranges to avoid spamming API

  // Sort ranges by start time
  complexRanges.sort((a, b) => a.start - b.start);

  const mergedRanges = [];
  if (complexRanges.length > 0) {
    let current = complexRanges[0];
    for (let i = 1; i < complexRanges.length; i++) {
      const next = complexRanges[i];
      if (next.start <= current.end) {
        // Overlapping or contiguous, merge
        current.end = Math.max(current.end, next.end);
      } else {
        // Not overlapping, push current and start new
        mergedRanges.push(current);
        current = next;
      }
    }
    mergedRanges.push(current);
  }

  console.log(`Merged ${complexRanges.length} segments into ${mergedRanges.length} requests.`);
  onProgress(
    `Refining ${complexRanges.length} segments (merged into ${mergedRanges.length} requests)...`
  );

  // Limit requests to avoid timeouts/bans
  const newPoints = [];

  // Copy all points first, we will sort and dedupe later
  newPoints.push(...points);

  let completedRequests = 0;
  for (const range of mergedRanges) {
    // Convert JD back to 'YYYY-MM-DD HH:MM' for horizons?
    // Horizons accepts 'JDxxxxx' format for time!
    const startJD = `JD${range.start.toFixed(6)}`;
    const endJD = `JD${range.end.toFixed(6)}`;

    completedRequests++;
    const msg = `Fetching refinement ${completedRequests}/${mergedRanges.length} (${range.start.toFixed(2)} -> ${range.end.toFixed(2)})...`;
    console.log(msg);
    onProgress(msg);
    console.log(`Fetching refinement range: ${startJD} -> ${endJD}`);

    try {
      // Use user-defined fine step (default '10 m')
      const fineData = await fetchHorizonsCSV(
        horizonId,
        centerId,
        startJD,
        endJD,
        stepSizeFine || '10 m',
        () => {} // Don't spam progress for inner chunks of fine requests
      );
      console.log(`  Fetched refinement: ${fineData.length} points`);
      for (const p of fineData) newPoints.push(p);

      // Artificial delay to be nice to API
      await new Promise((r) => setTimeout(r, 200));
    } catch (e) {
      console.warn(`Failed to refine range ${range.start}-${range.end}: ${e.message}`);
    }
  }

  onProgress('Refinement complete. Sorting and Compressing...');

  // 4. Sort and Deduplicate
  newPoints.sort((a, b) => a.jd - b.jd);

  const uniquePoints = [];
  if (newPoints.length > 0) {
    uniquePoints.push(newPoints[0]);
    for (let i = 1; i < newPoints.length; i++) {
      const last = uniquePoints[uniquePoints.length - 1];
      const curr = newPoints[i];
      if (Math.abs(curr.jd - last.jd) > 1e-6) {
        uniquePoints.push(curr);
      }
    }
  }

  console.log(`Total Unique Points: ${uniquePoints.length}`);

  // 5. Segment-Based Filtering & Reporting
  // We want to report stats for "Coarse" and "Refined" segments separately.
  // mergedRanges contains the "Fine" windows.
  // We need to fill the gaps with "Coarse" windows.

  const fullStats = [];

  // Helper to process a batch of points
  const processBatch = (batch, type, label) => {
    if (batch.length === 0) return;
    const filtered = filterPoints(batch, outTol);
    fullStats.push({
      type,
      label,
      downloaded: batch.length,
      kept: filtered.length,
      start: new Date(jdToMs(batch[0].jd)).toISOString(),
      end: new Date(jdToMs(batch[batch.length - 1].jd)).toISOString(),
    });
    return filtered;
  };

  const finalPoints = [];

  // Sort ranges just in case
  mergedRanges.sort((a, b) => a.start - b.start);

  // We need to bin points into these ranges.
  // Since points are sorted, we can iterate through them.

  let rangeIdx = 0;
  let currentBatch = [];
  let inFineRange = false;

  // For labeling
  let coarseCount = 0;
  let fineCount = 0;

  for (let i = 0; i < uniquePoints.length; i++) {
    const p = uniquePoints[i];

    // Check if we are entering or leaving a fine range
    // Find relevant range (if any)
    // Note: ranges might overlap if we messed up merging, but we didn't.

    let targetRange = null;
    if (rangeIdx < mergedRanges.length) {
      if (p.jd >= mergedRanges[rangeIdx].start && p.jd <= mergedRanges[rangeIdx].end) {
        targetRange = mergedRanges[rangeIdx];
      } else if (p.jd > mergedRanges[rangeIdx].end) {
        // We passed the current range
        // This relies on points being sorted and ranges being sorted
        rangeIdx++;
        if (
          rangeIdx < mergedRanges.length &&
          p.jd >= mergedRanges[rangeIdx].start &&
          p.jd <= mergedRanges[rangeIdx].end
        ) {
          targetRange = mergedRanges[rangeIdx];
        }
      }
    }

    if (targetRange) {
      // We are in a FINE range
      if (!inFineRange) {
        // Transition from Coarse -> Fine
        // Flush coarse batch
        if (currentBatch.length > 0) {
          coarseCount++;
          const res = processBatch(currentBatch, 'coarse', `Segment ${coarseCount} (Coarse)`);
          finalPoints.push(...res);
          currentBatch = [];
        }
        inFineRange = true;
      }
      currentBatch.push(p);
    } else {
      // We are in a COARSE range
      if (inFineRange) {
        // Transition from Fine -> Coarse
        // Flush fine batch
        if (currentBatch.length > 0) {
          fineCount++; // Corresponds to mergedRanges[rangeIdx when it was active]... strictly it's the one we just left
          // We effectively just left mergedRanges[rangeIdx] or rangeIdx-1?
          // If we are here, p.jd > range.end. So we incremented rangeIdx above?
          // Let's us just label generically.
          // Actually, to get perfectly synced labels, we'd iterate segments.
          const res = processBatch(currentBatch, 'fine', `Window ${fineCount} (Fine)`);
          finalPoints.push(...res);
          currentBatch = [];
        }
        inFineRange = false;
      }
      currentBatch.push(p);
    }
  }

  // Flush remaining
  if (currentBatch.length > 0) {
    if (inFineRange) {
      fineCount++;
      const res = processBatch(currentBatch, 'fine', `Window ${fineCount} (Fine)`);
      finalPoints.push(...res);
    } else {
      coarseCount++;
      const res = processBatch(currentBatch, 'coarse', `Segment ${coarseCount} (Coarse)`);
      finalPoints.push(...res);
    }
  }

  console.log(
    `Filtered to ${finalPoints.length} points (${Math.round((1 - finalPoints.length / uniquePoints.length) * 100)}% compression)`
  );

  // 6. Write Binary
  const stride = 7;
  const buffer = new Float64Array(finalPoints.length * stride);

  for (let i = 0; i < finalPoints.length; i++) {
    const p = finalPoints[i];
    // Write Raw Julian Date (Days)
    buffer[i * stride + 0] = p.jd;

    // Transform Coordinates to Scene (Y-up, Z-depth)
    // Horizons Z -> Scene Y
    // Horizons X -> Scene X
    // Horizons Y -> Scene -Z
    buffer[i * stride + 1] = p.x;
    buffer[i * stride + 2] = p.z;
    buffer[i * stride + 3] = -p.y;

    buffer[i * stride + 4] = p.vx;
    buffer[i * stride + 5] = p.vz;
    buffer[i * stride + 6] = -p.vy;
  }

  const outPath = path.join(OUTPUT_DIR, `${missionId}.bin`);
  fs.writeFileSync(outPath, buffer);
  console.log(`Saved ${outPath}`);

  return {
    count: finalPoints.length,
    path: outPath,
    originalCount: uniquePoints.length,
    segmentStats: fullStats,
    segmentsRefined: mergedRanges.length,
  };
}

// --- Info Fetching ---
async function fetchAndSaveMissionInfo(missionId, horizonId, centerId, startDate) {
  const baseUrl = 'https://ssd.jpl.nasa.gov/api/horizons.api';

  // Create a 1-day range for info
  // We use the start date to ensure the body exists
  const t1 = new Date(startDate);
  const t2 = new Date(t1.getTime() + 24 * 60 * 60 * 1000); // +1 day
  const sDate = t1.toISOString().split('T')[0];
  const eDate = t2.toISOString().split('T')[0];

  const params = new URLSearchParams({
    format: 'text',
    COMMAND: `'${horizonId}'`,
    OBJ_DATA: 'YES', // Key: Request Object Data
    MAKE_EPHEM: 'YES', // Often needed to get the full header output
    EPHEM_TYPE: 'VECTORS',
    CENTER: `'${centerId}'`,
    START_TIME: `'${sDate}'`,
    STOP_TIME: `'${eDate}'`,
    STEP_SIZE: `'1 d'`,
    VEC_TABLE: '2',
    REF_SYSTEM: 'ICRF',
    REF_PLANE: 'FRAME',
    CSV_FORMAT: 'NO', // We probably want the text header, not CSV?
    // Actually, even in CSV mode, the header is text.
    // But 'NO' gives the standard human readable output which is what the user likely wants.
  });

  console.log(`Fetching info for ${missionId}...`);
  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    if (!response.ok) throw new Error(response.statusText);
    const text = await response.text();

    const outPath = path.join(INFO_DIR, `${missionId}.txt`);
    fs.writeFileSync(outPath, text);
    console.log(`Saved info to ${outPath}`);
  } catch (e) {
    console.warn(`Failed to fetch info: ${e.message}`);
  }
}

export { fetchMissionMetadata, generateTrajectory as processMission };
