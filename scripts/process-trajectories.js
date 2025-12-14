import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT_DIR = path.join(__dirname, '../public/data/missions');
const OUTPUT_DIR = path.join(__dirname, '../public/data/missions/binary');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper: Julian Date to JS Timestamp (ms)
function jdToMs(jd) {
  return (jd - 2440587.5) * 86400 * 1000;
}

// Collinearity epsilon (tolerance)
// 1.0 means perfectly straight.
// The user wants "very very low tolerance" to preserve meaningful data.
// 1e-12 seems reasonably strict? Or 1e-10?
// Cos(alpha) > 1 - epsilon
// If alpha is tiny, cos(alpha) ~ 1 - alpha^2/2.
// If epsilon = 1e-10, alpha^2/2 = 1e-10 => alpha^2 = 2e-10 => alpha ~ 1.4e-5 radians.
// That's very small deviation.
const COLLINEARITY_EPSILON = 1e-9;

// Missions to skip entirely (no trajectory file - orbit-only)
const SKIP_MISSIONS = ['teslaRoadster'];

// Cut-off dates (JD) for missions that should stop early (e.g. entering orbit)
const CUT_OFF_DATES = {
  // Add other missions here if needed
};

function parseHorizonsFile(filePath, cutOffJD = null) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const points = [];

  let reading = false;
  let currentJD = null;

  for (const line of lines) {
    if (line.trim() === '$$SOE') {
      reading = true;
      continue;
    }
    if (line.trim() === '$$EOE') {
      reading = false;
      break;
    }

    if (!reading) continue;

    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for "JD = Date" line
    // Format: 2443392.083333333 = A.D. 1977-Sep-05 14:00:00.0000 TDB
    if (trimmed.includes('= A.D.')) {
      const parts = trimmed.split('=');
      currentJD = parseFloat(parts[0]);

      if (cutOffJD && currentJD > cutOffJD) {
        // Stop reading if we passed the cut-off
        break;
      }
    }
    // Check for "X = ... Y = ... Z = ..." line
    // Format: X = 9.650848449458849E-01 Y =-2.672841958678684E-01 Z =-1.158918658473866E-01
    else if (trimmed.startsWith('X =')) {
      if (currentJD === null) continue;

      // X is at index 2 (X, =, value)
      // Y is at index 5
      // Z is at index 8
      let x, y, z;

      // Parse logic depending on exact spaces
      // Regex is safer
      const xMatch = trimmed.match(/X\s*=\s*([-+0-9.E]+)/);
      const yMatch = trimmed.match(/Y\s*=\s*([-+0-9.E]+)/);
      const zMatch = trimmed.match(/Z\s*=\s*([-+0-9.E]+)/);

      if (xMatch && yMatch && zMatch) {
        x = parseFloat(xMatch[1]);
        y = parseFloat(yMatch[1]);
        z = parseFloat(zMatch[1]);

        points.push({
          jd: currentJD,
          x,
          y,
          z,
        });
      }
    }
  }

  return points;
}

function filterCollinearPoints(points) {
  if (points.length < 3) return points;

  const filtered = [points[0]];
  let lastPoint = points[0];

  for (let i = 1; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];

    // Check collinearity
    // Vector A (Last -> Current)
    const ax = currentPoint.x - lastPoint.x;
    const ay = currentPoint.y - lastPoint.y;
    const az = currentPoint.z - lastPoint.z;
    const aMag = Math.sqrt(ax * ax + ay * ay + az * az);

    // Vector B (Current -> Next)
    const bx = nextPoint.x - currentPoint.x;
    const by = nextPoint.y - currentPoint.y;
    const bz = nextPoint.z - currentPoint.z;
    const bMag = Math.sqrt(bx * bx + by * by + bz * bz);

    if (aMag === 0 || bMag === 0) {
      // Duplicate points? Skip
      continue;
    }

    const dot = (ax * bx + ay * by + az * bz) / (aMag * bMag);

    // Dot product close to 1 means collinear
    const deviation = 1 - dot;

    if (deviation <= COLLINEARITY_EPSILON) {
      // It's a straight line (redundant point)
      // Skip it
    } else {
      // Key point (corner or curve), keep it
      filtered.push(currentPoint);
      lastPoint = currentPoint;
    }
  }

  // Always keep the last point
  filtered.push(points[points.length - 1]);
  return filtered;
}

