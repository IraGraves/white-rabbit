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
    const builderScript = join(toolsDir, 'build_vrt.py');

    if (!existsSync(builderScript)) {
      res.write(`data: [ERROR] Script not found at ${builderScript}\n\n`);
      return res.end();
    }

    // Determine Python command - Prefer run_with_osgeo.bat
    let pythonCmd = 'python';

    // Check for run_with_osgeo.bat in server root
    const osgeoBat = join(serverDir, 'run_with_osgeo.bat');
    if (existsSync(osgeoBat)) {
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

    const args = [builderScript];

    if (req.query.input_dir) args.push('--input-dir', req.query.input_dir);
    else {
      res.write(`data: [ERROR] Input directory required.\n\n`);
      return res.end();
    }

    if (req.query.output) args.push('--output', req.query.output);
    else {
      res.write(`data: [ERROR] Output path required.\n\n`);
      return res.end();
    }

    if (req.query.pattern) args.push('--pattern', req.query.pattern);
    if (req.query.relative === 'true') args.push('--relative');

    res.write(`data: [INFO] Spawning: ${pythonCmd} ${args.join(' ')}\n\n`);

    const child = spawn(pythonCmd, args, {
      shell: true,
      cwd: dirname(builderScript),
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
