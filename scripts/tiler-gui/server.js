import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import express from 'express';
import open from 'open';
import os from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3001;

// Global State
let currentThrottle = 0; // ms

// --- Middleware ---

// Network Throttle Middleware
app.use((req, _res, next) => {
  if (currentThrottle > 0 && (req.url.startsWith('/viewer') || req.url.startsWith('/scripts'))) {
    setTimeout(next, currentThrottle);
  } else {
    next();
  }
});

// Paths
const ROOT_DIR = resolve(__dirname, '../../'); // Project Root
const SCRIPT_PATH = join(ROOT_DIR, 'scripts', 'texture-pipeline', 'planet_tiler.py');

app.use(express.static(join(__dirname, 'public')));
app.use('/viewer', express.static(join(ROOT_DIR, 'scripts', 'texture-pipeline')));
app.use(express.json());

// 0. Network Throttle API
app.post('/api/throttle', (req, res) => {
  const { latency } = req.body;
  currentThrottle = parseInt(latency, 10) || 0;
  console.log(`[SYSTEM] Network throttle set to ${currentThrottle}ms`);
  res.json({ success: true, latency: currentThrottle });
});

// --- SSE Utils ---

function streamToSse(stream, res, tag = '') {
  let buffer = '';
  stream.on('data', (data) => {
    buffer += data.toString();
    // Split by \r, \n, or \r\n to handle Python's carriage returns for progress
    const lines = buffer.split(/\r\n|\r|\n/);
    buffer = lines.pop(); // Keep remnants in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed) {
        const msg = tag ? `[${tag}] ${trimmed}` : trimmed;
        res.write(`data: ${msg}\n\n`);
      }
    }
  });
}

// --- API ---

