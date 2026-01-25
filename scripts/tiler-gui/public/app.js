const configForm = document.getElementById('configForm');
const loadBtn = document.getElementById('loadBtn');
const saveBtn = document.getElementById('saveBtn');
const runBtn = document.getElementById('runBtn');
const createDebugTextureBtn = document.getElementById('createDebugTextureBtn');
const terminal = document.getElementById('terminal');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const clearTerminalBtn = document.getElementById('clearTerminalBtn');

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
// Helper to log to terminal or specific target
// Helper to log to terminal or specific target
function log(msg, targetId = null) {
  if (!msg || !msg.trim()) return;

  // If target specified, log there
  if (targetId) {
    const target = document.getElementById(targetId);
    if (target) {
      const div = document.createElement('div');
      div.textContent = msg;
      target.appendChild(div);
      target.scrollTop = target.scrollHeight;
    }
    // Continue to mirror to main terminal
  }

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

    const fallbackMatch = text.match(/^(\[[0-9: ]+\])?\s*(.*)/s);
    if (fallbackMatch) {
      return `<span class="log-timestamp">${fallbackMatch[1] || ''}</span><span class="log-tag"></span><span class="log-msg">${fallbackMatch[2]}</span>`;
    }
    return `<span class="log-msg">${text}</span>`;
  };

  const formattedHTML = formatLine(msg);

  if (isProgress && lastLine && lastLine.dataset.type === 'progress') {
    // If the previous line was progress, replace it with this new progress line
    // BUT only if they "look" related? For now, user requested "overwrite previous progress".
    // Simple replacement is what's requested.
    lastLine.innerHTML = formattedHTML;

    // If it's 100% or Success/Finished, maybe we change type so next line doesn't overwrite it?
    // But usually we want 100% to stay, and next line (INFO/SUCCESS) to be new.
    if (msg.includes('100%') || msg.includes('complete') || msg.includes('Success')) {
      lastLine.dataset.type = 'finished';
    }
  } else {
    // New line needed
    // Special check: If previous line was progress, and this is NOT progress,
    // we just append. That's fine.

    const div = document.createElement('div');
    div.className = 'terminal-line';
    if (isProgress) div.dataset.type = 'progress';
    div.innerHTML = formattedHTML;
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
      } else if (el.type === 'number' || el.tagName === 'SELECT') {
        if (el.value === '') {
          delete data[el.name];
        } else {
          // Attempt numeric conversion for numbers and selects with numeric values
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
let activeEventSource = null; // Track event source to close it on stop

runBtn.addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent submit
  // First save automatically
  saveBtn.click();

  log('[SYSTEM] Connecting to runner...');
  runBtn.disabled = true;
  if (stopBtn) stopBtn.style.display = 'inline-block';

  const configName = configInput.value || 'tiler_config';
  const pythonCmd = document.getElementById('python_cmd').value || 'python';

  const params = new URLSearchParams();
  params.append('config', configName);
  params.append('cmd', pythonCmd);

  if (document.getElementById('skirts').checked) {
    params.append('skirts', 'true');
  }

  // Always use S2 Projection defaults
  params.append('projection', 's2');

  if (document.getElementById('planetocentric').value === 'true') {
    params.append('planetocentric', 'true');
  }

  if (document.getElementById('use_shm').checked) {
    params.append('use_shm', 'true');
  }

  if (document.getElementById('bake_metadata').checked) {
    params.append('bake_metadata', 'true');
  }

  const maxZoomPole = document.getElementById('max_zoom_pole').value;
  if (maxZoomPole) {
    params.append('max_zoom_pole', maxZoomPole);
  }

  const workingDir = document.getElementById('working_dir').value.trim();
  if (workingDir) {
    params.append('working_dir', workingDir);
  }

  // KTX2 Advanced Params
  const ktx2Mode = document.getElementById('ktx2_mode').value;
  params.append('ktx2_mode', ktx2Mode);
  if (ktx2Mode === 'etc1s') {
    params.append('ktx2_quality', document.getElementById('ktx2_quality').value);
    params.append('ktx2_compression', document.getElementById('ktx2_compression').value);
  } else {
    params.append('ktx2_uastc_quality', document.getElementById('ktx2_uastc_quality').value);
    params.append('ktx2_zstd', document.getElementById('ktx2_zstd').value);
  }

  if (document.getElementById('tile_format').value === 'proprietary') {
    params.append('heightmap_mode', 'true');
  }

  // We use encodeURIComponent to safely pass potentially complex paths/args
  activeEventSource = new EventSource(`/api/run?${params.toString()}`);

  activeEventSource.onmessage = (event) => {
    log(event.data);
  };

  activeEventSource.onerror = () => {
    log('[SYSTEM] Connection closed.');
    activeEventSource.close();
    activeEventSource = null;
    runBtn.disabled = false;
    if (stopBtn) stopBtn.style.display = 'none';
  };
});

