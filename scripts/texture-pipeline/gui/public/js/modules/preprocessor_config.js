import { Logger } from './logger.js';

export const PreprocessorConfigManager = {
  configInput: null,
  loadBtn: null,
  saveBtn: null,

  // Prefix for all preprocessor fields in DOM
  PREFIX: 'pre_',

  init() {
    this.configInput = document.getElementById('pre_config_name');
    this.loadBtn = document.getElementById('preLoadBtn');
    this.saveBtn = document.getElementById('preSaveBtn');

    if (this.loadBtn) this.loadBtn.addEventListener('click', () => this.loadConfig());
    if (this.saveBtn) this.saveBtn.addEventListener('click', () => this.saveConfig());

    // Optional: Load default 'preprocessor_default' if available?
    // Let's not auto-load to avoid overwriting user inputs on refresh if they don't want it.
    // Or maybe load 'last_run'?
  },

  // Collects all inputs starting with 'pre_'
  getData() {
    const data = {};
    const inputs = document.querySelectorAll(`[id^="${this.PREFIX}"]`);

    inputs.forEach((el) => {
      if (el.id === 'pre_config_name') return; // Skip the config name itself

      // Handle different input types
      if (el.type === 'checkbox') {
        data[el.id] = el.checked;
      } else if (el.type === 'number') {
        data[el.id] = el.value === '' ? null : parseFloat(el.value);
      } else {
        data[el.id] = el.value;
      }
    });

    return data;
  },

  applyData(data) {
    for (const [id, value] of Object.entries(data)) {
      const el = document.getElementById(id);
      if (el) {
        if (el.type === 'checkbox') {
          el.checked = !!value;
        } else {
          el.value = value === null ? '' : value;
        }
      }
    }
  },

  async saveConfig() {
    const name = this.configInput.value.trim();
    if (!name) {
      Logger.log('[WARN] Please enter a configuration name to save.');
      return;
    }

    const data = this.getData();

    try {
      const res = await fetch(`/api/config?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        Logger.log(`[SYSTEM] Preprocessor config '${name}' saved.`);
      } else {
        Logger.log(`[ERROR] Failed to save config: ${result.error}`);
      }
    } catch (e) {
      Logger.log(`[ERROR] Save request failed: ${e.message}`);
    }
  },

  async loadConfig() {
    const name = this.configInput.value.trim();
    if (!name) {
      Logger.log('[WARN] Please enter a configuration name to load.');
      return;
    }

    try {
      const res = await fetch(`/api/config?name=${encodeURIComponent(name)}`);
      const data = await res.json();

      if (Object.keys(data).length === 0) {
        Logger.log(`[WARN] Config '${name}' not found or empty.`);
        return;
      }

      this.applyData(data);
      Logger.log(`[SYSTEM] Preprocessor config '${name}' loaded.`);
    } catch (e) {
      Logger.log(`[ERROR] Load request failed: ${e.message}`);
    }
  },
};
