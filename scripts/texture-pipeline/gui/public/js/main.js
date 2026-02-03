import { Logger } from './modules/logger.js';
import { ConfigManager } from './modules/config.js';
import { Runner } from './modules/runner.js';
import { Validation } from './modules/validation.js';
import { Preprocessor } from './modules/preprocessor.js';
import { Browsing } from './modules/browsing.js';
import { FileSystem } from './modules/filesystem.js';
import { Bodies } from './modules/bodies.js';
import { Downloader } from './modules/downloader.js';
import { VrtBuilder } from './modules/vrt_builder.js';
import { FixProjection } from './modules/fix_projection.js';
import { PreprocessorConfigManager } from './modules/preprocessor_config.js';

// Initialize Modules
document.addEventListener('DOMContentLoaded', () => {
  Logger.init();
  Logger.log('[SYSTEM] Initializing Modules...');

  const safeInit = (name, fn) => {
    try {
      fn();
    } catch (e) {
      Logger.log(`[ERROR] Failed to init ${name}: ${e.message}`);
      console.error(e);
    }
  };

  safeInit('ConfigManager', () => ConfigManager.init());
  safeInit('PreprocessorConfigManager', () => PreprocessorConfigManager.init());
  safeInit('Runner', () => Runner.init());
  safeInit('Validation', () => Validation.init());
  safeInit('Preprocessor', () => Preprocessor.init());
  safeInit('Browsing', () => Browsing.init());
  safeInit('FileSystem', () => FileSystem.init());
  safeInit('Bodies', () => Bodies.init());
  safeInit('Downloader', () => Downloader.init());
  safeInit('VrtBuilder', () => VrtBuilder.init());
  safeInit('FixProjection', () => FixProjection.init());

  // Viewer Buttons Logic (Simple enough to keep here or move to a Viewer module if it grows)
  const outputInput = document.getElementById('output');

  // 6. Viewer Button Logic
  // 6c. S2 Custom Viewer Button Logic
  const btnS2Viewer = document.getElementById('btnS2Viewer');
  if (btnS2Viewer) {
    btnS2Viewer.addEventListener('click', () => {
      // Use FULL URL to Backend (port 3001) to bypass Vite proxy issues.
      // CORS is enabled on server.js to allow this.
      const target = 'http://localhost:3001/viewer/content';

      // Assume Vite is running on localhost:5173 (standard dev port)
      window.open(
        `http://localhost:5173/scripts/texture-pipeline/s2-viewer/index.html?url=${encodeURIComponent(target)}`,
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
