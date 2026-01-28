import { Logger } from '../utils/logger.js';

export const Bodies = {
  data: null,
  currentBodyKey: null,

  init() {
    this.listEl = document.getElementById('bodiesList');
    this.form = document.getElementById('bodyForm');
    this.editorPlaceholder = document.getElementById('bodyEditorPlaceholder');
    this.searchInput = document.getElementById('bodySearch');
    this.addBtn = document.getElementById('addBodyBtn');
    this.deleteBtn = document.getElementById('deleteBodyBtn');

    if (this.addBtn) {
      this.addBtn.addEventListener('click', () => this.createNew());
    }

    if (this.deleteBtn) {
      this.deleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete '${this.currentBodyKey}'?`)) {
          this.deleteBody(this.currentBodyKey);
        }
      });
    }

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => this.filterList(e.target.value));
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.save();
      });
    }

    // Load initial data
    this.load();
  },

  async load() {
    try {
      const res = await fetch('/api/bodies');
      if (!res.ok) throw new Error('Failed to load bodies.json');
      this.data = await res.json();
      this.renderList();
    } catch (e) {
      Logger.error(`Bodies load error: ${e.message}`);
      if (this.listEl)
        this.listEl.innerHTML = `<li style="color:red; padding:0.5rem;">Error: ${e.message}</li>`;
    }
  },

  renderList(filter = '') {
    if (!this.data || !this.data.solar_system_bodies) return;

    this.listEl.innerHTML = '';
    const bodies = this.data.solar_system_bodies;
    const keys = Object.keys(bodies).sort();

    keys.forEach((key) => {
      if (filter && !key.toLowerCase().includes(filter.toLowerCase())) return;

      const li = document.createElement('li');
      li.textContent = key;
      li.style.padding = '0.5rem';
      li.style.cursor = 'pointer';
      li.style.borderBottom = '1px solid #333';

      if (key === this.currentBodyKey) {
        li.style.background = '#007acc';
        li.style.color = 'white';
      } else {
        li.style.color = '#ccc';
        li.addEventListener('mouseover', () => {
          if (key !== this.currentBodyKey) li.style.background = '#222';
        });
        li.addEventListener('mouseout', () => {
          if (key !== this.currentBodyKey) li.style.background = 'transparent';
        });
      }

      li.addEventListener('click', () => this.selectBody(key));
      this.listEl.appendChild(li);
    });
  },

  filterList(val) {
    this.renderList(val);
  },

  selectBody(key) {
    this.currentBodyKey = key;
    this.renderList(this.searchInput ? this.searchInput.value : '');

    this.form.style.display = 'block';
    this.editorPlaceholder.style.display = 'none';

    const body = this.data.solar_system_bodies[key];

    document.getElementById('bodyOriginalName').value = key;
    document.getElementById('bodyNameInput').value = key;
    // Prevent renaming existing keys easily to avoid confusion, or handle it as delete+create.
    // For now allow rename implying key change.

    document.getElementById('bodyRadiusX').value = body.radii.x;
    document.getElementById('bodyRadiusY').value = body.radii.y;
    document.getElementById('bodyRadiusZ').value = body.radii.z;

    document.getElementById('bodyRoughness').value = body.texture.roughness;
    document.getElementById('bodyMetallic').value = body.texture.metallic;

    document.getElementById('bodyComment').value = body.comment || '';
  },

  createNew() {
    this.currentBodyKey = null;
    this.renderList(this.searchInput ? this.searchInput.value : '');

    this.form.style.display = 'block';
    this.editorPlaceholder.style.display = 'none';
    this.form.reset();
    document.getElementById('bodyOriginalName').value = '';

    // Defaults
    document.getElementById('bodyRadiusX').value = 100000;
    document.getElementById('bodyRadiusY').value = 100000;
    document.getElementById('bodyRadiusZ').value = 100000;
    document.getElementById('bodyRoughness').value = 0.9;
    document.getElementById('bodyMetallic').value = 0.0;
  },

  async save() {
    if (!this.data) return;

    const newKey = document.getElementById('bodyNameInput').value.trim();
    const oldKey = document.getElementById('bodyOriginalName').value;

    if (!newKey) {
      alert('Body Name is required');
      return;
    }

    const newBody = {
      radii: {
        x: parseFloat(document.getElementById('bodyRadiusX').value),
        y: parseFloat(document.getElementById('bodyRadiusY').value),
        z: parseFloat(document.getElementById('bodyRadiusZ').value),
      },
      texture: {
        roughness: parseFloat(document.getElementById('bodyRoughness').value),
        metallic: parseFloat(document.getElementById('bodyMetallic').value),
      },
      comment: document.getElementById('bodyComment').value,
    };

    // Check key collision if renaming or new
    if (newKey !== oldKey && this.data.solar_system_bodies[newKey]) {
      if (!confirm(`Body '${newKey}' already exists. Overwrite?`)) return;
    }

    // If renaming, delete old
    if (oldKey && newKey !== oldKey) {
      delete this.data.solar_system_bodies[oldKey];
    }

    this.data.solar_system_bodies[newKey] = newBody;

    try {
      const res = await fetch('/api/bodies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data),
      });

      if (!res.ok) throw new Error('Save failed');

      Logger.log(`[BODIES] Saved ${newKey}`);
      this.currentBodyKey = newKey;
      this.load(); // Reload to refresh list and confirming persistence
    } catch (e) {
      Logger.error(`Save error: ${e.message}`);
      alert(`Error saving: ${e.message}`);
    }
  },

  async deleteBody(key) {
    if (!this.data) return;

    delete this.data.solar_system_bodies[key];

    try {
      const res = await fetch('/api/bodies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data),
      });

      if (!res.ok) throw new Error('Delete failed');

      Logger.log(`[BODIES] Deleted ${key}`);
      this.currentBodyKey = null;
      this.form.style.display = 'none';
      this.editorPlaceholder.style.display = 'block';
      this.load();
    } catch (e) {
      Logger.error(`Delete error: ${e.message}`);
      alert(`Error deleting: ${e.message}`);
    }
  },
};
