import { Router } from 'express';
import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { globalState, streamToSse } from '../process-manager.js';

const router = Router();

export default function (scriptPath, rootDir, serverDir) {
  // 1. Get Bodies Data
  router.get('/bodies', (_req, res) => {
    const bodiesPath = join(dirname(scriptPath), 'bodies.json');
    if (existsSync(bodiesPath)) {
      res.sendFile(bodiesPath);
    } else {
      res.status(404).json({ error: 'bodies.json not found' });
    }
  });

  // 2. Browse File Dialog (PowerShell)
  router.get('/browse', (req, res) => {
    const filter = req.query.filter || 'All Files (*.*)|*.*';
    const type = req.query.type || 'file'; // 'file' or 'directory'
    const scriptDir = dirname(scriptPath);

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

  // 3. GeoTIFF Optimize Endpoint
  router.get('/optimize', (req, res) => {
    const file = req.query.file;
    const compress = req.query.compress || 'LZW';
    const replace = req.query.replace === 'true';

    let cmd = (req.query.cmd || 'python').trim();
    const candidatePath = join(serverDir, cmd); // Check relative to server.js dir

    // Resolve local batch file to absolute path if it exists
    if (existsSync(candidatePath)) {
      cmd = candidatePath;
    }

    const optimizeScriptPath = join(rootDir, 'scripts', 'texture-pipeline', 'tools', 'optimize_geotiff.py');

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const args = [optimizeScriptPath, file, '--compress', compress];
    if (replace) args.push('--replace');

    // Force unbuffered output
    let finalArgs = args;
    if (cmd === 'python' || cmd === 'python3') {
      finalArgs = ['-u', ...args];
    }

    const child = spawn(cmd, finalArgs, {
      shell: true,
      cwd: dirname(scriptPath),
    });

    globalState.activeProcess = child;

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
      if (globalState.activeProcess === child) globalState.activeProcess = null;
    });

    req.on('close', () => {
      if (globalState.activeProcess === child && child.exitCode === null) {
        child.kill();
        globalState.activeProcess = null;
      }
    });
  });

  // 4. File System List Endpoint
  router.get('/fs/list', async (req, res) => {
    try {
      const fs = await import('node:fs/promises');
      const { join, resolve, relative } = await import('node:path');
      
      const requestedPath = req.query.path || '.';
      // Base dir is Project Root to match client-side relative paths
      const baseDir = rootDir; 
      
      const fullPath = resolve(baseDir, requestedPath);
      
      // Security check: ensure we don't go above baseDir
      // Actually, user might want to see project root?
      // Use 'rootDir' as the hard limit.
      if (!fullPath.startsWith(rootDir)) {
         return res.status(403).json({ error: 'Access denied: Cannot go above project root.' });
      }

      if (!existsSync(fullPath)) {
         return res.status(404).json({ error: 'Path not found' });
      }

      const files = await fs.readdir(fullPath, { withFileTypes: true });
      
      const result = files.map(dirent => {
        return {
           name: dirent.name,
           isDirectory: dirent.isDirectory(),
           // We could get size but requires stat for each
        };
      });

      // Sort: directories first
      result.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
      });

      // Calculate relative path for navigation display
      const displayPath = relative(rootDir, fullPath);

      res.json({
          path: displayPath,
          entries: result,
          sep: process.platform === 'win32' ? '\\' : '/'
      });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
