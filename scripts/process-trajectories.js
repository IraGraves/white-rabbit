import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/data/missions/binary');

// Mapping for consistency with internal IDs if needed, otherwise use filename
const MISSION_IDS = {
  'Voyager_1.txt': 'voyager1',
  'Voyager_2.txt': 'voyager2',
  'Pioneer_10.txt': 'pioneer10',
  'Pioneer_11.txt': 'pioneer11',
  'Galileo.txt': 'galileo',
  'Cassini.txt': 'cassini',
  'New_Horizons.txt': 'newHorizons',
  'Parker_Solar_Probe.txt': 'parkerSolarProbe',
  'Juno.txt': 'juno',
  'Rosetta.txt': 'rosetta',
  'Ulysses.txt': 'ulysses',
};

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function processFile(filename) {
  const inputPath = path.join(INPUT_DIR, filename);
  const missionId = MISSION_IDS[filename];

  if (!missionId) {
    console.log(`Skipping undefined mission file: ${filename}`);
    return;
  }

  const outputPath = path.join(OUTPUT_DIR, `${missionId}.bin`);

  // 1. Incremental Check
  const force = process.argv.includes('--force');
  if (fs.existsSync(outputPath) && !force) {
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);

    if (outputStats.mtime > inputStats.mtime) {
      console.log(`[SKIP] ${missionId} is up to date.`);
      return;
    }
  }

  console.log(`[BUILD] Processing ${missionId}...`);

  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n');

  const dataPoints = [];

  let capture = false;
  let dateLine = null;

  // Regex to match: 2443392.083333333 = A.D. 1977-Sep-05 14:00:00.0000 TDB
  const dateRegex = /A\.D\.\s+(\d{4}-[A-Za-z]{3}-\d{2}\s+\d{2}:\d{2}:\d{2}(\.\d+)?)/;

  // Regex to match: X = 9.650...E-01 Y = -2.67...E-01 Z = ...
  const posRegex =
    /X\s*=\s*([+-]?\d+\.\d+E[+-]?\d+)\s+Y\s*=\s*([+-]?\d+\.\d+E[+-]?\d+)\s+Z\s*=\s*([+-]?\d+\.\d+E[+-]?\d+)/;

  for (const line of lines) {
    if (line.trim() === '$$SOE') {
      capture = true;
      continue;
    }
    if (line.trim() === '$$EOE') {
      break;
    }

    if (capture) {
      if (!dateLine) {
        // Expecting Date Line
        if (line.includes('A.D.')) {
          dateLine = line;
        }
      } else {
        // Expecting Position Line
        const posMatch = line.match(posRegex);
        if (posMatch) {
          const dateMatch = dateLine.match(dateRegex);
          if (dateMatch) {
            // Parse Date
            // Format: 1977-Sep-05 14:00:00.0000
            // JS Date.parse accepts "1977-Sep-05 14:00:00" usually
            // We might need to replace 'Sep' with index if locale fails, but V8 handles it.
            // Let's try standard parse.
            const dateStr = dateMatch[1].replace('TDB', '').trim();
            const date = new Date(dateStr).getTime();

            if (!isNaN(date)) {
              let x = parseFloat(posMatch[1]);
              let y = parseFloat(posMatch[2]);
              let z = parseFloat(posMatch[3]);

              // scene.x = astro.x
              // scene.y = astro.z  (North is Up, assuming ICRF Z is Scene Up)
              // scene.z = -astro.y (Y is -Z depth)
              // ICRF X,Y,Z matches Astronomy Engine output usage in this app

              dataPoints.push(date, x, z, -y);
            }
          }
          dateLine = null; // Reset for next pair
        }
      }
    }
  }

  if (dataPoints.length > 0) {
    const buffer = new Float64Array(dataPoints);
    fs.writeFileSync(outputPath, Buffer.from(buffer.buffer));
    console.log(
      `[SUCCESS] Wrote ${dataPoints.length / 4} points to ${missionId}.bin (${(buffer.byteLength / 1024).toFixed(1)} KB)`
    );
  } else {
    console.warn(`[WARN] No data points found for ${missionId}`);
  }
}

async function main() {
  const files = fs.readdirSync(INPUT_DIR);
  for (const file of files) {
    if (file.endsWith('.txt')) {
      await processFile(file);
    }
  }
}

main().catch(console.error);
