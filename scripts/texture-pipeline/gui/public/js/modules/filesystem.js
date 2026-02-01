export const FileSystem = {
  currentPath: 'scripts/texture-pipeline',
  infoPanel: null,

  init() {
    this.listEl = document.getElementById('fsList');
    this.pathEl = document.getElementById('fsPath');
    this.upBtn = document.getElementById('fsUpBtn');
    this.refreshBtn = document.getElementById('fsRefreshBtn');

    // Create info panel
    this.createInfoPanel();

    // Tab Activation Listener
    const tabBtn = document.querySelector('.output-tab-btn[data-target="filesystem-output"]');
    if (tabBtn) {
      tabBtn.addEventListener('click', () => {
        this.loadPath(this.currentPath);
      });
    }

    // Navigation Listeners
    if (this.upBtn) {
      this.upBtn.addEventListener('click', () => {
        this.navigateUp();
      });
    }

    if (this.refreshBtn) {
      this.refreshBtn.addEventListener('click', () => {
        this.loadPath(this.currentPath);
      });
    }
  },

  createInfoPanel() {
    // Create a floating info panel
    this.infoPanel = document.createElement('div');
    this.infoPanel.id = 'fsInfoPanel';
    this.infoPanel.style.cssText = `
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #1e1e2e;
      border: 1px solid #444;
      border-radius: 8px;
      padding: 1rem;
      min-width: 300px;
      max-width: 500px;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(this.infoPanel);

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.infoPanel.style.display !== 'none' && !this.infoPanel.contains(e.target)) {
        this.infoPanel.style.display = 'none';
      }
    });
  },

  async showFileInfo(filePath) {
    this.infoPanel.innerHTML = '<p style="color:#888;">Loading...</p>';
    this.infoPanel.style.display = 'block';

    try {
      const res = await fetch(`/api/fs/info?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();

      if (data.error) {
        this.infoPanel.innerHTML = `<p style="color:#ef4444;">Error: ${data.error}</p>`;
        return;
      }

      const fileName = filePath.split('/').pop();

      this.infoPanel.innerHTML = `
        <h3 style="margin:0 0 0.5rem 0; color:#fff; font-size:14px;">📊 ${fileName}</h3>
        <div style="display:grid; grid-template-columns: auto 1fr; gap:0.25rem 0.5rem; font-size:12px;">
          <span style="color:#888;">Size:</span>
          <span style="color:#4ade80; font-weight:bold;">${data.size ? data.size[0] + ' × ' + data.size[1] : 'N/A'}</span>
          <span style="color:#888;">Format:</span>
          <span style="color:#ccc;">${data.driver || 'Unknown'}</span>
          <span style="color:#888;">Bands:</span>
          <span style="color:#ccc;">${data.bands} (${data.bandTypes ? data.bandTypes.join(', ') : 'N/A'})</span>
        </div>
        <div style="margin-top:1rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button id="fsPreviewInlineBtn" style="padding:0.3rem 0.8rem; background:#3b82f6; border:none; color:#fff; cursor:pointer; border-radius:4px;">🖼️ Show Preview</button>
          <button id="fsPreviewNewTabBtn" style="padding:0.3rem 0.8rem; background:#22c55e; border:none; color:#fff; cursor:pointer; border-radius:4px;">🔗 Open Full Size</button>
          <button id="fsInfoClose" style="padding:0.3rem 0.8rem; background:#333; border:1px solid #555; color:#fff; cursor:pointer; border-radius:4px;">✕ Close</button>
        </div>
        <div id="fsPreviewContainer" style="margin-top:0.75rem; text-align:center;"></div>
      `;

      // Inline preview button
      document.getElementById('fsPreviewInlineBtn').addEventListener('click', async (e) => {
        e.stopPropagation();
        const container = document.getElementById('fsPreviewContainer');
        const btn = document.getElementById('fsPreviewInlineBtn');

        btn.disabled = true;
        btn.textContent = '⏳ Loading...';
        container.innerHTML = '<p style="color:#888; font-size:12px;">Generating preview...</p>';

        try {
          const previewUrl = `/api/fs/preview?path=${encodeURIComponent(filePath)}&size=400`;

          const res = await fetch(previewUrl);
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || `Server Error ${res.status}`);
          }

          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);

          const img = document.createElement('img');
          img.src = objUrl;
          img.style.cssText =
            'max-width:100%; max-height:300px; border:1px solid #444; border-radius:4px;';

          container.innerHTML = '';
          container.appendChild(img);
          btn.textContent = '🖼️ Refresh';
          btn.disabled = false;
        } catch (err) {
          container.innerHTML = `<p style="color:#ef4444; font-size:12px;">Error: ${err.message}</p>`;
          btn.textContent = '🖼️ Retry';
          btn.disabled = false;
        }
      });

      // Open in new tab button
      document.getElementById('fsPreviewNewTabBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(`/api/fs/preview?path=${encodeURIComponent(filePath)}&size=2048`, '_blank');
      });

      // Close button
      document.getElementById('fsInfoClose').addEventListener('click', (e) => {
        e.stopPropagation();
        this.infoPanel.style.display = 'none';
      });
    } catch (e) {
      this.infoPanel.innerHTML = `<p style="color:#ef4444;">Error: ${e.message}</p>`;
    }
  },

  navigateUp() {
    if (this.currentPath === '.' || this.currentPath === './') return;
    const parts = this.currentPath.split(/[/\\]/);
    parts.pop();
    this.currentPath = parts.join('/') || '.';
    this.loadPath(this.currentPath);
  },

  async loadPath(path) {
    if (!this.listEl) return;

    try {
      this.listEl.innerHTML = '<li style="padding:0.5rem; color:#888;">Loading...</li>';

      const res = await fetch(`/api/fs/list?path=${encodeURIComponent(path)}`);
      const data = await res.json();

      if (data.error) {
        this.listEl.innerHTML = `<li style="padding:0.5rem; color:#ef4444;">Error: ${data.error}</li>`;
        return;
      }

      this.currentPath = data.path;
      this.render(data);
    } catch (e) {
      this.listEl.innerHTML = `<li style="padding:0.5rem; color:#ef4444;">Network Error: ${e.message}</li>`;
    }
  },

  render(data) {
    this.pathEl.textContent = data.path || './';
    this.listEl.innerHTML = '';

    if (data.entries.length === 0) {
      this.listEl.innerHTML =
        '<li style="padding:0.5rem; color:#666; font-style:italic;">(Empty directory)</li>';
      return;
    }

    data.entries.forEach((entry) => {
      const li = document.createElement('li');
      li.style.padding = '0.25rem 0.5rem';
      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.alignItems = 'center';

      // Icon
      const icon = document.createElement('span');
      icon.style.marginRight = '0.5rem';
      icon.style.width = '1.2rem';
      icon.style.textAlign = 'center';
      icon.style.display = 'inline-block';
      icon.textContent = entry.isDirectory ? '📁' : '📄';

      // Name
      const name = document.createElement('span');
      name.textContent = entry.name;
      if (entry.isDirectory) {
        name.style.fontWeight = 'bold';
        name.style.color = '#fff';
      } else {
        name.style.color = '#ccc';
        // Highlight VRT/TIF files
        const lname = entry.name.toLowerCase();
        if (lname.endsWith('.vrt') || lname.endsWith('.tif') || lname.endsWith('.tiff')) {
          name.style.color = '#4ade80';
          icon.textContent = '🗺️';
        }
      }

      li.appendChild(icon);
      li.appendChild(name);

      // Interaction
      li.addEventListener('mouseover', () => {
        li.style.background = '#333';
      });
      li.addEventListener('mouseout', () => {
        li.style.background = 'transparent';
      });

      li.addEventListener('click', (e) => {
        e.stopPropagation();
        if (entry.isDirectory) {
          const separator = data.sep || '/';
          let newPath = data.path === '.' ? entry.name : `${data.path}/${entry.name}`;
          newPath = newPath.replace(/\\/g, '/');
          this.loadPath(newPath);
        } else {
          // Show file info for VRT/TIF files
          const lname = entry.name.toLowerCase();
          if (lname.endsWith('.vrt') || lname.endsWith('.tif') || lname.endsWith('.tiff')) {
            const filePath = data.path === '.' ? entry.name : `${data.path}/${entry.name}`;
            this.showFileInfo(filePath.replace(/\\/g, '/'));
          }
        }
      });

      this.listEl.appendChild(li);
    });
  },
};