// 1. Get Config
app.get('/api/config', async (req, res) => {
  try {
    const configName = req.query.name || 'tiler_config';
    const configPath = join(dirname(SCRIPT_PATH), `${configName}.json`);

    if (existsSync(configPath)) {
      const data = await fs.readFile(configPath, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      res.json({}); // Empty default
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Save Config
app.post('/api/config', async (req, res) => {
  try {
    const configName = req.query.name || 'tiler_config';
    const configPath = join(dirname(SCRIPT_PATH), `${configName}.json`);

    await fs.writeFile(configPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 3. Run Tiler (SSE)
app.get('/api/run', (req, res) => {
  // SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Check script existence
  if (!existsSync(SCRIPT_PATH)) {
    res.write(`data: [ERROR] Script not found at ${SCRIPT_PATH}\n\n`);
    return res.end();
  }

  let pythonCmd = req.query.cmd || 'python'; // Use provided command or default

  // Resolve local batch file to absolute path if it exists in server directory
  // This is needed because we change the cwd to the script directory later
  if (existsSync(join(__dirname, pythonCmd))) {
    pythonCmd = join(__dirname, pythonCmd);
  }

  const configName = req.query.config || 'tiler_config';
  const configPath = join(dirname(SCRIPT_PATH), `${configName}.json`);

  // Check if config exists, if so use it
  const args = [SCRIPT_PATH];
  if (existsSync(configPath)) {
    args.push('--config', configPath);
  } else {
    res.write(
      `data: [WARNING] Config '${configName}.json' not found. Running with defaults/args may fail.\n\n`
    );
  }

  if (req.query.skirts === 'true') {
    args.push('--skirts');
  }

  if (req.query.planetocentric === 'true') {
    args.push('--planetocentric');
  }

  if (req.query.use_shm === 'true') {
    args.push('--use-shm');
  }

  if (req.query.working_dir) {
    // Sanitize: strip trailing slashes which can break Windows shell commands
    const sanitizedDir = req.query.working_dir.replace(/[\\/]+$/, '');
    args.push('--working-dir', sanitizedDir);
  }

  // Always force S2 projection (handled by script defaults now, but clean to remove args push)
  // if (req.query.projection) { args.push('--projection', req.query.projection); }

  if (req.query.bake_metadata === 'true') {
    args.push('--bake-metadata');
  }

  if (req.query.max_zoom_pole) {
    args.push('--max-zoom-pole', req.query.max_zoom_pole);
  }

  let autoPadding = 0;
  if (req.query.use_guidance_band === 'true') {
    if (existsSync(configPath)) {
      try {
        const configData = JSON.parse(readFileSync(configPath, 'utf8'));
        const maxZoom = configData.max_zoom || 4;
        autoPadding = 2 * Math.pow(2, maxZoom);
        res.write(`data: [INFO] Guidance Band (Sobel) Enabled. Auto-padding: ${autoPadding}px\n\n`);
      } catch (e) {
        res.write(`data: [WARNING] Failed to parse config for padding: ${e.message}\n\n`);
      }
    }
  }

  // Padding logic removed as it's now handled by the N+1 pre-processor pipeline
  // No longer passing --dem-padding or --color-padding to planet_tiler.py

  res.write(`data: [INFO] Spawning: ${pythonCmd} ${args.join(' ')}\n\n`);

  // Use shell: true to support .bat files, and set cwd to script directory so relative paths work
  const child = spawn(pythonCmd, args, {
    shell: true,
    cwd: dirname(SCRIPT_PATH),
  });

  streamToSse(child.stdout, res);
  streamToSse(child.stderr, res, 'STDERR');

  // Track active process
  global.activeProcess = child;

  child.on('close', (code) => {
    res.write(`data: [EXIT] Process exited with code ${code}\n\n`);
    res.end();
    if (global.activeProcess === child) global.activeProcess = null;
  });

  // Handle client disconnect
  req.on('close', () => {
    if (child.exitCode === null) {
      // NOTE: We don't necessarily want to kill the process if the browser tab closes,
      // but usually for a GUI like this, yes we do.
      // However, explicit Stop button is better.
      // We will keep this auto-kill on disconnect for now as it's existing behavior.
      child.kill();
    }
    if (global.activeProcess === child) global.activeProcess = null;
  });
});

// 3b. Stop Execution
app.get('/api/stop', (_req, res) => {
  if (global.activeProcess) {
    console.log('[API] Stopping active process...');
    // On Windows, child.kill() might not kill the whole tree if it's a batch file/shell.
    // But usually it works for simple spawns.
    // For 'tree-kill' behavior we might need a library, but let's try standard kill first.
    global.activeProcess.kill();
    global.activeProcess = null;
    res.json({ success: true, message: 'Process killed' });
  } else {
    res.json({ success: false, message: 'No active process' });
  }
});

// 4. Get Bodies Data
app.get('/api/bodies', (_req, res) => {
  const bodiesPath = join(dirname(SCRIPT_PATH), 'bodies.json');
  if (existsSync(bodiesPath)) {
    res.sendFile(bodiesPath);
  } else {
    res.status(404).json({ error: 'bodies.json not found' });
  }
});

// 5. Validate Output (SSE)
app.get('/api/validate', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const outputDir = req.query.output || 'tiles_out';
  let pythonCmd = req.query.cmd || 'python';

  // Resolve local batch file to absolute path if it exists
  if (existsSync(join(__dirname, pythonCmd))) {
    pythonCmd = join(__dirname, pythonCmd);
  }

  const validatorPath = join(dirname(SCRIPT_PATH), 'validate_deep.py');
  const tilesetPath = join(dirname(SCRIPT_PATH), outputDir, 'tileset.json');

  if (!existsSync(validatorPath)) {
    res.write('data: [ERROR] validate_deep.py not found\n\n');
    res.end();
    return;
  }

  res.write(`data: [INFO] Running validation on: ${tilesetPath}\n\n`);

  const child = spawn(pythonCmd, [validatorPath, tilesetPath], {
    shell: true,
    cwd: dirname(SCRIPT_PATH),
  });

  streamToSse(child.stdout, res);
  streamToSse(child.stderr, res, 'STDERR');

  child.on('close', (code) => {
    res.write(`data: [EXIT] Validation exited with code ${code}\n\n`);
    res.end();
  });

  req.on('close', () => {
    if (child.exitCode === null) {
      child.kill();
    }
  });
});

// 6. Validate with 3d-tiles-validator (SSE)
app.get('/api/validate-official', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const outputDir = req.query.output || 'tiles_out';
  const tilesetPath = join(dirname(SCRIPT_PATH), outputDir, 'tileset.json');

  if (!existsSync(tilesetPath)) {
    res.write(`data: [ERROR] tileset.json not found at ${tilesetPath}\n\n`);
    res.end();
    return;
  }

  res.write(`data: [INFO] Running 3d-tiles-validator on: ${tilesetPath}\n\n`);

  // Collect full output to parse JSON
  let fullOutput = '';

  // Run npx 3d-tiles-validator
  const child = spawn('npx', ['3d-tiles-validator', '--tilesetFile', tilesetPath], {
    shell: true,
    cwd: __dirname,
  });

  child.stdout.on('data', (data) => {
    const chunk = data.toString();
    fullOutput += chunk;

    // Stream the output live
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        res.write(`data: ${line}\n\n`);
      }
    }
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        res.write(`data: [STDERR] ${line}\n\n`);
      }
    }
  });

  child.on('close', (code) => {
    // Parse the JSON output and recursively count all issues by severity
    const stats = { errors: 0, warnings: 0, infos: 0, tilesWithIssues: 0 };
    let parseError = false;

    // Recursive function to count all issues including nested causes
    function countIssues(issue) {
      if (!issue) return;

      // Count by severity
      if (issue.severity === 'ERROR') {
        stats.errors++;
      } else if (issue.severity === 'WARNING') {
        stats.warnings++;
      } else if (issue.severity === 'INFO') {
        stats.infos++;
      }

      // Recursively count causes
      if (issue.causes && Array.isArray(issue.causes)) {
        for (const cause of issue.causes) {
          countIssues(cause);
        }
      }
    }

    try {
      // Find the JSON object in the output (starts with { ends with })
      const jsonMatch = fullOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // Count tiles with issues (top-level issues)
        if (parsed.issues && Array.isArray(parsed.issues)) {
          stats.tilesWithIssues = parsed.issues.length;

          // Recursively count all issues by severity
          for (const issue of parsed.issues) {
            countIssues(issue);
          }
        }
      }
    } catch {
      parseError = true;
    }

    // Write summary statistics
    res.write(`data: \n\n`);
    res.write(`data: ════════════════════════════════════════\n\n`);
    res.write(`data: 📊 VALIDATION SUMMARY\n\n`);
    res.write(`data: ════════════════════════════════════════\n\n`);

    if (parseError) {
      res.write(`data: ⚠️  Could not parse validator output\n\n`);
    } else {
      res.write(`data: ❌ Errors:   ${stats.errors}\n\n`);
      res.write(`data: ⚠️  Warnings: ${stats.warnings}\n\n`);
      res.write(`data: ℹ️  Info:     ${stats.infos}\n\n`);
      res.write(`data: 📋 Tiles:    ${stats.tilesWithIssues} tile(s) with issues\n\n`);
    }

    res.write(`data: ════════════════════════════════════════\n\n`);

    if (!parseError) {
      if (stats.errors === 0 && stats.warnings === 0 && stats.infos === 0) {
        res.write(`data: ✅ Validation PASSED - No issues found!\n\n`);
      } else if (stats.errors === 0 && stats.warnings === 0) {
        res.write(`data: ✅ Validation PASSED - ${stats.infos} info message(s) only\n\n`);
      } else if (stats.errors === 0) {
        res.write(`data: ⚠️  Validation completed with ${stats.warnings} warning(s)\n\n`);
      } else {
        res.write(`data: ❌ Validation FAILED - ${stats.errors} error(s) found\n\n`);
      }
    }

    res.write(`data: [EXIT] 3d-tiles-validator exited with code ${code}\n\n`);
    res.end();
  });

  req.on('close', () => {
    if (child.exitCode === null) {
      child.kill();
    }
  });
});

// 6b. GeoTIFF Optimize Endpoint
app.get('/api/optimize', (req, res) => {
  const file = req.query.file;
  const compress = req.query.compress || 'LZW';
  const replace = req.query.replace === 'true';

  let cmd = (req.query.cmd || 'python').trim();

  const candidatePath = join(__dirname, cmd);
  console.log(`[API-DEBUG] __dirname: ${__dirname}`);
  console.log(`[API-DEBUG] Received cmd: '${cmd}'`);
  console.log(`[API-DEBUG] Checking candidate: ${candidatePath}`);
  console.log(`[API-DEBUG] Exists? ${existsSync(candidatePath)}`);

  // Resolve local batch file to absolute path if it exists in server directory
  // This is needed because we change the cwd to the script directory later
  if (existsSync(candidatePath)) {
    cmd = candidatePath;
    console.log(`[API-DEBUG] Resolved absolute cmd: ${cmd}`);
  }

  // Must resolve script path relative to ROOT_DIR
  // scripts/texture-pipeline/optimize_geotiff.py
  const scriptPath = join(ROOT_DIR, 'scripts', 'texture-pipeline', 'optimize_geotiff.py');

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const args = [scriptPath, file, '--compress', compress];
  if (replace) args.push('--replace');

  console.log(`[API] optimizing: ${cmd} ${args.join(' ')}`);

  // Force unbuffered output if using python directly to solve "instant finish / no output" issues
  let finalArgs = args;
  if (cmd === 'python' || cmd === 'python3') {
    finalArgs = ['-u', ...args];
  }

  const child = spawn(cmd, finalArgs, {
    shell: true,
    cwd: dirname(SCRIPT_PATH), // Ensure we run in the scripts folder context
  });

  // Track for stop button
  global.activeProcess = child;

  // Handle spawn errors (e.g., cmd not found)
  child.on('error', (err) => {
    res.write(`data: [ERROR] Failed to start process '${cmd}': ${err.message}\n\n`);
    res.end();
  });

  streamToSse(child.stdout, res);
  streamToSse(child.stderr, res, 'STDERR');

  child.on('close', (code) => {
    if (code === 0) {
      res.write('data: [SUCCESS] Optimization finished.\n\n');
    } else {
      res.write(`data: [ERROR] Process exited with code ${code}\n\n`);
    }
    res.end();
    if (global.activeProcess === child) global.activeProcess = null;
  });

  req.on('close', () => {
    if (global.activeProcess === child && child.exitCode === null) {
      child.kill();
      global.activeProcess = null;
    }
  });
});

// 7. Browse File Dialog (PowerShell)
app.get('/api/browse', (req, res) => {
  const filter = req.query.filter || 'All Files (*.*)|*.*';
  const type = req.query.type || 'file'; // 'file' or 'directory'
  const scriptDir = dirname(SCRIPT_PATH);

  let psCommand = '';
  if (type === 'directory') {
    psCommand = `
            Add-Type -AssemblyName System.Windows.Forms;
            $f = New-Object System.Windows.Forms.FolderBrowserDialog;
            $f.SelectedPath = '${scriptDir}';
            $f.Description = 'Select Working Directory';
            if ($f.ShowDialog() -eq 'OK') {
                Write-Host $f.SelectedPath
            }
        `;
  } else {
    psCommand = `
            Add-Type -AssemblyName System.Windows.Forms;
            $f = New-Object System.Windows.Forms.OpenFileDialog;
            $f.Filter = '${filter}';
            $f.InitialDirectory = '${scriptDir}';
            if ($f.ShowDialog() -eq 'OK') {
                Write-Host $f.FileName
            }
        `;
  }

  const child = spawn('powershell', ['-Command', psCommand]);
  let output = '';

  child.stdout.on('data', (data) => {
    output += data.toString();
  });

  child.on('close', () => {
    const path = output.trim();
    if (path) {
      // Normalize for Windows comparison
      const normPath = path.toLowerCase().replace(/\//g, '\\');
      const normScriptDir = scriptDir.toLowerCase().replace(/\//g, '\\');

      let relative = path;
      if (normPath.startsWith(normScriptDir)) {
        // Extract the part after the script dir
        let sub = path.substring(scriptDir.length);
        if (sub.startsWith('\\') || sub.startsWith('/')) {
          sub = sub.substring(1);
        }
        relative = './' + sub;
      }

      res.json({ path: relative });
    } else {
      res.json({ cancelled: true });
    }
  });

  child.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

// --- CREATE DEBUG TEXTURE ENDPOINT ---
app.get('/api/create-debug-texture', (req, res) => {
  console.log('Starting Create Debug Texture...');

  // Use standard python (rasterio usually installed there)
  const pythonCmd = 'python';
  const scriptPath = join(__dirname, '../texture-pipeline/generate_debug_texture.py');

  // -u for unbuffered output so we see progress immediately
  const args = ['-u', scriptPath];
  if (req.query.rx) args.push('--rx', req.query.rx);
  if (req.query.ry) args.push('--ry', req.query.ry);
  if (req.query.rz) args.push('--rz', req.query.rz);
  if (req.query.width) args.push('--width', req.query.width);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const pythonProcess = spawn(pythonCmd, args, {
    cwd: dirname(scriptPath),
    shell: true,
  });

  pythonProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line) res.write(`data: ${line}\n\n`);
    });
  });

  pythonProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line) res.write(`data: [ERR] ${line}\n\n`);
    });
  });

  pythonProcess.on('close', (code) => {
    res.write(`data: [EXIT] Process exited with code ${code}\n\n`);
    res.end();
  });
});

