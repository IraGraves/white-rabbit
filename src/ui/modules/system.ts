/**
 * Sets up the System folder in the GUI
 * @param {GUI} gui - The GUI instance
 * @param {THREE.WebGLRenderer} renderer - The WebGL renderer
 */
import type GUI from 'lil-gui';
import type * as THREE from 'three';

export function setupSystemUI(gui: GUI, renderer: THREE.WebGLRenderer) {
  const systemFolder = gui.addFolder('System');

  // Create a container for the system info
  const container = document.createElement('div');
  container.style.padding = '10px';
  container.style.fontSize = '12px';
  container.style.lineHeight = '1.4';
  container.style.color = '#eee';
  container.style.fontFamily = 'monospace';

  // Gather System Info
  const gl = renderer.getContext();
  if (!gl) return;
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const rendererInfo = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
  // Vendor info retained for potential future use but prefixed since unused
  void (debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown');

  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const maxCubeMapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

  const extAnisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
  const maxAnisotropy = extAnisotropy
    ? gl.getParameter(extAnisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
    : 'N/A';

  const cpuCores = navigator.hardwareConcurrency || 'Unknown';
  const extendedNavigator = navigator as Navigator & { deviceMemory?: number };
  const memory = extendedNavigator.deviceMemory
    ? `${extendedNavigator.deviceMemory} GB`
    : 'Unknown';

  // Format the output
  const infoHTML = `
    <div style="margin-bottom: 8px;">
      <strong style="color: #88ccff;">CPU:</strong> ${cpuCores} Logical Processors<br>
      <strong style="color: #88ccff;">Memory:</strong> ${memory}
    </div>
    <div style="margin-bottom: 8px;">
      <strong style="color: #88ccff;">GPU:</strong><br>
      ${rendererInfo}
    </div>
    <div>
      <strong style="color: #88ccff;">WebGL Limits:</strong><br>
      Max Texture Size: ${maxTextureSize}px<br>
      Max Cube Map Size: ${maxCubeMapSize}px<br>
      Max Anisotropy: ${maxAnisotropy}x
    </div>
  `;

  container.innerHTML = infoHTML;

  // Add to the folder
  // lil-gui folders have a .children element where we can append custom DOM
  const childrenEl = systemFolder.domElement.querySelector('.children');
  if (childrenEl) childrenEl.appendChild(container);

  systemFolder.close();
}
