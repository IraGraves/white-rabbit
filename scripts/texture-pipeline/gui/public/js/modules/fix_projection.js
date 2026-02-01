import { Logger } from './logger.js';

export const FixProjection = {
  init: () => {
    const runBtn = document.getElementById('fixProjRunBtn');
    if (!runBtn) return;

    runBtn.addEventListener('click', () => FixProjection.run());
  },

  run: () => {
    const btn = document.getElementById('fixProjRunBtn');
    const inputFile = document.getElementById('fix_proj_input').value;
    const outputFile = document.getElementById('fix_proj_output').value;

    if (!inputFile || !outputFile) {
      Logger.log('[ERROR] Input file and Output file are required.');
      return;
    }

    const params = new URLSearchParams();
    params.set('input', inputFile);
    params.set('output', outputFile);

    Logger.log(`[FIX] Starting Projection Fixer...`);
    Logger.log(`[FIX] Input: ${inputFile}`);
    Logger.log(`[FIX] Output: ${outputFile}`);

    btn.disabled = true;

    const eventSource = new EventSource(`/api/tools/fix_projection/run?${params.toString()}`);

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
