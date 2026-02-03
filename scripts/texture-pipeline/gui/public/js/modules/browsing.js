import { Logger } from './logger.js';

export const Browsing = {
  init() {
    document.querySelectorAll('.btn-browse').forEach((btn) => {
      btn.addEventListener('click', async () => this.handleBrowse(btn));
    });
  },

  async handleBrowse(btn) {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    const explicitType = btn.getAttribute('data-type');

    let filter = 'VRT/GeoTIFF (*.vrt;*.tif)|*.vrt;*.tif|All Files (*.*)|*.*';
    let type = explicitType || 'file';

    if (targetId === 'enrichment_texture') {
      filter = 'Images (*.png;*.jpg;*.tif)|*.png;*.jpg;*.jpeg;*.tif|All Files (*.*)|*.*';
    } else if (targetId === 'working_dir' || targetId === 'pre_output_prefix') {
      if (!explicitType) type = 'directory';
    } else if (targetId === 'dem_file' || targetId === 'color_file') {
      filter = 'VRT Dataset (*.vrt)|*.vrt|GeoTIFF (*.tif)|*.tif|All Files (*.*)|*.*';
    } else if (targetId === 'dl_file_list') {
      filter = 'URL List (*.txt)|*.txt|All Files (*.*)|*.*';
    }

    try {
      const res = await fetch(`/api/browse?type=${type}&filter=${encodeURIComponent(filter)}`);
      const data = await res.json();

      if (data.path) {
        input.value = data.path;

        // Auto-populate Output Prefix for Preprocessor
        if (targetId === 'pre_input_file') {
          const outputInput = document.getElementById('pre_output_prefix');
          const basePath = data.path.replace(/\.[^/.]+$/, '');
          outputInput.value = basePath;
          Logger.log(`[INFO] Auto-set Output Prefix to: ${basePath}`);
        }
      }
    } catch (e) {
      Logger.log(`[ERROR] Browse failed: ${e.message}`);
    }
  },
};