// Stop Execution Logic
const stopBtn = document.getElementById('stopBtn');
if (stopBtn) {
  stopBtn.addEventListener('click', async () => {
    log('[SYSTEM] Requesting stop...');
    try {
      await fetch('/api/stop');
      // The server will kill the process, which closes the SSE, triggering onerror above
    } catch (e) {
      log(`[ERROR] Stop request failed: ${e.message}`);
    }
  });
}

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

// 6e. GeoTIFF Optimizer Button Logic
// 6e. GeoTIFF Optimizer Button Logic
const optimizeBtn = document.getElementById('optimizeBtn');
if (optimizeBtn) {
  optimizeBtn.addEventListener('click', () => {
    // --- DEBUG START ---
    const inputElem = document.getElementById('opt_input_file');
    const filePath = inputElem ? inputElem.value : '';
    console.log('Optimize Clicked. Input Element:', inputElem);
    console.log('Optimize Clicked. File Path Value:', filePath);
    // --- DEBUG END ---

    const compress = document.getElementById('opt_compression').value;
    const replace = document.getElementById('opt_replace').checked;
    const outputDiv = document.getElementById('optimizeOutput');

    if (outputDiv) {
      outputDiv.style.display = 'block';
      outputDiv.innerHTML = ''; // Clear previous
    }

    if (!filePath) {
      log('[ERROR] Please select a source file.', 'optimizeOutput');
      // Extra debug info for user
      log(`[DEBUG] Internal Check: opt_input_file found? ${!!inputElem}`, 'optimizeOutput');
      return;
    }

    log(`[SYSTEM] Starting optimization for: ${filePath}`, 'optimizeOutput');
    log(`[INFO] Compression: ${compress}, Replace: ${replace}`, 'optimizeOutput');

    const pythonCmd = document.getElementById('python_cmd').value || 'python';

    const params = new URLSearchParams();
    params.append('file', filePath);
    params.append('compress', compress);
    params.append('cmd', pythonCmd);
    if (replace) params.append('replace', 'true');

    const eventSource = new EventSource(`/api/optimize?${params.toString()}`);

    eventSource.onmessage = (event) => {
      log(event.data, 'optimizeOutput');
    };

    eventSource.onerror = () => {
      log('[SYSTEM] Optimization finished.', 'optimizeOutput');
      eventSource.close();
    };
  });
}

// 6f. Border Checker Button Logic
const btnCheckBorders = document.getElementById('btnCheckBorders');
if (btnCheckBorders) {
  btnCheckBorders.addEventListener('click', () => {
    const outputDir = document.getElementById('check_output_dir').value || 'tiles_out';
    const zoom = document.getElementById('check_zoom').value;
    const tolerance = document.getElementById('check_tolerance').value;
    const pythonCmd = document.getElementById('python_cmd').value || 'python';

    log('[SYSTEM] Starting Border Check...');
    log(`[INFO] Checking: ${outputDir}`);
    if (zoom) log(`[INFO] Zoom Level: ${zoom}`);
    log(`[INFO] Tolerance: ${tolerance}m`);

    const params = new URLSearchParams();
    params.append('output', outputDir);
    if (zoom) params.append('zoom', zoom);
    if (tolerance) params.append('tolerance', tolerance);
    params.append('cmd', pythonCmd);

    const eventSource = new EventSource(`/api/check-borders?${params.toString()}`);

    eventSource.onmessage = (event) => {
      log(event.data);
    };

    eventSource.onerror = () => {
      log('[SYSTEM] Border Check finished.');
      eventSource.close();
    };
  });
}