// --- FIX METADATA ENDPOINT ---
app.get('/api/fix-metadata', (req, res) => {
  console.log('Starting Fix Metadata...');

  let pythonCmd = req.query.cmd || 'python';
  const scriptPath = join(__dirname, '../texture-pipeline/fix_metadata.py');

  // Resolve local batch file
  if (existsSync(join(__dirname, pythonCmd))) {
    pythonCmd = join(__dirname, pythonCmd);
  }

  const args = [scriptPath];
  args.push('--file', req.query.file);
  args.push('--rx', req.query.rx);
  args.push('--ry', req.query.ry);
  args.push('--rz', req.query.rz);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const pythonProcess = spawn(pythonCmd, args, {
    cwd: dirname(scriptPath),
    shell: true,
  });

  pythonProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line) res.write(`data: ${line}\n\n`);
    });
  });

  pythonProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line) res.write(`data: [ERR] ${line}\n\n`);
    });
  });

  pythonProcess.on('close', (code) => {
    res.write(`data: [EXIT] Process exited with code ${code}\n\n`);
    res.end();
  });
});

// Redundant /api/convert-dem endpoint removed.

// --- S2 FACE PREPROCESSOR ENDPOINT ---
app.get('/api/preprocess-faces', (req, res) => {
  const input = req.query.input;
  const outputPrefix = req.query.output_prefix;
  const maxZoom = req.query.max_zoom || '7';
  const tileSize = req.query.tile_size || '512';
  const compression = req.query.compression || 'LZW';
  const predictor = req.query.predictor || '2';
  const warpResampling = req.query.warp_resampling || req.query.resampling || 'BILINEAR';
  const overviewResampling = req.query.overview_resampling || 'LANCZOS'; // Default to Lanczos if missing
  const mode = req.query.mode || 'VERTEX';
  const cacheLimit = req.query.cache_limit || '512';
  const skipFaces = req.query.skip_faces || '0';

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  console.log(`[DEBUG] Preprocess Request Received: Mode=${mode}, Cache=${cacheLimit}`);

  if (!input || !outputPrefix) {
    console.log('[DEBUG] Missing input/output');
    res.write('data: [ERROR] Missing input or output_prefix\n\n');
    return res.end();
  }

  const exePath = join(dirname(SCRIPT_PATH), 's2_preprocessor.exe');
  const envWrapper = join(__dirname, 'run_with_osgeo.bat');

  if (!existsSync(exePath)) {
    console.log('[DEBUG] Exe not found');
    res.write(
      `data: [ERROR] Preprocessor executable not found at ${exePath}. Please compile it first using compile.bat.\n\n`
    );
    return res.end();
  }

  // Calculate safe cache limit (convert % to MB to avoid batch file issues)
  let finalCache = String(cacheLimit);
  if (finalCache.endsWith('%')) {
    try {
      const percent = parseInt(finalCache, 10);
      const totalMem = os.totalmem(); // Bytes
      const mb = Math.floor((totalMem * (percent / 100)) / (1024 * 1024));
      console.log(`[DEBUG] Converting ${finalCache} to ${mb}MB`);
      finalCache = String(mb);
    } catch {
      console.error('[WARN] Failed to calculate % memory, defaulting to 512');
      finalCache = '512';
    }
  }

  const coordMode = req.query.coord_mode || 'GEODETIC';
  // Output format logic
  let outFmt = 'FLOAT32';
  if (req.query.normalize === '1') outFmt = 'UINT16';
  else if (req.query.normalize === 'BYTE') outFmt = 'BYTE';

  const semiMajor = req.query.semi_major || '0';
  const semiMinor = req.query.semi_minor || '0';

  const maxZoomPole = req.query.max_zoom_pole || maxZoom;

  const args = [
    exePath,
    input,
    outputPrefix,
    maxZoom,
    tileSize,
    compression,
    predictor,
    warpResampling,
    mode,
    finalCache,
    skipFaces,
    coordMode,
    outFmt,
    semiMajor,
    semiMinor,
    overviewResampling,
    maxZoomPole,
    req.query.debug || '0', // 17 (Debug Flag)
  ];

  console.log(`[DEBUG] Spawning: ${envWrapper} ${args.join(' ')}`);
  res.write(`data: [INFO] Spawning Preprocessor via OSGeo4W...\n\n`);

  let child;
  try {
    child = spawn(envWrapper, args, {
      shell: true,
      cwd: dirname(SCRIPT_PATH),
    });

    global.activeProcess = child;
    console.log(`[DEBUG] Process spawned. PID: ${child.pid}`);
  } catch (e) {
    console.error('[ERROR] Spawn failed:', e);
    res.write(`data: [ERROR] Spawn failed: ${e.message}\n\n`);
    return res.end();
  }

  streamToSse(child.stdout, res);
  streamToSse(child.stderr, res, 'STDERR');

  child.on('close', (code) => {
    console.log(`[DEBUG] Process exited with code ${code}`);
    if (code === 0) {
      res.write('data: [SUCCESS] S2 Face Preprocessing complete.\n\n');
    } else {
      res.write(`data: [ERROR] Preprocessor exited with code ${code}\n\n`);
    }
    res.end();
    if (global.activeProcess === child) global.activeProcess = null;
  });

  req.on('close', () => {
    if (global.activeProcess === child && child.exitCode === null) {
      console.log('[DEBUG] Client disconnected, killing process');
      child.kill();
      global.activeProcess = null;
    }
  });
});

