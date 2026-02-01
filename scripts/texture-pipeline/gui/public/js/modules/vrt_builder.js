import { Logger } from './logger.js';

export const VrtBuilder = {
  init: () => {
    const runBtn = document.getElementById('vrt_runBtn');
    if (!runBtn) return;

    runBtn.addEventListener('click', () => VrtBuilder.run());
  },

  run: () => {
    const btn = document.getElementById('vrt_runBtn');
    const inputDir = document.getElementById('vrt_input').value;
    let outputFile = document.getElementById('vrt_output').value;
    const pattern = document.getElementById('vrt_pattern').value || '*.tif';
    const relative = document.getElementById('vrt_relative').checked;

    if (!inputDir || !outputFile) {
      Logger.log('[ERROR] Input directory and output file are required.');
      return;
    }

    if (!outputFile.toLowerCase().endsWith('.vrt')) {
      outputFile += '.vrt';
    }

    const params = new URLSearchParams();
    params.set('input_dir', inputDir);
    params.set('output', outputFile);
    params.set('pattern', pattern);
    params.set('relative', relative);

    Logger.log(`[VRT] Building ${outputFile}...`);
    btn.disabled = true;

    const eventSource = new EventSource(`/api/tools/build_vrt/run?${params.toString()}`);

    eventSource.onmessage = (event) => {
      const msg = event.data;
      if (msg.startsWith('[EXIT]')) {
        Logger.log(msg);
        eventSource.close();
        btn.disabled = false;
      } else {
        Logger.log(msg);
      }
    };

    eventSource.onerror = (err) => {
      Logger.log('[ERROR] Connection lost.');
      eventSource.close();
      btn.disabled = false;
    };
  },
};