// Standalone DEM Converter logic moved to S2 Preprocessor.
const preprocessBtn = document.getElementById('preprocessBtn');
if (preprocessBtn) {
  preprocessBtn.addEventListener('click', () => {
    const input = document.getElementById('pre_input_file').value;
    const outputPrefix = document.getElementById('pre_output_prefix').value;
    const maxZoom = document.getElementById('pre_max_zoom').value;
    const maxZoomPole = document.getElementById('pre_max_zoom_pole').value;
    const compression = document.getElementById('pre_compression').value;
    const predictor = document.getElementById('pre_predictor').value;
    const warpResampling = document.getElementById('pre_warp_resampling').value;
    const overviewResampling = document.getElementById('pre_overview_resampling').value;
    const mode = document.getElementById('pre_mode').value;
    const cacheLimit = document.getElementById('pre_memory').value;
    const tileSize = document.getElementById('pre_tile_size').value;
    const skipFaces = document.getElementById('pre_skip').value || 0;
    const coordMode = document.getElementById('pre_coord_mode').value;
    const semiMajor = document.getElementById('pre_semi_major').value;
    const semiMinor = document.getElementById('pre_semi_minor').value;
    const normalize = document.getElementById('pre_format').value;

    if (!input || !outputPrefix) {
      log('[ERROR] Please specify both input file and output prefix.');
      return;
    }

    log(`[SYSTEM] Starting S2 Preprocessing...`);
    log(`[INFO] Input: ${input}`);
    log(`[INFO] Output Prefix: ${outputPrefix}`);
    log(`[INFO] Mode: ${mode}, Cache: ${cacheLimit}, Skip: ${skipFaces}`);
    log(`[INFO] Coordinate Mode: ${coordMode}`);
    log(`[INFO] Radii: A=${semiMajor}, B=${semiMinor}`);
    log(`[INFO] Max Zoom: ${maxZoom} (Pole: ${maxZoomPole}), Tile Size: ${tileSize}`);
    log(`[INFO] Compression: ${compression}, Predictor: ${predictor}`);
    log(`[INFO] Warp: ${warpResampling}, Overview: ${overviewResampling}`);

    const params = new URLSearchParams();
    params.append('input', input);
    params.append('output_prefix', outputPrefix);
    params.append('max_zoom', maxZoom);
    if (maxZoomPole) params.append('max_zoom_pole', maxZoomPole);
    params.append('tile_size', tileSize);
    params.append('compression', compression);
    params.append('predictor', predictor);
    params.append('warp_resampling', warpResampling);
    params.append('overview_resampling', overviewResampling);
    params.append('mode', mode);
    params.append('cache_limit', cacheLimit);
    params.append('skip_faces', skipFaces);
    params.append('coord_mode', coordMode);
    params.append('semi_major', semiMajor);
    params.append('semi_minor', semiMinor);
    // Allow user selection to propagate (BYTE, 1, or 0) regardless of mode
    params.append('normalize', normalize);

    // Debug Mode
    const debugMode = document.getElementById('pre_debug').checked ? '1' : '0';
    if (debugMode === '1') log(`[INFO] Debug Mode: ENABLED`);
    params.append('debug', debugMode);

    const eventSource = new EventSource(`/api/preprocess-faces?${params.toString()}`);

    eventSource.onmessage = (event) => {
      log(event.data);
    };

    eventSource.onerror = () => {
      log('[SYSTEM] Preprocessing connection closed.');
      eventSource.close();
    };
  });
}

const previewFacesBtn = document.getElementById('previewFacesBtn');
if (previewFacesBtn) {
  previewFacesBtn.addEventListener('click', async () => {
    const prefix = document.getElementById('pre_output_prefix').value;
    if (!prefix) {
      log('[ERROR] Please specify the output prefix first.');
      return;
    }

    log(`[SYSTEM] Generating S2 Face Preview...`);
    previewFacesBtn.disabled = true;

    try {
      const res = await fetch(`/api/preview-faces?prefix=${encodeURIComponent(prefix)}`);
      const data = await res.json();
      if (data.success) {
        log(`[SUCCESS] Preview generated as ${prefix}_preview.png`);
      } else {
        log(`[ERROR] Preview failed: ${data.error}`);
      }
    } catch (e) {
      log(`[ERROR] Preview failed: ${e.message}`);
    } finally {
      previewFacesBtn.disabled = false;
    }
  });
}