// --- S2 FACE PREVIEW ---
app.get('/api/preview-faces', async (req, res) => {
  try {
    const prefix = req.query.prefix;
    if (!prefix) {
      return res.status(400).json({ error: 'Missing prefix' });
    }

    const scriptPath = join(dirname(SCRIPT_PATH), 'preview_faces.py');
    const envWrapper = join(__dirname, 'run_with_osgeo.bat');

    if (!existsSync(scriptPath)) {
      return res.status(404).json({ error: `Preview script not found at ${scriptPath}` });
    }

    // We use the same OSGeo4W wrapper
    const child = spawn(envWrapper, [scriptPath, prefix], {
      shell: true,
      cwd: dirname(SCRIPT_PATH),
    });

    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    child.stderr.on('data', (data) => {
      output += data.toString();
    });

    child.on('error', (err) => {
      res.status(500).json({ success: false, error: `Spawn error: ${err.message}` });
    });

    child.on('close', (code) => {
      if (code === 0) {
        res.json({ success: true, output });
      } else {
        // If it's a 500 but we want JSON, ensure we don't send HTML
        res
          .status(500)
          .json({ success: false, error: output || `Script exited with code ${code}` });
      }
    });
  } catch (e) {
    console.error('[API] Preview Error:', e);
    res.status(500).json({ error: e.message });
  }
});

