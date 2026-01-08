import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import express from 'express';
import open from 'open';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3001;

// Paths
const ROOT_DIR = resolve(__dirname, '../../'); // Project Root
const CONFIG_PATH = join(ROOT_DIR, 'scripts', 'texture-pipeline', 'tiler_config.json');
const SCRIPT_PATH = join(ROOT_DIR, 'scripts', 'texture-pipeline', 'planet_tiler.py');

app.use(express.static(join(__dirname, 'public')));
app.use('/viewer', express.static(join(ROOT_DIR, 'scripts', 'texture-pipeline')));
app.use(express.json());

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

  if (req.query.explicit_tiling === 'true') {
    args.push('--explicit-tiling');
  }

  if (req.query.planetocentric === 'true') {
    args.push('--planetocentric');
  }

  res.write(`data: [INFO] Spawning: ${pythonCmd} ${args.join(' ')}\n\n`);

  // Use shell: true to support .bat files, and set cwd to script directory so relative paths work
  const child = spawn(pythonCmd, args, {
    shell: true,
    cwd: dirname(SCRIPT_PATH),
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
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
    res.write(`data: [EXIT] Process exited with code ${code}\n\n`);
    res.end();
  });

  // Handle client disconnect
  req.on('close', () => {
    if (child.exitCode === null) {
      child.kill();
    }
  });
});

// 4. Get Bodies Data
app.get('/api/bodies', (req, res) => {
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

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
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

// 7. Browse File Dialog (PowerShell)
app.get('/api/browse', (req, res) => {
  const filter = req.query.filter || 'All Files (*.*)|*.*';
  const scriptDir = dirname(SCRIPT_PATH);

  // PowerShell command to open dialog
  const psCommand = `
        Add-Type -AssemblyName System.Windows.Forms;
        $f = New-Object System.Windows.Forms.OpenFileDialog;
        $f.Filter = '${filter}';
        $f.InitialDirectory = '${scriptDir}';
        if ($f.ShowDialog() -eq 'OK') {
            Write-Host $f.FileName
        }
    `;

  const child = spawn('powershell', ['-Command', psCommand]);
  let output = '';

  child.stdout.on('data', (data) => {
    output += data.toString();
  });

  child.on('close', (code) => {
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

// --- DEBUG TILER ENDPOINT ---
app.get('/api/debug-tile', (req, res) => {
  console.log('Starting Debug Tiler...');

  const scriptPath = join(__dirname, '../texture-pipeline/debug_tiler.py');
  const wrapperPath = join(__dirname, 'run_with_osgeo.bat');

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Use the wrapper script, but keep CWD as the script directory for imports
  const pythonProcess = spawn(wrapperPath, [scriptPath], {
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
    res.write(`data: [EXIT] Debug exited with code ${code}\n\n`);
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Planet Tiler GUI running at http://localhost:${port}`);
  open(`http://localhost:${port}`);
});
