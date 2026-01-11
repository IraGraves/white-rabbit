const configForm = document.getElementById('configForm');
const loadBtn = document.getElementById('loadBtn');
const saveBtn = document.getElementById('saveBtn');
const runBtn = document.getElementById('runBtn');
const createDebugTextureBtn = document.getElementById('createDebugTextureBtn');
const fontSizeSelect = document.getElementById('fontSizeSelect');

// helper to log to terminal
if (clearTerminalBtn) {
  clearTerminalBtn.addEventListener('click', () => {
    terminal.innerHTML = '';
    log('[SYSTEM] Terminal cleared.');
  });
}

if (fontSizeSelect) {
  fontSizeSelect.addEventListener('change', () => {
    terminal.style.fontSize = fontSizeSelect.value;
  });
}

log('[SYSTEM] Ready.');

// Helper to log to terminal
function log(msg) {
  const isProgress = msg.startsWith('[PROGRESS]');
  const lastLine = terminal.lastElementChild;

  const formatLine = (text) => {
    // Automatically add timestamp if missing
    if (!text.match(/^\[[0-9: ]+\]/)) {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      text = `[${timeStr}] ${text}`;
    }

    // Match [Timestamp] [TAG] Message
    const fullMatch = text.match(/^(\[[0-9: ]+\])\s*\[([^\]]+)\]\s*(.*)/s);
    if (fullMatch) {
      const timestamp = fullMatch[1];
      const tag = fullMatch[2];
      const content = fullMatch[3];
      const tagClass = `tag-${tag.toLowerCase()}`;

      return `<span class="log-timestamp">${timestamp}</span><span class="log-tag ${tagClass}">[${tag}]</span><span class="log-msg">${content}</span>`;
    }
    // For lines without a tag (unlikely now with auto-timestamp, but keep for robustness)
    const fallbackMatch = text.match(/^(\[[0-9: ]+\])?\s*(.*)/s);
    if (fallbackMatch) {
      return `<span class="log-timestamp">${fallbackMatch[1] || ''}</span><span class="log-tag"></span><span class="log-msg">${fallbackMatch[2]}</span>`;
    }
    return `<span class="log-msg">${text}</span>`;
  };

  if (isProgress && lastLine && lastLine.dataset.type === 'progress') {
    lastLine.innerHTML = formatLine(msg);
  } else {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    if (isProgress) div.dataset.type = 'progress';
    div.innerHTML = formatLine(msg);
    terminal.appendChild(div);
  }
  terminal.scrollTop = terminal.scrollHeight;
}

const configInput = document.getElementById('config_name');
const enrichmentEnabledCheckbox = document.getElementById('enrichment_enabled');
const compressCheckbox = document.getElementById('compress');

// 1. Load Initial Config
async function loadConfig() {
  try {
    const configName = configInput.value || 'tiler_config';
    const res = await fetch(`/api/config?name=${configName}`);
    const data = await res.json();

    // Populate form
    // Clear previous values first? Or just overwrite.
    // We should probably reset the form if it is empty, but just overwriting is safer for now.
    for (const [key, value] of Object.entries(data)) {
      const el = configForm.elements[key];
      if (el && el.id !== 'config_name') {
        // Don't overwrite the config name itself
        if (el.type === 'checkbox') {
          el.checked = value;
        } else {
          el.value = value;
        }
      }
    }
    log(`[SYSTEM] Config '${configName}' loaded.`);
    updateEnrichmentFields();
    updateCompressionFields();
  } catch (e) {
    log(`[ERROR] Failed to load config: ${e.message}`);
  }
}

// 2. Get Form Data
function getFormData() {
  const formData = new FormData(configForm);
  const data = {};

  // Process standard inputs
  for (const [key, value] of formData.entries()) {
    if (key !== 'config_name') {
      // Don't save the config filename inside the config file
      data[key] = value;
    }
  }

  // Handle un-checked checkboxes (FormData doesn't include them)
  // And convert checked strings to booleans/numbers
  Array.from(configForm.elements).forEach((el) => {
    if (el.name && el.name !== 'config_name') {
      if (el.type === 'checkbox') {
        data[el.name] = el.checked;
      } else if (el.type === 'number') {
        if (el.value === '') {
          delete data[el.name]; // Remove empty optional numbers
        } else {
          // Parse as float if step contains a decimal point (0.1, 0.05, etc.), otherwise int
          const isFloat = el.step?.includes('.');
          data[el.name] = isFloat ? parseFloat(el.value) : parseInt(el.value);
        }
      } else if (el.value === '') {
        // Clean up empty strings
        delete data[el.name];
      }
    }
  });

  return data;
}

