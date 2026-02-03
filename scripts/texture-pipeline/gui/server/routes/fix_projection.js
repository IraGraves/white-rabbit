import { Router } from 'express';
import { join, dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { globalState, streamToSse, killProcess } from '../process-manager.js';

const router = Router();

export default function (scriptPath, serverDir) {
  router.get('/run', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const toolsDir = join(dirname(scriptPath), 'tools');
    const fixScript = join(toolsDir, 'fix_projection.py');

    if (!existsSync(fixScript)) {
      res.write(`data: [ERROR] Script not found at ${fixScript}\n\n`);
      return res.end();
    }

    // Determine Python command - Prefer run_with_osgeo.bat
    // Use -u for unbuffered output to ensure realtime logs
    let pythonCmd = 'python -u';

    // Check for run_with_osgeo.bat in server root
    const osgeoBat = join(serverDir, 'run_with_osgeo.bat');
    if (existsSync(osgeoBat)) {
      // For BAT, we can't easily add -u unless the BAT supports it, but usually standard python is the issue.
      // If run_with_osgeo.bat just calls python, we might need to edit the BAT or pass args differently.
      // Assuming BAT passes args: pythonCmd = `${osgeoBat} -u`; might work but safer to assume BAT handles env.
      // Actually, standard python buffers mostly.
      pythonCmd = osgeoBat;
    }

    if (req.query.python_cmd) {
      pythonCmd = req.query.python_cmd;
      if (!pythonCmd.includes('/') && !pythonCmd.includes('\\')) {
        const localCmd = join(serverDir, pythonCmd);
        if (existsSync(localCmd)) {
          pythonCmd = localCmd;
        }
      }
    }

    // Resolve paths to absolute to avoid CWD issues with the BAT wrapper
    // We assume input paths are relative to the pipeline root (scriptPath's dir)
    const pipelineRoot = dirname(scriptPath);
    const absInput = resolve(pipelineRoot, req.query.input);
    const absOutput = resolve(pipelineRoot, req.query.output);

    const args = [fixScript, absInput, absOutput];

    res.write(`data: [INFO] Spawning: ${pythonCmd} ${args.join(' ')}\n\n`);

    const child = spawn(pythonCmd, args, {
      shell: true,
      cwd: dirname(scriptPath), // Use pipeline root so relative paths (./input) work
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
      killProcess(child);
      if (globalState.activeProcess === child) globalState.activeProcess = null;
    });
  });

  return router;
}
