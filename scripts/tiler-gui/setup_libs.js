/**
 * setup_libs.js
 * Copies necessary Three.js libraries from node_modules to public/libs
 * for offline/local GUI usage.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Libraries to copy
// Source path relative to node_modules
// Dest filename relative to public/libs (or public root via ..)
const LIBS = [
  { src: 'three/build/three.module.js', dest: 'libs/three.module.js' },
  { src: 'three/build/three.core.js', dest: 'libs/three.core.js' },
  { src: 'three/examples/jsm/loaders/KTX2Loader.js', dest: 'libs/KTX2Loader.js' },
  { src: 'three/examples/jsm/libs/basis/basis_transcoder.js', dest: 'libs/basis_transcoder.js' },
  {
    src: 'three/examples/jsm/libs/basis/basis_transcoder.wasm',
    dest: 'libs/basis_transcoder.wasm',
  },

  // Dependencies required by KTX2Loader (relative imports in KTX2Loader.js)
  // KTX2Loader is in libs/, so it imports ../utils/WorkerPool.js -> public/utils/WorkerPool.js
  { src: 'three/examples/jsm/utils/WorkerPool.js', dest: 'utils/WorkerPool.js' },
  { src: 'three/examples/jsm/libs/ktx-parse.module.js', dest: 'libs/ktx-parse.module.js' },
  { src: 'three/examples/jsm/libs/zstddec.module.js', dest: 'libs/zstddec.module.js' },
  { src: 'three/examples/jsm/math/ColorSpaces.js', dest: 'math/ColorSpaces.js' },
];

async function copyLibs() {
  console.log('[SETUP] Checking libraries...');

  try {
    for (const lib of LIBS) {
      const srcPath = path.join(ROOT_DIR, 'node_modules', lib.src);
      const destPath = path.join(PUBLIC_DIR, lib.dest);

      try {
        // Check if src exists
        await fs.access(srcPath);

        // Ensure dest parent dir exists
        await fs.mkdir(path.dirname(destPath), { recursive: true });

        // Copy
        await fs.copyFile(srcPath, destPath);
        console.log(`[SETUP] Copied ${lib.dest}`);
      } catch (e) {
        console.warn(`[SETUP] Warning: Could not copy ${lib.src}. ${e.message}`);
      }
    }
    console.log('[SETUP] Library setup complete.');
  } catch (e) {
    console.error(`[SETUP] Failed to setup libs: ${e.message}`);
  }
}

copyLibs();