// --- CHECK BORDERS ENDPOINT ---
app.get('/api/check-borders', (req, res) => {
  console.log('Starting Border Check...');

  let pythonCmd = req.query.cmd || 'python';
  // Use check_borders.py from texture-pipeline
  const scriptPath = join(__dirname, '../texture-pipeline/check_borders.py');

  // Resolve local batch file
  if (existsSync(join(__dirname, pythonCmd))) {
    pythonCmd = join(__dirname, pythonCmd);
  }

  // Resolve output/target path relative to ROOT_DIR (where user likely has tiles_out)
  const outputDir = req.query.output || 'tiles_out';
  const targetPath = resolve(ROOT_DIR, outputDir);

  const args = [scriptPath, targetPath];
  if (req.query.zoom) {
    args.push('--zoom', req.query.zoom);
  }
  if (req.query.tolerance) {
    args.push('--tolerance', req.query.tolerance);
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Use unbuffered output to see progress
  // Only add -u if using direct python, not a wrapper script which might not accept it
  const isPython =
    pythonCmd === 'python' ||
    pythonCmd === 'python3' ||
    pythonCmd.toLowerCase().endsWith('python.exe');
  const finalArgs = isPython ? ['-u', ...args] : [...args];

  console.log(`[API] Spawning: ${pythonCmd} ${finalArgs.join(' ')}`);

  const pythonProcess = spawn(pythonCmd, finalArgs, {
    cwd: dirname(scriptPath), // Execute in texture-pipeline dir so relative commands work
    shell: true, // Required for Windows batch files (.bat)
  });

  // Track as active process for Stop button
  global.activeProcess = pythonProcess;

  pythonProcess.on('error', (err) => {
    console.error('[API] Spawn Error:', err);
    res.write(`data: [ERR] Failed to spawn python: ${err.message}\n\n`);
    res.end();
  });

  pythonProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line) res.write(`data: ${line}\n\n`);
    });
  });

  pythonProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line) res.write(`data: [ERR] ${line}\n\n`);
    });
  });

  pythonProcess.on('close', (code) => {
    res.write(`data: [EXIT] Process exited with code ${code}\n\n`);
    res.end();
    if (global.activeProcess === pythonProcess) global.activeProcess = null;
  });

  // Handle client disconnect
  req.on('close', () => {
    if (global.activeProcess === pythonProcess && pythonProcess.exitCode === null) {
      pythonProcess.kill();
      global.activeProcess = null;
    }
  });
});

app.listen(port, () => {
  console.log(`Planet Tiler GUI running at http://localhost:${port}`);
  open(`http://localhost:${port}`);
});
