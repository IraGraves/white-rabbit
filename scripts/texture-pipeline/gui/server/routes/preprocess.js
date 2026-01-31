import { Router } from 'express';
import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import os from 'node:os';
import { globalState, streamToSse } from '../process-manager.js';

const router = Router();

export default function (scriptPath, serverDir) {
  // 1. S2 Face Preprocessor
  router.get('/preprocess-faces', (req, res) => {
    const input = req.query.input;
    const outputPrefix = req.query.output_prefix;
    const maxZoom = req.query.max_zoom || '7';
    const tileSize = req.query.tile_size || '512';
    const compression = req.query.compression || 'LZW';
    const predictor = req.query.predictor || '2';
    const warpResampling = req.query.warp_resampling || req.query.resampling || 'BILINEAR';
    const overviewResampling = req.query.overview_resampling || 'LANCZOS';
    const mode = req.query.mode || 'VERTEX';
    const cacheLimit = req.query.cache_limit || '512';
    const skipFaces = req.query.skip_faces || '0';

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    if (!input || !outputPrefix) {
      res.write('data: [ERROR] Missing input or output_prefix\n\n');
      return res.end();
    }

    const exePath = join(dirname(scriptPath), 'preprocessor', 's2_preprocessor.exe');
    const envWrapper = join(serverDir, 'run_with_osgeo.bat');

    if (!existsSync(exePath)) {
      res.write(
        `data: [ERROR] Preprocessor executable not found at ${exePath}. Please compile it first using compile.bat.\n\n`
      );
      return res.end();
    }

    // Calculate safe cache limit
    let finalCache = String(cacheLimit);
    if (finalCache.endsWith('%')) {
      try {
        const percent = parseInt(finalCache, 10);
        const totalMem = os.totalmem();
        const mb = Math.floor((totalMem * (percent / 100)) / (1024 * 1024));
        finalCache = String(mb);
      } catch {
        finalCache = '512';
      }
    }

    const coordMode = req.query.coord_mode || 'GEODETIC';
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
      req.query.debug || '0',
      req.query.ssaa || '1',
      req.query.ssaa_pole || '1',
      req.query.clean_output || '1', // Default to 1 (Clean) if not specified, or user preference? Let's default to '0' (Keep) to be safe, or '1' as requested? User said "make this a parameter". Defaulting to '0' (Keep) is safer for "start/stop" workflows. But user said "I clean manually". I'll default to '1' (Clean) to fix the bug by default, but allow '0'.
    ];

    res.write(`data: [INFO] Spawning Preprocessor via OSGeo4W...\n\n`);

    let child;
    try {
      child = spawn(envWrapper, args, {
        shell: true,
        cwd: dirname(scriptPath),
      });
      globalState.activeProcess = child;
    } catch (e) {
      res.write(`data: [ERROR] Spawn failed: ${e.message}\n\n`);
      return res.end();
    }

    streamToSse(child.stdout, res);
    streamToSse(child.stderr, res, 'STDERR');

    child.on('close', (code) => {
      if (code === 0) {
        res.write('data: [SUCCESS] S2 Face Preprocessing complete.\n\n');
      } else {
        res.write(`data: [ERROR] Preprocessor exited with code ${code}\n\n`);
      }
      res.end();
      if (globalState.activeProcess === child) globalState.activeProcess = null;
    });

    req.on('close', () => {
      if (globalState.activeProcess === child && child.exitCode === null) {
        child.kill();
        globalState.activeProcess = null;
      }
    });
  });

  // 2. Preview Faces
  router.get('/preview-faces', async (req, res) => {
    const prefix = req.query.prefix;
    if (!prefix) return res.status(400).json({ error: 'Missing prefix' });

    const scriptPathLocal = join(dirname(scriptPath), 'tools', 'preview_faces.py');
    const envWrapper = join(serverDir, 'run_with_osgeo.bat');

    if (!existsSync(scriptPathLocal))
      return res.status(404).json({ error: 'Preview script not found' });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const outputPath = `${prefix}_preview.png`;
    const args = ['python', scriptPathLocal, prefix, outputPath];

    res.write(`data: [INFO] Generating preview for ${prefix}...\n\n`);

    let child;
    try {
      child = spawn(envWrapper, args, {
        shell: true,
        cwd: dirname(scriptPath),
      });
      globalState.activeProcess = child;
    } catch (e) {
      res.write(`data: [ERROR] Spawn failed: ${e.message}\n\n`);
      return res.end();
    }

    streamToSse(child.stdout, res);
    streamToSse(child.stderr, res, 'STDERR');

    child.on('close', (code) => {
      if (code === 0) {
        res.write(`data: [SUCCESS] Preview generated: ${outputPath}\n\n`);
      } else {
        res.write(`data: [ERROR] Preview generation failed with code ${code}\n\n`);
      }
      res.end();
      if (globalState.activeProcess === child) globalState.activeProcess = null;
    });

    req.on('close', () => {
      if (globalState.activeProcess === child && child.exitCode === null) {
        child.kill();
        globalState.activeProcess = null;
      }
    });
  });

  return router;
}
