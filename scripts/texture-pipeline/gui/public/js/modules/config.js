import { Logger } from './logger.js';

export const ConfigManager = {
  form: document.getElementById('configForm'),
  configInput: document.getElementById('config_name'),
  enrichmentEnabledCheckbox: document.getElementById('enrichment_enabled'),
  currentBodies: {},

  init() {
    const loadBtn = document.getElementById('loadBtn');
    const saveBtn = document.getElementById('saveBtn');

    if (loadBtn) loadBtn.addEventListener('click', () => this.loadConfig());
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveConfig());

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
          } else {
            el.value = value;
          }
        }
      }
      Logger.log(`[SYSTEM] Config '${configName}' loaded.`);
      this.updateEnrichmentFields();
    } catch (e) {
      Logger.log(`[ERROR] Failed to load config: ${e.message}`);
    }
  },

  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      if (key !== 'config_name') data[key] = value;
    }

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
