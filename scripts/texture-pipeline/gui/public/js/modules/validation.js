import { Logger } from './logger.js';
import * as THREE from 'three';
import { KTX2Loader } from '../../libs/KTX2Loader.js';

let ktx2Loader = null;
let renderer = null;

function getKTX2Loader() {
  if (ktx2Loader) return ktx2Loader;

  // Create a hidden renderer for transcoding
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
  renderer.setSize(256, 256); // Default size, will resize
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // or SRGBColorSpace in newer three

  ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath('/libs/'); // Assumes basis_transcoder.js/wasm are in public/libs/
  ktx2Loader.detectSupport(renderer);

  return ktx2Loader;
}

export const Validation = {
  init() {
    // 1. Validate (Deep)
    const validateBtn = document.getElementById('validateBtn');
    if (validateBtn) validateBtn.addEventListener('click', () => this.runDeepValidation());

    // 2. Validate (Official)
    const validateOfficialBtn = document.getElementById('validateOfficialBtn');
    if (validateOfficialBtn)
      validateOfficialBtn.addEventListener('click', () => this.runOfficialValidation());

    // 3. Create Debug Texture
    const createDebugTextureBtn = document.getElementById('createDebugTextureBtn');
    if (createDebugTextureBtn)
      createDebugTextureBtn.addEventListener('click', () => this.createDebugTexture());

    // 4. Fix Metadata
    const fixMetadataBtn = document.getElementById('fixMetadataBtn');
    if (fixMetadataBtn) fixMetadataBtn.addEventListener('click', () => this.fixMetadata());

    // 5. Border Checker
    const btnCheckBorders = document.getElementById('btnCheckBorders');
    if (btnCheckBorders) btnCheckBorders.addEventListener('click', () => this.checkBorders());

    // 7. Inspector
    const inspectBtn = document.getElementById('inspectBtn');
    if (inspectBtn) inspectBtn.addEventListener('click', () => this.inspectTile());

    // 6. Optimize GeoTIFF
    const optimizeBtn = document.getElementById('optimizeBtn');
    if (optimizeBtn) optimizeBtn.addEventListener('click', () => this.optimizeGeoTiff());
  },

  runDeepValidation() {
    const outputDir = document.getElementById('output').value || 'tiles_out';
    const pythonCmd = document.getElementById('python_cmd').value || 'python';
    Logger.log('[SYSTEM] Starting validation...');
    const params = new URLSearchParams({ output: outputDir, cmd: pythonCmd });
    this.stream(`/api/validate?${params}`, '[SYSTEM] Validation finished.');
  },

  runOfficialValidation() {
    const outputDir = document.getElementById('output').value || 'tiles_out';
    Logger.log('[SYSTEM] Starting 3d-tiles-validator...');
    const params = new URLSearchParams({ output: outputDir });
    this.stream(`/api/validate-official?${params}`, '[SYSTEM] 3d-tiles-validator finished.');
  },

  createDebugTexture() {
    Logger.log('[SYSTEM] Starting Create Debug Texture...');
    const params = new URLSearchParams();
    params.append('rx', document.getElementById('radius_x').value);
    params.append('ry', document.getElementById('radius_y').value);
    params.append('rz', document.getElementById('radius_z').value);
    params.append('width', document.getElementById('debug_width').value);
    params.append('cmd', document.getElementById('python_cmd').value || 'python');

    this.stream(`/api/create-debug-texture?${params}`, '[SYSTEM] Create Debug Texture finished.');
  },

  fixMetadata() {
    const filePath = document.getElementById('fix_file_path').value;
    if (!filePath) return Logger.log('[ERROR] Please select a file to fix.');

    const params = new URLSearchParams({
      file: filePath,
      rx: document.getElementById('radius_x').value,
      ry: document.getElementById('radius_y').value,
      rz: document.getElementById('radius_z').value,
      cmd: document.getElementById('python_cmd').value || 'python',
    });

    Logger.log(`[SYSTEM] Fixing metadata for: ${filePath}`);
    this.stream(`/api/fix-metadata?${params}`, '[SYSTEM] Metadata correction finished.');
  },

  checkBorders() {
    const outputDir = document.getElementById('check_output_dir').value || 'tiles_out';
    const params = new URLSearchParams({
      output: outputDir,
      zoom: document.getElementById('check_zoom').value,
      tolerance: document.getElementById('check_tolerance').value,
      cmd: document.getElementById('python_cmd').value || 'python',
    });

    Logger.log('[SYSTEM] Starting Border Check...');
    this.stream(`/api/check-borders?${params}`, '[SYSTEM] Border Check finished.');
  },

  async inspectTile() {
    const face = document.getElementById('inspect_face').value;
    const zoom = document.getElementById('inspect_zoom').value;
    const x = document.getElementById('inspect_x').value;
    const y = document.getElementById('inspect_y').value;
    const outputDir = document.getElementById('output').value || 'tiles_out';

    Logger.log(`[SYSTEM] Inspecting tile: F${face} Z${zoom} (${x}, ${y})...`);

    try {
      const res = await fetch(
        `/api/inspect-tile?output=${outputDir}&face=${face}&zoom=${zoom}&x=${x}&y=${y}`
      );
      const data = await res.json();

      if (data.error) {
        Logger.log(`[ERROR] Inspection failed: ${data.error}`);
        this.renderInspectorResults({ error: data.error });
        // Auto-switch to Inspector tab so user sees the error
        const inspectorTabBtn = document.querySelector(
          '.output-tab-btn[data-target="inspector-output"]'
        );
        if (inspectorTabBtn) inspectorTabBtn.click();
        return;
      }

      Logger.log(`[SUCCESS] Inspection complete.`);
      this.renderInspectorResults(data);

      // Auto-switch to Inspector tab
      const inspectorTabBtn = document.querySelector(
        '.output-tab-btn[data-target="inspector-output"]'
      );
      if (inspectorTabBtn) inspectorTabBtn.click();
    } catch (e) {
      Logger.log(`[ERROR] Request failed: ${e.message}`);
    }
  },

  async renderInspectorResults(data) {
    const metaContainer = document.getElementById('inspector-meta');
    const imagesContainer = document.getElementById('inspector-images');

    if (!metaContainer || !imagesContainer) return;

    metaContainer.innerHTML = '';
    imagesContainer.innerHTML = '';

    if (data.error) {
      metaContainer.innerHTML = `<div style="color: #ff6b6b; font-weight: bold; padding: 1rem;">Error: ${data.error}</div>`;
      return;
    }

    // Render Metadata Table (Dynamic from data.meta)
    let tableHtml =
      '<table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; color: #ddd;">';

    const addRow = (label, value) => {
      tableHtml += `
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 4px 8px; font-weight: bold; color: #888;">${label}</td>
                <td style="padding: 4px 8px;">${value}</td>
            </tr>`;
    };

    // Generic Metadata rendering
    if (data.meta) {
      for (const [key, value] of Object.entries(data.meta)) {
        addRow(key, value);
      }
    }

    // Explicit file size if available at root
    if (data.size) {
      addRow('File Size', `${(data.size / 1024).toFixed(2)} KB`);
    }

    tableHtml += '</table>';
    metaContainer.innerHTML = tableHtml;

    // Render Textures List
    if (data.textures && data.textures.length > 0) {
      let texHtml =
        '<div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; color: #ddd;">Textures (GLTF Definition)</div>';
      texHtml += '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';

      data.textures.forEach((tex) => {
        const rawStr = JSON.stringify(tex.raw, null, 2).replace(/"/g, '&quot;');
        texHtml += `
             <div style="background: #1a1a1a; border: 1px solid #444; padding: 6px; font-size: 0.8rem; min-width: 140px;" title="${rawStr}">
                <div style="color: #4fc3f7; font-weight: bold; border-bottom: 1px solid #333; margin-bottom: 4px;">#${tex.index} ${tex.name || '<i>Unnamed</i>'}</div>
                <div style="color: #888;">Source Img: ${tex.source !== undefined ? tex.source : '<span style="color:#666">null</span>'}</div>
                ${tex.basisu_source !== undefined ? `<div style="color: #ffb74d;">BasisU Src: ${tex.basisu_source}</div>` : ''}
                ${tex.extensions ? `<div style="color: #aaa; font-size: 0.7rem;">Ext: ${tex.extensions.join(', ')}</div>` : ''}
                <div style="color: #555; font-size: 0.6rem; margin-top:2px; font-family: monospace; white-space: pre-wrap;">${JSON.stringify(tex.raw)}</div>
             </div>`;
      });
      texHtml += '</div>';
      metaContainer.innerHTML += texHtml;
    }

    // Render Images (Raw Data)
    if (data.images && data.images.length > 0) {
      for (let idx = 0; idx < data.images.length; idx++) {
        const img = data.images[idx];
        const card = document.createElement('div');
        card.style.cssText =
          'background: #222; padding: 0.5rem; border-radius: 4px; border: 1px solid #444; width: 256px; display: inline-block; margin: 5px; vertical-align: top;';

        let innerHTML = `
                <div style="font-weight: bold; margin-bottom: 0.5rem; color: #fff;">Image ${idx}</div>
                <div style="font-size: 0.8rem; color: #aaa;">
                    MIME: ${img.mimeType || 'N/A'}<br>
                    Index: ${img.index}<br>
                    Name: ${img.name || 'Unnamed'}<br>
                    Dims: ${img.width && img.height ? img.width + ' x ' + img.height : 'Unknown'}<br>
                    Size: ${img.size ? (img.size / 1024).toFixed(1) + ' KB' : 'Unknown'}
                </div>
              `;

        let imgContainer = document.createElement('div');
        imgContainer.style.marginTop = '5px';
        imgContainer.style.minHeight = '100px';
        imgContainer.style.background = '#000';
        imgContainer.style.display = 'flex';
        imgContainer.style.alignItems = 'center';
        imgContainer.style.justifyContent = 'center';

        // Check if KTX2
        if (
          img.data &&
          (img.mimeType === 'image/ktx2' || (img.name && img.name.endsWith('.ktx2')))
        ) {
          imgContainer.innerHTML =
            '<span style="color:#888; font-size: 0.7rem;">Decoding KTX2...</span>';

          // Decode KTX2
          try {
            // Convert Base64 to ArrayBuffer
            const binaryString = window.atob(img.data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            const loader = getKTX2Loader();
            loader.parse(
              bytes.buffer,
              (texture) => {
                const width = texture.image.width;
                const height = texture.image.height;

                // Helper: render texture to canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                // Get the shared renderer
                const r = renderer;
                r.setSize(width, height, false);
                r.clear();

                // Create a basic scene/quad
                const scene = new THREE.Scene();
                const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
                const material = new THREE.MeshBasicMaterial({ map: texture });
                const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
                scene.add(quad);

                r.render(scene, camera);

                const dataURL = r.domElement.toDataURL();

                // Programmatically create image to avoid quote escaping issues
                imgContainer.innerHTML = '';
                const imgEl = document.createElement('img');
                imgEl.src = dataURL;
                imgEl.style.maxWidth = '100%';
                imgEl.style.border = '1px solid #555';
                imgEl.style.cursor = 'pointer';
                imgEl.title = 'Click to open full size';
                imgEl.onclick = function () {
                  const w = window.open('');
                  w.document.write('<img src="' + this.src + '" />');
                  w.document.close();
                };
                imgContainer.appendChild(imgEl);

                texture.dispose();
                material.dispose();
                quad.geometry.dispose();
              },
              (err) => {
                console.error('KTX2 Decode Error', err);
                imgContainer.innerHTML = `<span style="color:#f55; font-size: 0.7rem;">Decode Failed</span>`;
              }
            );
          } catch (e) {
            Logger.log(`[ERROR] KTX2 decode exception: ${e.message}`);
            imgContainer.innerHTML = `<span style="color:#f55; font-size: 0.7rem;">Decode Exception</span>`;
          }
        } else if (img.data) {
          // Standard Image
          // Only show supported formats to avoid broken images for custom types
          const supportedFormats = [
            'image/png',
            'image/jpeg',
            'image/webp',
            'image/gif',
            'image/bmp',
          ];
          if (supportedFormats.includes(img.mimeType) || !img.mimeType) {
            const imgEl = document.createElement('img');
            imgEl.src = `data:${img.mimeType};base64,${img.data}`;
            imgEl.style.maxWidth = '100%';
            imgEl.style.border = '1px solid #555';
            imgEl.style.cursor = 'pointer';
            imgEl.title = 'Click to open full size';
            imgEl.onclick = function () {
              const w = window.open('');
              w.document.write('<img src="' + this.src + '" />');
              w.document.close();
            };
            imgContainer.innerHTML = '';
            imgContainer.appendChild(imgEl);
          } else {
            imgContainer.innerHTML = `<span style="color:#666; font-size:0.75rem; text-align:center;">Preview Unavailable<br>(${img.mimeType})</span>`;
          }
        } else {
          imgContainer.innerHTML = `<span style="color:#666; font-style:italic;">No Data</span>`;
        }

        card.appendChild(document.createRange().createContextualFragment(innerHTML));
        card.appendChild(imgContainer);
        imagesContainer.appendChild(card);
      }
    } else {
      imagesContainer.innerHTML =
        '<div style="color: #777; font-style: italic;">No textures found in this tile.</div>';
    }
  },

  optimizeGeoTiff() {
    const filePath = document.getElementById('opt_input_file').value;
    if (!filePath) return Logger.log('[ERROR] Please select a source file.', 'optimizeOutput');

    document.getElementById('optimizeOutput').style.display = 'block';
    document.getElementById('optimizeOutput').innerHTML = ''; // Clear

    Logger.log(`[SYSTEM] Starting optimization for: ${filePath}`, 'optimizeOutput');

    const params = new URLSearchParams({
      file: filePath,
      compress: document.getElementById('opt_compression').value,
      cmd: document.getElementById('python_cmd').value || 'python',
    });
    if (document.getElementById('opt_replace').checked) params.append('replace', 'true');

    const es = new EventSource(`/api/optimize?${params}`);
    es.onmessage = (e) => Logger.log(e.data, 'optimizeOutput');
    es.onerror = () => {
      Logger.log('[SYSTEM] Optimization finished.', 'optimizeOutput');
      es.close();
    };
  },

  stream(url, endMsg) {
    const es = new EventSource(url);
    es.onmessage = (e) => Logger.log(e.data);
    es.onerror = () => {
      Logger.log(endMsg);
      es.close();
    };
  },
};
