import GUI from 'lil-gui';
import type * as THREE from 'three';
import { missionData } from '../../data/missions';

interface IStarManager {
  getCounts(): { total: number; visible: number };
}

export function setupStatsFolder(gui: GUI, starsRef?: { value: THREE.Group | null }) {
  const statsFolder = gui.addFolder('Stats');

  // Interface object for lil-gui
  const state = {
    currentMission: '',
  };

  // Prepare list for dropdown
  const missionList = missionData.reduce(
    (acc, m) => {
      acc[m.name || m.id] = m.id;
      return acc;
    },
    {} as Record<string, string>
  );

  // Container for output
  const container = document.createElement('div');
  container.className = 'stats-output';
  container.style.padding = '10px';
  container.style.color = '#eee';
  container.style.fontFamily = 'monospace';
  container.style.fontSize = '12px';
  container.innerHTML = '<div style="color:#888; font-style:italic;">Select a mission...</div>';

  const starContainer = document.createElement('div');
  starContainer.style.marginTop = '15px';
  starContainer.style.paddingTop = '10px';
  starContainer.style.borderTop = '1px solid #444';
  starContainer.style.fontFamily = 'monospace';
  starContainer.style.fontSize = '12px';
  starContainer.innerHTML = '<div style="color:#666">Stars: ...</div>';

  // Function to update stats
  const updateStats = async (missionId: string) => {
    if (!missionId) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = '<div style="color:#aaa;">Fetching data...</div>';

    try {
      // Assume standard path. Verify if config has a base path?
      // Usually it is relative to public root.
      const url = `data/missions/binary/${missionId}.bin`;

      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) throw new Error(`Status ${response.status}`);

      const sizeStr = response.headers.get('content-length');
      const sizeBytes = sizeStr ? parseInt(sizeStr, 10) : 0;

      // Calculate points
      // Stride 7 (Time, X, Y, Z, VX, VY, VZ)
      // processor.js output uses Float64Array.
      // 1 Float64 = 8 bytes.
      // Stride 7 = 7 * 8 = 56 bytes/point.
      // Old format (Stride 4) was likely Float32? Or also Float64?
      // Let's assume Float64 for new Stride 7.
      // Stride 4 (Time, X, Y, Z) = 4 * 8 = 32 bytes/point (if Float64).

      let pointCount = 0;
      let stride = 0;

      if (sizeBytes % 56 === 0) {
        stride = 7;
        pointCount = sizeBytes / 56;
      } else if (sizeBytes % 32 === 0) {
        stride = 4;
        pointCount = sizeBytes / 32;
      } else if (sizeBytes % 28 === 0) {
        // Maybe Float32 Stride 7? (4 bytes * 7)
        stride = 7;
        pointCount = sizeBytes / 28;
      } else if (sizeBytes % 16 === 0) {
        // Maybe Float32 Stride 4? (4 bytes * 4)
        stride = 4;
        pointCount = sizeBytes / 16;
      } else {
        // Fallback or Unknown
        stride = -1;
        // Try guessing closest?
      }

      const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
      const sizeKB = (sizeBytes / 1024).toFixed(2);

      let modelSizeInfo = '';
      const mission = missionData.find((m) => m.id === missionId);

      if (mission?.modelPath) {
        try {
          const modelRes = await fetch(mission.modelPath, { method: 'HEAD' });
          if (modelRes.ok) {
            const mSizeStr = modelRes.headers.get('content-length');
            const mSizeBytes = mSizeStr ? parseInt(mSizeStr, 10) : 0;
            const mSizeMB = (mSizeBytes / (1024 * 1024)).toFixed(2);
            const mSizeKB = (mSizeBytes / 1024).toFixed(2);

            modelSizeInfo = `
                     <div style="margin-top:8px; padding-top:8px; border-top:1px solid #444;">
                        <strong style="color: #88ccff;">Probe Model:</strong>
                        <div style="color:#aaa; font-size:0.9em; overflow-wrap:anywhere;">${mission.modelPath}</div>
                        <div>
                            <strong style="color: #88ccff;">Size:</strong> ${mSizeBytes > 1024 * 1024 ? `${mSizeMB} MB` : `${mSizeKB} KB`}
                        </div>
                    </div>
                    `;
          }
        } catch {
          modelSizeInfo = `<div style="color:#aaa;">Model check failed</div>`;
        }
      }

      let bakedInfo = '';
      // Try to find the live mission object
      // We need to dynamically import or use a global reference if strict dependency rules prevent import
      // But we can just try to find it on window or assume we can access it.
      // Better: Use the ref we might have access to, or just fetch it from the scene if we had access.
      // For now, let's rely on the file stats as "Download Size" and add a note about "Rendered Points"

      // HACK: We can access the global missionLines if exported, or pass it in.
      // Let's assume we can import it.
      const { missionLines } = await import('../../features/missionState');
      const lineObj = missionLines[missionId];
      if (lineObj?.userData) {
        const baked = lineObj.userData.pointCount;
        const angle = lineObj.userData.bakingAngle;

        if (baked) {
          const angleStr = angle ? ` @${angle}°` : '';
          bakedInfo = `<div style="margin-top:4px; color:#aaa; font-style:italic;">
                            Rendered: ${baked.toLocaleString()} (Baked${angleStr})
                          </div>`;
        }
      }

      container.innerHTML = `
            <div style="margin-bottom:6px;">
                <strong style="color: #88ccff;">Binary:</strong> ${missionId}.bin
            </div>
             <div style="margin-bottom:6px;">
                <strong style="color: #88ccff;">Size:</strong> ${sizeBytes > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`} <span style="color:#666">(${sizeBytes} B)</span>
            </div>
            <div>
                 <strong style="color: #88ccff;">Points:</strong> ${pointCount > 0 ? pointCount.toLocaleString() : 'Unknown'}
                 <span style="color:#666; font-size:0.9em;">(Stride: ${stride > 0 ? stride : '?'})</span>
                 ${bakedInfo}
            </div>
            ${modelSizeInfo}
        `;
    } catch (e) {
      container.innerHTML = `<div style="color: #ff6666;">Error loading stats:<br>${(e as Error).message}</div>`;
    }
  };

  // Add Dropdown
  statsFolder
    .add(state, 'currentMission', missionList)
    .name('Mission')
    .onChange((val: string) => {
      updateStats(val);
    });

  // Add DOM Container
  // lil-gui hacks: append to .children
  const childrenEl = statsFolder.domElement.querySelector('.children');
  if (childrenEl) {
    childrenEl.appendChild(container);
    childrenEl.appendChild(starContainer);
  }

  // Poll for Star Stats
  if (starsRef) {
    setInterval(() => {
      // Only update if folder is open? Optimization.
      if (statsFolder.domElement.classList.contains('closed')) return;

      const stars = starsRef.value;
      if (stars?.userData.manager) {
        const counts = (stars.userData.manager as IStarManager).getCounts();
        if (counts) {
          starContainer.innerHTML = `
                    <div style="margin-bottom:4px;">
                        <strong style="color: #ffcc66;">Stars Loaded:</strong> ${counts.total.toLocaleString()}
                    </div>
                    <div>
                        <strong style="color: #ffcc66;">Visible:</strong> ${counts.visible.toLocaleString()}
                    </div>
                `;
        }
      }
    }, 500); // 2Hz update
  }

  statsFolder.close(); // Closed by default
}
