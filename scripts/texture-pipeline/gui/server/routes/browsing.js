import { Router } from 'express';
import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { globalState, streamToSse } from '../process-manager.js';

const router = Router();

export default function (scriptPath, rootDir, serverDir) {
  console.log('[SYSTEM] Browsing Routes Loaded (with Preview Support)');
  // 1. Get Bodies Data
  router.get('/bodies', (_req, res) => {
    const bodiesPath = join(dirname(scriptPath), 'bodies.json');
    if (existsSync(bodiesPath)) {
      res.sendFile(bodiesPath);
    } else {
      res.status(404).json({ error: 'bodies.json not found' });
    }
  });

  router.post('/bodies', async (req, res) => {
    try {
      const fs = await import('node:fs/promises');
      const bodiesPath = join(dirname(scriptPath), 'bodies.json');

      const bodies = req.body;
      if (typeof bodies !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }

      await fs.writeFile(bodiesPath, JSON.stringify(bodies, null, 4));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
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

    const optimizeScriptPath = join(
      rootDir,
      'scripts',
      'texture-pipeline',
      'tools',
      'optimize_geotiff.py'
    );

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

      const result = files.map((dirent) => {
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
        sep: process.platform === 'win32' ? '\\' : '/',
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // 5. File Info Endpoint (gdalinfo for VRT/TIF)
  router.get('/fs/info', async (req, res) => {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).json({ error: 'Missing path parameter' });

    const { resolve } = await import('node:path');
    const fullPath = resolve(rootDir, filePath);

    // Security check
    if (!fullPath.startsWith(rootDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Only process VRT and TIF files
    const ext = fullPath.toLowerCase();
    if (!ext.endsWith('.vrt') && !ext.endsWith('.tif') && !ext.endsWith('.tiff')) {
      return res.status(400).json({ error: 'Only VRT/TIF files supported' });
    }

    // Run gdalinfo via OSGeo4W
    const envWrapper = join(serverDir, 'run_with_osgeo.bat');
    const args = ['gdalinfo', '-json', fullPath];

    try {
      const child = spawn(envWrapper, args, {
        shell: true,
        cwd: dirname(scriptPath),
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', (code) => {
        if (code !== 0) {
          return res.status(500).json({ error: `gdalinfo failed: ${errorOutput}` });
        }

        try {
          // Parse JSON output from gdalinfo
          const info = JSON.parse(output);

          // Extract useful info
          const result = {
            size: info.size,
            bands: info.bands ? info.bands.length : 0,
            bandTypes: info.bands ? info.bands.map((b) => b.type) : [],
            projection: info.coordinateSystem?.wkt?.substring(0, 100) || 'Unknown',
            driver: info.driverShortName,
            metadata: info.metadata || {},
          };

          res.json(result);
        } catch (e) {
          res.status(500).json({ error: `Failed to parse gdalinfo output: ${e.message}` });
        }
      });

      child.on('error', (err) => {
        res.status(500).json({ error: `Spawn failed: ${err.message}` });
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // 6. File Preview Endpoint (converts VRT/TIF to PNG for viewing)
  router.get('/fs/preview', async (req, res) => {
    const filePath = req.query.path;
    const maxSize = parseInt(req.query.size || '512', 10);

    if (!filePath) return res.status(400).json({ error: 'Missing path parameter' });

    const { resolve, basename } = await import('node:path');
    const { tmpdir } = await import('node:os');
    const fs = await import('node:fs/promises');

    const fullPath = resolve(rootDir, filePath);

    // Security check
    if (!fullPath.startsWith(rootDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Only process VRT and TIF files
    const ext = fullPath.toLowerCase();
    if (!ext.endsWith('.vrt') && !ext.endsWith('.tif') && !ext.endsWith('.tiff')) {
      return res.status(400).json({ error: 'Only VRT/TIF files supported' });
    }

    // Generate temp output filename
    const tempFile = join(tmpdir(), `preview_${Date.now()}.png`);

    // Run gdal_translate via OSGeo4W to create a scaled PNG preview
    const envWrapper = join(serverDir, 'run_with_osgeo.bat');
    const args = [
      'gdal_translate',
      '-of',
      'PNG',
      '-outsize',
      String(maxSize),
      '0', // Scale to maxSize width, maintain aspect ratio
      '-scale', // Auto-scale values to 0-255
      fullPath,
      tempFile,
    ];

    try {
      const child = spawn(envWrapper, args, {
        shell: true,
        cwd: dirname(scriptPath),
      });

      let errorOutput = '';

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', async (code) => {
        if (code !== 0) {
          return res.status(500).json({ error: `gdal_translate failed: ${errorOutput}` });
        }

        try {
          // Read and send the PNG file
          const pngData = await fs.readFile(tempFile);
          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Content-Disposition', `inline; filename="${basename(filePath)}.png"`);
          res.send(pngData);

          // Clean up temp file
          await fs.unlink(tempFile).catch(() => {});
        } catch (e) {
          res.status(500).json({ error: `Failed to read preview: ${e.message}` });
        }
      });

      child.on('error', (err) => {
        res.status(500).json({ error: `Spawn failed: ${err.message}` });
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
