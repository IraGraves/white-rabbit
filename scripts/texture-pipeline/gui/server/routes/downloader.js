import { Router } from 'express';
import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { globalState, streamToSse } from '../process-manager.js';

const router = Router();

export default function (scriptPath, serverDir) {
  router.get('/run', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const toolsDir = join(dirname(scriptPath), 'tools');
    const downloaderScript = join(toolsDir, 'downloader.py');

    if (!existsSync(downloaderScript)) {
      res.write(`data: [ERROR] Downloader script not found at ${downloaderScript}\n\n`);
      return res.end();
    }

    let pythonCmd = 'python'; // Default
    // Check for local venv/python in server dir if needed, similar to execution.js
    // Or just use 'python' if we assume env is set up.
    // The previous execution used `req.query.cmd` or checked for local bat.
    // Let's use the same logic if possible or default to 'python'.

    // For simplicity, we'll try to use the same python logic if passed, or default.
    // Determine Python command - Prefer run_with_osgeo.bat

    // Check for run_with_osgeo.bat in server root
    const osgeoBat = join(serverDir, 'run_with_osgeo.bat');
    if (existsSync(osgeoBat)) {
      pythonCmd = osgeoBat;
    }

    // The GUI passes `python_cmd` in config.
    if (req.query.python_cmd) {
      pythonCmd = req.query.python_cmd;
      // If it is a relative path like 'run_with_osgeo.bat' check serverDir
      if (!pythonCmd.includes('/') && !pythonCmd.includes('\\')) {
        const localCmd = join(serverDir, pythonCmd);
        if (existsSync(localCmd)) {
          pythonCmd = localCmd;
        }
      }
    }

    const args = [downloaderScript];
    const mode = req.query.mode; // 'hips' or 'batch'

    if (!mode) {
      res.write(`data: [ERROR] No mode specified.\n\n`);
      return res.end();
    }

    args.push(mode);

    if (mode === 'hips') {
      if (req.query.hips_url) args.push('--hips-url', req.query.hips_url);
      if (req.query.hips_id) args.push('--hips-id', req.query.hips_id);
      if (req.query.tiles_x) args.push('--tiles-x', req.query.tiles_x);
      if (req.query.tiles_y) args.push('--tiles-y', req.query.tiles_y);
      if (req.query.full_width) args.push('--full-width', req.query.full_width);
      if (req.query.full_height) args.push('--full-height', req.query.full_height);
      if (req.query.width) args.push('--width', req.query.width);
      if (req.query.height) args.push('--height', req.query.height);
      if (req.query.prefix) args.push('--prefix', req.query.prefix);
    } else if (mode === 'batch') {
      if (req.query.file_list) args.push('--file-list', req.query.file_list);
    }

    if (req.query.output) args.push('--output', req.query.output);
    if (req.query.workers) args.push('--workers', req.query.workers);

    res.write(`data: [INFO] Spawning: ${pythonCmd} ${args.join(' ')}\n\n`);

    const child = spawn(pythonCmd, args, {
      shell: true,
      cwd: dirname(downloaderScript),
    });

    streamToSse(child.stdout, res);
    streamToSse(child.stderr, res, 'STDERR');

    globalState.activeProcess = child;

    child.on('close', (code) => {
      res.write(`data: [EXIT] Process exited with code ${code}\n\n`);
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

  return router;
}
