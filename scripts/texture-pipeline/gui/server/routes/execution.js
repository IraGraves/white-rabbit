import { Router } from 'express';
import { join, dirname } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { globalState, streamToSse } from '../process-manager.js';

const router = Router();

export default function (scriptPath, serverDir) {
  // 1. Run Tiler (SSE)
  router.get('/run', (req, res) => {
    // SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Check script existence
    if (!existsSync(scriptPath)) {
      res.write(`data: [ERROR] Script not found at ${scriptPath}\n\n`);
      return res.end();
    }

    let pythonCmd = req.query.cmd || 'python';
    const candidatePath = join(serverDir, pythonCmd);

    // Resolve local batch file
    if (existsSync(candidatePath)) {
      pythonCmd = candidatePath;
    }

    const configName = req.query.config || 'tiler_config';
    const configPath = join(dirname(scriptPath), `${configName}.json`);

    const args = [scriptPath];
    if (existsSync(configPath)) {
      args.push('--config', configPath);
    } else {
      res.write(
        `data: [WARNING] Config '${configName}.json' not found. Running with defaults/args may fail.\n\n`
      );
    }

    if (req.query.skirts === 'true') args.push('--skirts');
    if (req.query.planetocentric === 'true') args.push('--planetocentric');
    if (req.query.use_shm === 'true') args.push('--use-shm');

    if (req.query.working_dir) {
      const sanitizedDir = req.query.working_dir.replace(/[\\/]+$/, '');
      args.push('--working-dir', sanitizedDir);
    }

    if (req.query.output) {
      const sanitizedOut = req.query.output.replace(/[\\/]+$/, '');
      args.push('--output', sanitizedOut);
    }

    if (req.query.analysis === 'true') args.push('--analysis');
    if (req.query.bake_metadata === 'true') args.push('--bake-metadata');
    if (req.query.max_zoom_pole) args.push('--max-zoom-pole', req.query.max_zoom_pole);
    if (req.query.heightmap_mode === 'true') args.push('--heightmap-mode');

    // Textures & DEM
    if (req.query.dem_file) {
      args.push(req.query.dem_file);
    }
    if (req.query.color_file) {
      args.push(req.query.color_file);
    }
    if (req.query.color_name) {
      args.push('--color-name', req.query.color_name);
    }
    if (req.query.extra_textures) {
      args.push('--extra-textures');
      args.push(req.query.extra_textures);
    }
    if (req.query.texture_size) {
      args.push('--texture-size', req.query.texture_size);
    }

    if (req.query.use_guidance_band === 'true') {
      if (existsSync(configPath)) {
        try {
          const configData = JSON.parse(readFileSync(configPath, 'utf8'));
          const maxZoom = configData.max_zoom || 4;
          const autoPadding = 2 * Math.pow(2, maxZoom);
          res.write(
            `data: [INFO] Guidance Band (Sobel) Enabled. Auto-padding: ${autoPadding}px\n\n`
          );
        } catch (e) {
          res.write(`data: [WARNING] Failed to parse config for padding: ${e.message}\n\n`);
        }
      }
    }

    // Windows Batch File Handling with shell: false
    // If command ends in .bat or .cmd, we must run it via cmd.exe /c
    if (pythonCmd.toLowerCase().endsWith('.bat') || pythonCmd.toLowerCase().endsWith('.cmd')) {
      args.unshift(pythonCmd);
      args.unshift('/c');
      pythonCmd = 'cmd.exe';
    }

    res.write(`data: [INFO] Spawning: ${pythonCmd} ${args.join(' ')}\n\n`);

    const child = spawn(pythonCmd, args, {
      shell: false,
      cwd: dirname(scriptPath),
    });

    streamToSse(child.stdout, res);
    streamToSse(child.stderr, res, 'STDERR');

    globalState.activeProcess = child;

    child.on('close', (code) => {
      res.write(`data: [EXIT] Process exited with code ${code}\n\n`);
      res.end();
      if (globalState.activeProcess === child) globalState.activeProcess = null;
    });

    child.on('error', (err) => {
      res.write(`data: [ERROR] Failed to start process: ${err.message}\n\n`);
      res.end();
      if (globalState.activeProcess === child) globalState.activeProcess = null;
    });

    req.on('close', () => {
      if (child.exitCode === null) {
        child.kill();
      }
      if (globalState.activeProcess === child) globalState.activeProcess = null;
    });
  });

  // 2. Stop Execution
  router.get('/stop', (_req, res) => {
    if (globalState.activeProcess) {
      console.log('[API] Stopping active process...');
      globalState.activeProcess.kill();
      globalState.activeProcess = null;
      res.json({ success: true, message: 'Process killed' });
    } else {
      res.json({ success: false, message: 'No active process' });
    }
  });

  // 3. Network Throttle
  router.post('/throttle', (req, res) => {
    const { latency } = req.body;
    // In this split, we might need a way to set the global throttle variable in index.js
    // For now, we will return it and handle state in main app or shared util?
    // Let's attach it to the req app locals if we want global access, or just return it.
    // Simplified: The throttle middleware is in index.js. This route just sets it there.
    // We will pass a callback or setter function.
    res.status(501).json({ error: 'Throttle control moved to index.js' });
  });

  return router;
}
