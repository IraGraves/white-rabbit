import { dirname, join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

// Import Routes
import configRoutes from './server/routes/config.js';
import executionRoutes from './server/routes/execution.js';
import validationRoutes from './server/routes/validation.js';
import preprocessRoutes from './server/routes/preprocess.js';
import browsingRoutes from './server/routes/browsing.js';
import downloaderRoutes from './server/routes/downloader.js';
import vrtBuilderRoutes from './server/routes/vrt_builder.js';
import fixProjectionRoutes from './server/routes/fix_projection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3001;

// Run Lib Setup asynchronously on start
import('./setup_libs.js').catch((e) => console.error('Lib setup failed:', e));

// Global State (Throttle)
let currentThrottle = 0;

// --- Middleware ---
// CORS Middleware (Manual)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Network Throttle Middleware
app.use((req, _res, next) => {
  if (currentThrottle > 0 && (req.url.startsWith('/viewer') || req.url.startsWith('/scripts'))) {
    setTimeout(next, currentThrottle);
  } else {
    next();
  }
});

// Paths
// Paths
const ROOT_DIR = resolve(__dirname, '../../../'); // Project Root
const SCRIPT_PATH = resolve(__dirname, '../planet_tiler.py'); // Relative to this GUI text folder

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

// --- Dynamic Content Serving ---
let dynamicContentPath = null;

// Endpoint to set the path
app.post('/api/set_content_path', (req, res) => {
  const { path } = req.body;
  if (path) {
    // If absolute, use as is. If relative, assume relative to project root (../)
    // server.js is in /gui, but tiler runs in parent dir.
    if (isAbsolute(path)) {
      dynamicContentPath = path;
    } else {
      dynamicContentPath = resolve(__dirname, '../', path);
    }
    console.log(`[SYSTEM] Viewer content root updated to: ${dynamicContentPath}`);
  } else {
    dynamicContentPath = null;
    console.log('[SYSTEM] Viewer content root reset to default.');
  }
  res.json({ success: true, path: dynamicContentPath });
});

// Middleware to serve content from dynamic path or default
app.use('/viewer/content', (req, res, next) => {
  if (dynamicContentPath) {
    // Log the attempted path for debugging
    const requestedPath = join(dynamicContentPath, req.url);
    console.log(`[DEBUG] Viewer requesting: ${req.url} -> Resolved: ${requestedPath}`);

    return express.static(dynamicContentPath)(req, res, next);
  }
  next();
});

// Default Static Serving
app.use('/viewer', express.static(resolve(__dirname, '../'))); // Serve texture-pipeline root for viewer

// --- Mount Routes ---
// We pass dependencies (SCRIPT_PATH, ROOT_DIR, __dirname) to factories
app.use('/api', configRoutes(SCRIPT_PATH));
app.use('/api', executionRoutes(SCRIPT_PATH, __dirname)); // needs server dir for local .bat spawning
app.use('/api', validationRoutes(SCRIPT_PATH, __dirname));
app.use('/api', preprocessRoutes(SCRIPT_PATH, __dirname));
app.use('/api', browsingRoutes(SCRIPT_PATH, ROOT_DIR, __dirname));
app.use('/api/tools/download', downloaderRoutes(SCRIPT_PATH, __dirname));
app.use('/api/tools/vrt_builder', vrtBuilderRoutes(SCRIPT_PATH, __dirname)); // Corrected endpoint for VRT
app.use('/api/tools/fix_projection', fixProjectionRoutes(SCRIPT_PATH, __dirname)); // Mount Fixer

// Throttle API (Kept here as middleware is here)
app.post('/api/throttle', (req, res) => {
  const { latency } = req.body;
  currentThrottle = parseInt(latency, 10) || 0;
  console.log(`[SYSTEM] Network throttle set to ${currentThrottle}ms`);
  res.json({ success: true, latency: currentThrottle });
});

// Start Server
// Start Server
app.listen(port, () => {
  console.log(`Planet Tiler GUI running at http://localhost:${port}`);
  console.log(`- Project Root: ${ROOT_DIR}`);
  console.log(`- Tiler Script: ${SCRIPT_PATH}`);

  // Open in browser
  import('open')
    .then((open) => {
      open.default(`http://localhost:${port}`);
    })
    .catch((err) => console.error('Failed to open browser:', err));
});
