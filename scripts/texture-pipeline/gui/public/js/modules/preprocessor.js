import { Logger } from './logger.js';

export const Preprocessor = {
  init() {
    // Preprocess Button
    const preprocessBtn = document.getElementById('preprocessBtn');
    if (preprocessBtn) preprocessBtn.addEventListener('click', () => this.runPreprocessor());

    // Preview Button
    const previewFacesBtn = document.getElementById('previewFacesBtn');
    if (previewFacesBtn) previewFacesBtn.addEventListener('click', () => this.runPreview());

    // Mode Toggle
    const preModeSelect = document.getElementById('pre_mode');
    if (preModeSelect) {
      preModeSelect.addEventListener('change', () => this.updateVisibility());
      this.updateVisibility();
    }
  },

  updateVisibility() {
    const preVertexOptions = document.getElementById('pre_vertex_options');
    if (preVertexOptions) preVertexOptions.style.display = 'block'; // Always show advanced
  },

  runPreprocessor() {
    const input = document.getElementById('pre_input_file').value;
    const outputPrefix = document.getElementById('pre_output_prefix').value;

    if (!input || !outputPrefix) {
      return Logger.log('[ERROR] Please specify both input file and output prefix.');
    }

    const params = new URLSearchParams({
      input: input,
      output_prefix: outputPrefix,
      max_zoom: document.getElementById('pre_max_zoom').value,
      tile_size: document.getElementById('pre_tile_size').value,
      compression: document.getElementById('pre_compression').value,
      predictor: document.getElementById('pre_predictor').value,
      warp_resampling: document.getElementById('pre_warp_resampling').value,
      overview_resampling: document.getElementById('pre_overview_resampling').value,
      mode: document.getElementById('pre_mode').value,
      cache_limit: document.getElementById('pre_memory').value,
      skip_faces: document.getElementById('pre_skip').value || 0,
      coord_mode: document.getElementById('pre_coord_mode').value,
      semi_major: document.getElementById('pre_semi_major').value,
      semi_minor: document.getElementById('pre_semi_minor').value,
      normalize: document.getElementById('pre_format').value,
      ssaa: document.getElementById('pre_ssaa').value || '1',
      ssaa_pole:
        document.getElementById('pre_ssaa_pole').value ||
        document.getElementById('pre_ssaa').value ||
        '1',
      max_zoom_pole:
        document.getElementById('pre_max_zoom_pole').value ||
        document.getElementById('pre_max_zoom').value,
    });

    if (document.getElementById('pre_debug').checked) params.append('debug', '1');

    Logger.log(`[SYSTEM] Starting S2 Preprocessing...`);
    Logger.log(`[INFO] Input: ${input}`);
    Logger.log(`[INFO] Output: ${outputPrefix}`);

    const es = new EventSource(`/api/preprocess-faces?${params}`);
    es.onmessage = (e) => Logger.log(e.data);
    es.onerror = () => {
      Logger.log('[SYSTEM] Preprocessing connection closed.');
      es.close();
    };
  },

  async runPreview() {
    const prefix = document.getElementById('pre_output_prefix').value;
    if (!prefix) return Logger.log('[ERROR] Please specify the output prefix first.');

    const btn = document.getElementById('previewFacesBtn');
    btn.disabled = true;
    Logger.log(`[SYSTEM] Generating S2 Face Preview...`);

    const es = new EventSource(`/api/preview-faces?prefix=${encodeURIComponent(prefix)}`);
    es.onmessage = (e) => Logger.log(e.data);
    es.onerror = () => {
      Logger.log('[SYSTEM] Preview generation finished.');
      es.close();
      btn.disabled = false;
    };
  },
};
