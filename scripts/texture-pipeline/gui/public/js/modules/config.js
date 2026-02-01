import { Logger } from './logger.js';

export const ConfigManager = {
  form: document.getElementById('configForm'),
  configInput: document.getElementById('config_name'),
  enrichmentEnabledCheckbox: document.getElementById('enrichment_enabled'),
  addTextureBtn: document.getElementById('addTextureBtn'),
  textureTableBody: document.getElementById('textureTableBody'),
  currentBodies: {},

  init() {
    const loadBtn = document.getElementById('loadBtn');
    const saveBtn = document.getElementById('saveBtn');

    if (loadBtn) loadBtn.addEventListener('click', () => this.loadConfig());
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveConfig());

    // Texture Table Logic
    if (this.addTextureBtn) {
      this.addTextureBtn.addEventListener('click', () => this.addTextureRow('new_tex', '', 512));
    }

    // Enrichment Toggle
    if (this.enrichmentEnabledCheckbox) {
      this.enrichmentEnabledCheckbox.addEventListener('change', () =>
        this.updateEnrichmentFields()
      );
      this.updateEnrichmentFields(); // Init
    }

    // Body Auto-Complete
    const bodyInput = document.getElementById('body');
    if (bodyInput) {
      this.loadBodies();
      bodyInput.addEventListener('input', () => this.handleBodyInput(bodyInput));
    }

    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
      });
    });

    // Auto-load config
    this.loadConfig();
  },

  addTextureRow(name = '', path = '', size = 512) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="tex-name" value="${name}" placeholder="e.g. color"></td>
        <td>
            <div class="input-group">
                <input type="text" class="tex-path" value="${path}" placeholder="Path to VRT/TIF">
                <button type="button" class="btn-browse-row" data-type="file">Browse</button>
            </div>
        </td>
        <td>
            <select class="tex-size">
                <option value="64" ${size == 64 ? 'selected' : ''}>64</option>
                <option value="128" ${size == 128 ? 'selected' : ''}>128</option>
                <option value="256" ${size == 256 ? 'selected' : ''}>256</option>
                <option value="512" ${size == 512 ? 'selected' : ''}>512</option>
                <option value="1024" ${size == 1024 ? 'selected' : ''}>1024</option>
                <option value="2048" ${size == 2048 ? 'selected' : ''}>2048</option>
            </select>
        </td>
        <td><button type="button" class="btn-remove-row">X</button></td>
      `;

    tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());

    // Wire up Browse Button
    const pathInput = tr.querySelector('.tex-path');
    const uniqueId = 'tex_' + Math.random().toString(36).substr(2, 9);
    pathInput.id = uniqueId;

    // We import Browsing dynamically to avoid circular dependency issues if implicit,
    // but since they are modules, static import is better if possible.
    // However, ConfigManager is imported by Main, and Browsing is imported by Main.
    // Let's rely on dynamic import or assume global availability if attached to window?
    // No, modules are scoped.
    // Valid approach: Import Browsing at top of file.

    const browseBtn = tr.querySelector('.btn-browse-row');
    browseBtn.dataset.target = uniqueId;
    browseBtn.classList.add('btn-browse'); // Style

    // Use Browsing module logic
    browseBtn.addEventListener('click', () => {
      import('./browsing.js').then((module) => {
        module.Browsing.handleBrowse(browseBtn);
      });
    });

    this.textureTableBody.appendChild(tr);
  },

  serializeTextureTable() {
    if (!this.textureTableBody) return [];
    const rows = Array.from(this.textureTableBody.querySelectorAll('tr'));
    return rows
      .map((tr) => ({
        name: tr.querySelector('.tex-name').value.trim(),
        path: tr.querySelector('.tex-path').value.trim(),
        size: parseInt(tr.querySelector('.tex-size').value),
      }))
      .filter((t) => t.name && t.path);
  },

  async loadConfig() {
    try {
      const configName = this.configInput.value || 'tiler_config';
      const res = await fetch(`/api/config?name=${configName}`);
      const data = await res.json();

      for (const [key, value] of Object.entries(data)) {
        const el = this.form.elements[key];
        if (el && el.id !== 'config_name') {
          if (el.type === 'checkbox') {
            el.checked = value;
          } else if (el.type !== 'file') {
            el.value = value;
          }
        }
      }

      // Populate Textures
      if (this.textureTableBody) {
        this.textureTableBody.innerHTML = '';
        if (data.extra_textures) {
          let textures = data.extra_textures;
          if (typeof textures === 'string') {
            try {
              textures = JSON.parse(textures);
            } catch (e) {}
          }
          if (Array.isArray(textures)) {
            textures.forEach((t) => this.addTextureRow(t.name, t.path, t.size));
          }
        } else if (data.color_file) {
          this.addTextureRow('color', data.color_file, data.texture_size || 512);
        } else {
          this.addTextureRow('color', '', 512);
        }
      }

      Logger.log(`[SYSTEM] Config '${configName}' loaded.`);
      this.updateEnrichmentFields();

      // Sync Output Dir (View Content Root)
      // Use the value now present in the input (populated or default)
      const outDir = this.form.elements['output']
        ? this.form.elements['output'].value
        : 'tiles_out';
      this.syncContentPath(outDir);
    } catch (e) {
      Logger.log(`[ERROR] Failed to load config: ${e.message}`);
    }
  },

  async syncContentPath(path) {
    try {
      await fetch('/api/set_content_path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: path }),
      });
      console.log(`[SYSTEM] Synced content path: ${path}`);
    } catch (e) {
      console.error('Failed to sync content path', e);
    }
  },

  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      if (key !== 'config_name') data[key] = value;
    }

    // Include Textures
    data['extra_textures'] = this.serializeTextureTable();

    // Handle checkboxes and numbers manually since FormData skips unchecked boxes
    Array.from(this.form.elements).forEach((el) => {
      if (el.name && el.name !== 'config_name') {
        if (el.type === 'checkbox') {
          data[el.name] = el.checked;
        } else if (el.type === 'number' || el.tagName === 'SELECT') {
          if (el.value === '') {
            delete data[el.name];
          } else {
            const val = el.value;
            const num = parseFloat(val);
            if (!Number.isNaN(num) && val.trim() !== '') {
              const isFloat = el.step?.includes('.') || val.includes('.');
              data[el.name] = isFloat ? num : Math.floor(num);
            } else {
              data[el.name] = val;
            }
          }
        } else if (el.value === '') {
          delete data[el.name];
        }
      }
    });
    return data;
  },

  async saveConfig() {
    const data = this.getFormData();
    const configName = this.configInput.value || 'tiler_config';
    try {
      const res = await fetch(`/api/config?name=${configName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        Logger.log(`[SYSTEM] Config '${configName}' saved successfully.`);
      } else {
        Logger.log(`[ERROR] Save failed: ${result.error}`);
      }
    } catch (e) {
      Logger.log(`[ERROR] Save request failed: ${e.message}`);
    }
  },

  updateEnrichmentFields() {
    if (!this.enrichmentEnabledCheckbox) return;
    const isEnabled = this.enrichmentEnabledCheckbox.checked;
    const section = document.getElementById('detail-mapping-section');
    if (!section) return;

    section.querySelectorAll('input, select, button').forEach((f) => {
      if (f !== this.enrichmentEnabledCheckbox) {
        f.disabled = !isEnabled;
      }
    });
  },

  async loadBodies() {
    try {
      const res = await fetch('/api/bodies');
      if (res.ok) {
        const data = await res.json();
        this.currentBodies = data.solar_system_bodies || data;
        Logger.log('[SYSTEM] Known bodies loaded.');
      }
    } catch (e) {
      Logger.log(`[WARN] Could not load bodies: ${e.message}`);
    }
  },

  handleBodyInput(input) {
    const name = input.value.toLowerCase().trim();
    if (this.currentBodies[name]) {
      const b = this.currentBodies[name];
      let rx, ry, rz;

      if (b.radii && typeof b.radii === 'object') {
        rx = b.radii.x;
        ry = b.radii.y || rx;
        rz = b.radii.z || rx;
      } else if (b.radius) {
        rx = ry = rz = b.radius;
      }

      if (rx) {
        document.getElementById('radius_x').value = rx;
        document.getElementById('radius_y').value = ry;
        document.getElementById('radius_z').value = rz;

        // Also update conv fields if they exist (though simplified in this refactor)
        const convMajor = document.getElementById('conv_semi_major');
        const convMinor = document.getElementById('conv_semi_minor');
        if (convMajor) convMajor.value = rx;
        if (convMinor) convMinor.value = rz;

        Logger.log(`[INFO] Auto-filled radii for '${name}'`);
      }
    }
  },
};