function processFiles() {
  const files = fs.readdirSync(INPUT_DIR);

  for (const file of files) {
    if (!file.endsWith('.txt')) continue;

    console.log(`Processing ${file}...`);
    const inputPath = path.join(INPUT_DIR, file);
    const missionId = path.parse(file).name.toLowerCase(); // voyager_1.txt -> voyager_1
    // Map filename to ID used by the app if needed.
    // App uses 'voyager1', but file is 'Voyager_1.txt'.
    // We should fix the naming to match or renaming it here.
    // 'Voyager_1.txt' -> 'voyager1'

    // Wait, let's keep it simple and see what matches.
    // 'Voyager_1.txt' -> 'voyager1'
    // 'Voyager_2.txt' -> 'voyager2'
    // 'Pioneer_10.txt' -> 'pioneer10'
    // 'Pioneer_11.txt' -> 'pioneer11'
    // 'Galileo.txt' -> 'galileo'
    // 'Cassini.txt' -> 'cassini'
    // 'Ulysses.txt' -> 'ulysses'
    // 'Rosetta.txt' -> 'rosetta'
    // 'Juno.txt' -> 'juno'
    // 'New_Horizons.txt' -> 'newHorizons' (CamelCase in app: newHorizons)
    // 'Parker_Solar_Probe.txt' -> 'parkerSolarProbe'

    // Manual mapping based on listing
    const nameMap = {
      voyager_1: 'voyager1',
      voyager_2: 'voyager2',
      pioneer_10: 'pioneer10',
      pioneer_11: 'pioneer11',
      galileo: 'galileo',
      cassini: 'cassini',
      ulysses: 'ulysses',
      rosetta: 'rosetta',
      juno: 'juno',
      new_horizons: 'newHorizons',
      parks_solar_probe: 'parkerSolarProbe',
      tesla_roadster: 'teslaRoadster',
    };

    const mappedId = nameMap[missionId];
    if (!mappedId) {
      console.warn(`Skipping unmapped file: ${file} (ID: ${missionId})`);
      continue;
    }

    // Skip missions that don't need a trajectory file (orbit-only)
    if (SKIP_MISSIONS.includes(mappedId)) {
      console.log(`  Skipping ${mappedId} (orbit-only, no trajectory file).`);
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, `${mappedId}.bin`);

    const cutOff = CUT_OFF_DATES[mappedId];
    if (cutOff) {
      console.log(`  Applying cut-off date for ${mappedId}: JD ${cutOff}`);
    }

    const points = parseHorizonsFile(inputPath, cutOff);
    console.log(`  Parsed ${points.length} points.`);

    const filtered = filterCollinearPoints(points);
    console.log(
      `  Filtered to ${filtered.length} points (${Math.round((1 - filtered.length / points.length) * 100)}% reduction).`
    );

    // Create Float64Array
    // [Time, X, Y, Z, ...]
    const stride = 4;
    const buffer = new Float64Array(filtered.length * stride);

    for (let i = 0; i < filtered.length; i++) {
      const p = filtered[i];
      buffer[i * stride + 0] = jdToMs(p.jd);
      // Scene coordinates: X=x, Y=z, Z=-y (matches missionTrajectory.ts)
      buffer[i * stride + 1] = p.x;
      buffer[i * stride + 2] = p.z;
      buffer[i * stride + 3] = -p.y;
    }

    fs.writeFileSync(outputPath, buffer); // Node buffer from TypedArray
    console.log(`  Wrote ${outputPath}`);
  }
}

processFiles();