// 7. Browse Button Logic
document.querySelectorAll('.btn-browse').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);

    // Check if button explicitly specifies type
    const explicitType = btn.getAttribute('data-type');

    // Use different filter for enrichment texture (images) vs DEM/color (VRT/GeoTIFF)
    let filter = 'VRT/GeoTIFF (*.vrt;*.tif)|*.vrt;*.tif|All Files (*.*)|*.*';
    let type = explicitType || 'file'; // Default to file if not specified

    // Override filter based on target ID if needed
    if (targetId === 'enrichment_texture') {
      filter = 'Images (*.png;*.jpg;*.tif)|*.png;*.jpg;*.jpeg;*.tif|All Files (*.*)|*.*';
    } else if (targetId === 'working_dir' || targetId === 'pre_output_prefix') {
      // Legacy fallback: these ids are definitely directories
      if (!explicitType) type = 'directory';
    } else if (targetId === 'dem_file' || targetId === 'color_file') {
      filter = 'VRT Dataset (*.vrt)|*.vrt|GeoTIFF (*.tif)|*.tif|All Files (*.*)|*.*';
    }

    try {
      const res = await fetch(`/api/browse?type=${type}&filter=${encodeURIComponent(filter)}`);
      const data = await res.json();

      if (data.path) {
        input.value = data.path;

        // Auto-populate Output Prefix for Preprocessor
        if (targetId === 'pre_input_file') {
          const outputInput = document.getElementById('pre_output_prefix');
          // Remove extension (last dot to end)
          const basePath = data.path.replace(/\.[^/.]+$/, '');
          outputInput.value = basePath;
          log(`[INFO] Auto-set Output Prefix to: ${basePath}`);
        }
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
// 6b. Cesium Viewer Button Logic
const btnCesium = document.getElementById('btnCesium');
const btnS2Viewer = document.getElementById('btnS2Viewer');

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

// 6c. S2 Custom Viewer Button Logic
if (btnS2Viewer) {
  btnS2Viewer.addEventListener('click', () => {
    const outDir = outputInput.value || 'tiles_out';
    // Path relative to Project Root (which Vite serves)
    // Tiler GUI runs in project root context more or less, but the build output is in scripts/texture-pipeline/
    // So 'tiles_out' -> 'scripts/texture-pipeline/tiles_out'
    const target = `/scripts/texture-pipeline/${outDir}`;

    // Assume Vite is running on localhost:5173 (standard dev port)
    window.open(
      `http://localhost:5173/src/apps/custom-viewer/custom-viewer.html?url=${encodeURIComponent(target)}`,
      '_blank'
    );
  });
}

// 6d. S2 Preprocessor Mode Toggle
const preModeSelect = document.getElementById('pre_mode');
if (preModeSelect) {
  const preVertexOptions = document.getElementById('pre_vertex_options');

  const updateVisibility = () => {
    // Always show advanced options (Coord Mode, Format, Radius)
    // The user needs control over Byte/Float format even in Pixel mode.
    if (preVertexOptions) preVertexOptions.style.display = 'block';
  };

  preModeSelect.addEventListener('change', updateVisibility);
  // Init on load
  updateVisibility();
}

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

      // Also update DEM Converter defaults if they exist
      const convMajor = document.getElementById('conv_semi_major');
      if (convMajor) convMajor.value = rx;
      const convMinor = document.getElementById('conv_semi_minor');
      if (convMinor) convMinor.value = rz;

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

// 11. KTX2 Mode Toggle
const ktx2ModeSelect = document.getElementById('ktx2_mode');
function updateKTX2ModeFields() {
  if (!ktx2ModeSelect) return;
  const mode = ktx2ModeSelect.value;
  const etc1sGroup = document.getElementById('ktx2_etc1s_group');
  const uastcGroup = document.getElementById('ktx2_uastc_group');

  if (etc1sGroup) etc1sGroup.style.display = mode === 'etc1s' ? 'block' : 'none';
  if (uastcGroup) uastcGroup.style.display = mode === 'uastc' ? 'block' : 'none';
}

// 12. Tile Format Toggle
const tileFormatSelect = document.getElementById('tile_format');
function updateTileFormatFields() {
  if (!tileFormatSelect) return;
  const isProprietary = tileFormatSelect.value === 'proprietary';

  // Auto-set compression presets for proprietary mode (Optional: let user decide)
  if (isProprietary) {
    /* 
    if (ktx2ModeSelect) {
      ktx2ModeSelect.value = 'none';
      updateKTX2ModeFields();
    }
    */
    const dracoLevel = document.getElementById('draco_compression_level');
    if (dracoLevel) {
      dracoLevel.value = 0;
    }
  }
}

if (tileFormatSelect) {
  tileFormatSelect.addEventListener('change', updateTileFormatFields);
}

if (ktx2ModeSelect) {
  ktx2ModeSelect.addEventListener('change', updateKTX2ModeFields);
}

// 15. Network Throttling
const throttleSelect = document.getElementById('network_throttle');
if (throttleSelect) {
  throttleSelect.addEventListener('change', async () => {
    const latency = parseInt(throttleSelect.value, 10);
    log(`[SYSTEM] Setting network throttle to ${latency}ms...`);
    try {
      await fetch('/api/throttle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latency }),
      });
    } catch (e) {
      log(`[ERROR] Failed to update throttle: ${e.message}`);
    }
  });
}

// Init
loadConfig().then(() => {
  updateEnrichmentFields();
  updateCompressionFields();
  updateKTX2ModeFields();
  updateTileFormatFields();
  loadBodies();
});