// 3. Save Logic
saveBtn.addEventListener('click', async () => {
  const data = getFormData();
  const configName = configInput.value || 'tiler_config';
  try {
    const res = await fetch(`/api/config?name=${configName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      log(`[SYSTEM] Config '${configName}' saved successfully.`);
    } else {
      log(`[ERROR] Save failed: ${result.error}`);
    }
  } catch (e) {
    log(`[ERROR] Save request failed: ${e.message}`);
  }
});

// 4. Run Logic (SSE)
runBtn.addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent submit
  // First save automatically
  saveBtn.click();

  log('[SYSTEM] Connecting to runner...');
  runBtn.disabled = true;

  const configName = configInput.value || 'tiler_config';
  const pythonCmd = document.getElementById('python_cmd').value || 'python';

  const params = new URLSearchParams();
  params.append('config', configName);
  params.append('cmd', pythonCmd);

  if (document.getElementById('explicit_tiling').checked) {
    params.append('explicit_tiling', 'true');
  }

  const projection = document.getElementById('projection').value;
  if (projection && projection !== 'equirectangular') {
    params.append('projection', projection);
  }

  // We use encodeURIComponent to safely pass potentially complex paths/args
  const eventSource = new EventSource(`/api/run?${params.toString()}`);

  eventSource.onmessage = (event) => {
    log(event.data);
  };

  eventSource.onerror = () => {
    log('[SYSTEM] Connection closed.');
    eventSource.close();
    runBtn.disabled = false;
  };
});

// 5. Load Logic
loadBtn.addEventListener('click', loadConfig);

// 6. Validate Button Logic
const validateBtn = document.getElementById('validateBtn');
validateBtn.addEventListener('click', () => {
  const outputDir = document.getElementById('output').value || 'tiles_out';
  const pythonCmd = document.getElementById('python_cmd').value || 'python';

  log('[SYSTEM] Starting validation...');

  const params = new URLSearchParams();
  params.append('output', outputDir);
  params.append('cmd', pythonCmd);

  const eventSource = new EventSource(`/api/validate?${params.toString()}`);

  eventSource.onmessage = (event) => {
    log(event.data);
  };

  eventSource.onerror = () => {
    log('[SYSTEM] Validation finished.');
    eventSource.close();
  };
});

// 6b. Official 3d-tiles-validator Button Logic
const validateOfficialBtn = document.getElementById('validateOfficialBtn');
validateOfficialBtn.addEventListener('click', () => {
  const outputDir = document.getElementById('output').value || 'tiles_out';

  log('[SYSTEM] Starting 3d-tiles-validator...');

  const params = new URLSearchParams();
  params.append('output', outputDir);

  const eventSource = new EventSource(`/api/validate-official?${params.toString()}`);

  eventSource.onmessage = (event) => {
    log(event.data);
  };

  eventSource.onerror = () => {
    log('[SYSTEM] 3d-tiles-validator finished.');
    eventSource.close();
  };
});

// 6c. Create Debug Texture Button Logic
if (createDebugTextureBtn) {
  createDebugTextureBtn.addEventListener('click', () => {
    log('[SYSTEM] Starting Create Debug Texture...');

    // Use the main Geometry section inputs
    const rx = document.getElementById('radius_x').value;
    const ry = document.getElementById('radius_y').value;
    const rz = document.getElementById('radius_z').value;
    const width = document.getElementById('debug_width').value;
    const pythonCmd = document.getElementById('python_cmd').value || 'python';

    const params = new URLSearchParams();
    if (rx) params.append('rx', rx);
    if (ry) params.append('ry', ry);
    if (rz) params.append('rz', rz);
    if (width) params.append('width', width);
    params.append('cmd', pythonCmd);

    const eventSource = new EventSource(`/api/create-debug-texture?${params.toString()}`);

    eventSource.onmessage = (event) => {
      log(event.data);
    };

    eventSource.onerror = () => {
      log('[SYSTEM] Create Debug Texture finished.');
      eventSource.close();
    };
  });
}

// 6d. Fix Metadata Button Logic
const fixMetadataBtn = document.getElementById('fixMetadataBtn');
if (fixMetadataBtn) {
  fixMetadataBtn.addEventListener('click', () => {
    const filePath = document.getElementById('fix_file_path').value;
    const pythonCmd = document.getElementById('python_cmd').value || 'python';

    if (!filePath) {
      log('[ERROR] Please select a file to fix.');
      return;
    }

    // Use the main Geometry section inputs
    const rx = document.getElementById('radius_x').value;
    const ry = document.getElementById('radius_y').value;
    const rz = document.getElementById('radius_z').value;

    if (!rx || !ry || !rz) {
      log('[ERROR] Radii not set in Geometry section.');
      return;
    }

    log(`[SYSTEM] Fixing metadata for: ${filePath}`);
    log(`[INFO] Applying Radii: ${rx}, ${ry}, ${rz}`);

    const params = new URLSearchParams();
    params.append('file', filePath);
    params.append('rx', rx);
    params.append('ry', ry);
    params.append('rz', rz);
    params.append('cmd', pythonCmd);

    const eventSource = new EventSource(`/api/fix-metadata?${params.toString()}`);

    eventSource.onmessage = (event) => {
      log(event.data);
    };

    eventSource.onerror = () => {
      log('[SYSTEM] Metadata correction finished.');
      eventSource.close();
    };
  });
}

// 7. Browse Button Logic
document.querySelectorAll('.btn-browse').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);

    // Use different filter for enrichment texture (images) vs DEM/color (GeoTIFF)
    let filter = 'GeoTIFF (*.tif)|*.tif|All Files (*.*)|*.*';
    if (targetId === 'enrichment_texture') {
      filter = 'Images (*.png;*.jpg;*.tif)|*.png;*.jpg;*.jpeg;*.tif|All Files (*.*)|*.*';
    }

    try {
      const res = await fetch(`/api/browse?filter=${encodeURIComponent(filter)}`);
      const data = await res.json();

      if (data.path) {
        input.value = data.path;
      }
    } catch (e) {
      log(`[ERROR] Browse failed: ${e.message}`);
    }
  });
});

// 6. Viewer Button Logic
const btnViewer = document.getElementById('btnViewer');
const outputInput = document.getElementById('output');

btnViewer.addEventListener('click', () => {
  const outDir = outputInput.value || 'tiles_out';
  let target = outDir;
  if (!target.startsWith('.') && !target.startsWith('/')) {
    target = './' + target;
  }
  window.open(`/viewer?url=${encodeURIComponent(target)}`, '_blank');
});

// 6b. Cesium Viewer Button Logic
const btnCesium = document.getElementById('btnCesium');

btnCesium.addEventListener('click', () => {
  const outDir = outputInput.value || 'tiles_out';
  let target = outDir;
  if (!target.startsWith('.') && !target.startsWith('/')) {
    target = './' + target;
  }
  window.open(
    `/viewer/cesium_viewer.html?url=${encodeURIComponent(target + '/tileset.json')}`,
    '_blank'
  );
});

// 7. Auto-Fill Body Radii
let knownBodies = {};

async function loadBodies() {
  try {
    const res = await fetch('/api/bodies');
    if (res.ok) {
      const data = await res.json();
      // Support both structures
      knownBodies = data.solar_system_bodies || data;
      log('[SYSTEM] Known bodies loaded.');
      if (bodyInput.value) {
        bodyInput.dispatchEvent(new Event('input'));
      }
    }
  } catch (e) {
    log(`[WARN] Could not load bodies: ${e.message}`);
  }
}

const bodyInput = document.getElementById('body');
bodyInput.addEventListener('input', () => {
  const name = bodyInput.value.toLowerCase().trim();
  if (knownBodies[name]) {
    const b = knownBodies[name];

    let rx, ry, rz;

    // Handle nested 'radii' dict or simple 'radius'
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
      log(`[INFO] Auto-filled radii for '${name}'`);
    }
  }
});

// 8. Tab Switching Logic
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    // Remove active from all tabs and panels
    document.querySelectorAll('.tab-btn').forEach((b) => {
      b.classList.remove('active');
    });
    document.querySelectorAll('.tab-panel').forEach((p) => {
      p.classList.remove('active');
    });

    // Activate clicked tab and corresponding panel
    btn.classList.add('active');
    const targetId = btn.getAttribute('data-tab');
    document.getElementById(targetId).classList.add('active');
  });
});

// 9. Enrichment Fields Toggle Logic
function updateEnrichmentFields() {
  if (!enrichmentEnabledCheckbox) return;
  const isEnabled = enrichmentEnabledCheckbox.checked;
  const section = document.getElementById('detail-mapping-section');
  if (!section) return;

  // Find all inputs, selects, and buttons inside the section EXCEPT the master checkbox itself
  const fields = section.querySelectorAll('input, select, button');
  fields.forEach((f) => {
    if (f !== enrichmentEnabledCheckbox) {
      f.disabled = !isEnabled;
      // Also dim the labels
      const label = section.querySelector(`label[for="${f.id}"]`);
      if (label) {
        label.style.opacity = isEnabled ? '1' : '0.5';
      }
    }
  });
}

if (enrichmentEnabledCheckbox) {
  enrichmentEnabledCheckbox.addEventListener('change', updateEnrichmentFields);
}

// 10. Compression Fields Toggle Logic
function updateCompressionFields() {
  if (!compressCheckbox) return;
  const isEnabled = compressCheckbox.checked;
  const section = document.getElementById('compression-section');
  if (!section) return;

  const fields = section.querySelectorAll('input, select, button');
  fields.forEach((f) => {
    if (f !== compressCheckbox) {
      f.disabled = !isEnabled;
      const label = section.querySelector(`label[for="${f.id}"]`);
      if (label) {
        label.style.opacity = isEnabled ? '1' : '0.5';
      }
    }
  });
}

if (compressCheckbox) {
  compressCheckbox.addEventListener('change', updateCompressionFields);
}

// Init
loadConfig().then(() => {
  updateEnrichmentFields();
  updateCompressionFields();
});
loadBodies();
