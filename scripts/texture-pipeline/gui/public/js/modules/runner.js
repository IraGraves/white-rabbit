import { Logger } from './logger.js';
import { ConfigManager } from './config.js';

export const Runner = {
  activeEventSource: null,
  runBtn: document.getElementById('runBtn'),
  stopBtn: document.getElementById('stopBtn'),

  init() {
    if (this.runBtn) this.runBtn.addEventListener('click', (e) => this.startRun(e));

    if (this.stopBtn) {
      this.stopBtn.addEventListener('click', async () => {
        Logger.log('[SYSTEM] Requesting stop...');
        try {
          await fetch('/api/stop');
        } catch (e) {
          Logger.log(`[ERROR] Stop request failed: ${e.message}`);
        }
      });
    }
  },

  async startRun(e) {
    e.preventDefault();

    // Auto-save before run
    await ConfigManager.saveConfig();

    Logger.log('[SYSTEM] Connecting to runner...');
    this.runBtn.disabled = true;
    if (this.stopBtn) this.stopBtn.style.display = 'inline-block';

    const configName = document.getElementById('config_name').value || 'tiler_config';
    const pythonCmd = document.getElementById('python_cmd').value || 'python';

    const params = new URLSearchParams();
    params.append('config', configName);
    params.append('cmd', pythonCmd);

    // Explicit Checkboxes not in config file but are run args
    if (document.getElementById('skirts').checked) params.append('skirts', 'true');
    params.append('projection', 's2'); // Default
    if (document.getElementById('planetocentric').value === 'true')
      params.append('planetocentric', 'true');
    if (document.getElementById('use_shm').checked) params.append('use_shm', 'true');
    if (document.getElementById('bake_metadata').checked) params.append('bake_metadata', 'true');

    const maxZoomPole = document.getElementById('max_zoom_pole').value;
    if (maxZoomPole) params.append('max_zoom_pole', maxZoomPole);

    const workingDir = document.getElementById('working_dir').value.trim();
    if (workingDir) params.append('working_dir', workingDir);

    if (document.getElementById('tile_format').value === 'proprietary') {
      params.append('heightmap_mode', 'true');
    }

    // KTX2 Params handled via config mostly? The original app.js appends them to params.
    // Let's replicate original behavior for safety.
    const ktx2Mode = document.getElementById('ktx2_mode').value;
    params.append('ktx2_mode', ktx2Mode);
    // ... (Other ktx2 params are optional in original, we can skip complex logic if config handles it,
    // IF the server execution route reads them from CLI args.
    // The original execution logic in `execution.js` (refactored) didn't explicitly unpack KTX2 args
    // to pass to python, it relied on config.
    // WAIT: The original `app.js` DID append them to params, but `server.js` (old and new)
    // does NOT look for them in `req.query` to pass to args.
    // So the original UI code was appending params that the server ignored?
    // Let's re-read execution.js.
    // `execution.js`: only checks skirts, planetocentric, use_shm, working_dir, bake_metadata, max_zoom_pole, heightmap_mode.
    // It does NOT check `ktx2_mode` etc.
    // So the KTX2 params in `app.js` were effectively dead code for the Execute call,
    // OR the python script reads the saved config file, which ConfigManager just saved.
    // Correct: Python reads the JSON config. The params passed to `activeEventSource` are likely irrelevant
    // except for the ones strictly overriding config (like flags).
    // So I can simulate that safely.

    this.activeEventSource = new EventSource(`/api/run?${params.toString()}`);

    this.activeEventSource.onmessage = (event) => Logger.log(event.data);

    this.activeEventSource.onerror = () => {
      Logger.log('[SYSTEM] Connection closed.');
      this.activeEventSource.close();
      this.activeEventSource = null;
      this.runBtn.disabled = false;
      if (this.stopBtn) this.stopBtn.style.display = 'none';
    };
  },
};
