import { Logger } from './modules/logger.js';
import { ConfigManager } from './modules/config.js';
import { Runner } from './modules/runner.js';
import { Validation } from './modules/validation.js';
import { Preprocessor } from './modules/preprocessor.js';
import { Browsing } from './modules/browsing.js';
import { FileSystem } from './modules/filesystem.js';

// Initialize Modules
document.addEventListener('DOMContentLoaded', () => {
  Logger.init();
  Logger.log('[SYSTEM] Initializing Modules...');

  ConfigManager.init();
  Runner.init();
  Validation.init();
  Preprocessor.init();
  Browsing.init();
  FileSystem.init();

  // Viewer Buttons Logic (Simple enough to keep here or move to a Viewer module if it grows)
  const outputInput = document.getElementById('output');

  // 6. Viewer Button Logic
  const btnViewer = document.getElementById('btnViewer');
  if (btnViewer) {
    btnViewer.addEventListener('click', () => {
      const outDir = outputInput.value || 'tiles_out';
      let target = outDir;
      if (!target.startsWith('.') && !target.startsWith('/')) {
        target = './' + target;
      }
      window.open(`/viewer?url=${encodeURIComponent(target)}`, '_blank');
    });
  }

  // 6b. Cesium Viewer Button Logic
  const btnCesium = document.getElementById('btnCesium');
  if (btnCesium) {
    btnCesium.addEventListener('click', () => {
      const outDir = outputInput.value || 'tiles_out';
      let target = outDir;
      if (!target.startsWith('.') && !target.startsWith('/')) {
        target = './' + target;
      }
      window.open(
        `/viewer/cesium_viewer.html?url=${encodeURIComponent(target + '/tileset.json')}`,
        '_blank'
      );
    });
  }

  // 6c. S2 Custom Viewer Button Logic
  const btnS2Viewer = document.getElementById('btnS2Viewer');
  if (btnS2Viewer) {
    btnS2Viewer.addEventListener('click', () => {
      const outDir = outputInput.value || 'tiles_out';
      let target = `/scripts/texture-pipeline/${outDir}`;
      target = target.replace(/\/+/g, '/'); // Remove double slashes

      // Assume Vite is running on localhost:5173 (standard dev port)
      window.open(
        `http://localhost:5173/src/apps/custom-viewer/custom-viewer.html?url=${encodeURIComponent(target)}`,
        '_blank'
      );
    });
  }

  // 7. Output Tab Switching (Terminal / Inspector)
  document.querySelectorAll('.output-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update Buttons
      document.querySelectorAll('.output-tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update Panels
      const targetId = btn.getAttribute('data-target');
      document.querySelectorAll('.output-tab-panel').forEach((panel) => {
        if (panel.id === targetId) {
          panel.style.display = 'block';
          panel.classList.add('active');
        } else {
          panel.style.display = 'none';
          panel.classList.remove('active');
        }
      });
    });
  });

  Logger.log('[SYSTEM] Ready.');
});
