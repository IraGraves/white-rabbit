import { Logger } from './logger.js';

export const Downloader = {
  init: () => {
    const runBtn = document.getElementById('dl_runBtn');
    if (!runBtn) return; // Module inactive if UI not present

    // Tab Switching
    const tabs = document.querySelectorAll('.dl-tab-btn');
    tabs.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // Active State
        tabs.forEach((t) => t.classList.remove('active'));
        e.target.classList.add('active');

        // Show/Hide Panels
        const mode = e.target.getAttribute('data-mode');
        document.getElementById('dl_mode_hips').style.display = mode === 'hips' ? 'block' : 'none';
        document.getElementById('dl_mode_batch').style.display =
          mode === 'batch' ? 'block' : 'none';

        // Update hidden input or state
        runBtn.setAttribute('data-mode', mode);
      });
    });

    // Run Button
    runBtn.addEventListener('click', () => {
      Downloader.run();
    });
  },

  run: () => {
    const btn = document.getElementById('dl_runBtn');
    const mode = btn.getAttribute('data-mode') || 'hips';
    const outputDir = document.getElementById('dl_output').value;

    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('output', outputDir);
    params.set('workers', document.getElementById('dl_workers').value);

    // Mode Specifics
    if (mode === 'hips') {
      params.set('hips_url', document.getElementById('dl_hips_url').value);
      params.set('hips_id', document.getElementById('dl_hips_id').value);
      params.set('cols', document.getElementById('dl_tiles_x').value); // TODO: check if backend uses cols or tiles_x? Helper says tiles_x
      // Wait, backend expects tiles_x. let's fix that naming consistency in passing
      params.set('tiles_x', document.getElementById('dl_tiles_x').value);
      params.set('tiles_y', document.getElementById('dl_tiles_y').value);

      const fullW = document.getElementById('dl_full_width').value;
      const fullH = document.getElementById('dl_full_height').value;
      const tileW = document.getElementById('dl_width').value;
      const tileH = document.getElementById('dl_height').value;

      if (fullW && fullH) {
        params.set('full_width', fullW);
        params.set('full_height', fullH);
      } else {
        params.set('width', tileW || 1024);
        params.set('height', tileH || 1024);
      }

      const prefix = document.getElementById('dl_prefix').value;
      if (prefix) params.set('prefix', prefix);
    } else {
      const fileList = document.getElementById('dl_file_list').value;
      params.set('file_list', fileList);
    }

    Logger.log(`[DOWNLOADER] Starting ${mode} download...`);
    btn.disabled = true;

    // Use EventSource for streaming progress
    const eventSource = new EventSource(`/api/tools/download/run?${params.toString()}`);

    eventSource.onmessage = (event) => {
      // Logger automatically handles [INFO], [ERROR] prefixes if they are just strings?
      // The server sends raw strings prefixed.
      // Let's assume Logger.log handles string input well.

      const msg = event.data;
      if (msg.startsWith('[EXIT]')) {
        Logger.log(msg);
        eventSource.close();
        btn.disabled = false;
      } else {
        Logger.log(msg); // Will stream INFO/progress to terminal
      }
    };

    eventSource.onerror = (err) => {
      Logger.log('[ERROR] Connection lost.');
      eventSource.close();
      btn.disabled = false;
    };
  },
};
