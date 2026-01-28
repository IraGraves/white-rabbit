export const FileSystem = {
  currentPath: 'scripts/texture-pipeline',
  
  init() {
    this.listEl = document.getElementById('fsList');
    this.pathEl = document.getElementById('fsPath');
    this.upBtn = document.getElementById('fsUpBtn');
    this.refreshBtn = document.getElementById('fsRefreshBtn');
    
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

  navigateUp() {
    if (this.currentPath === '.' || this.currentPath === './') return;
    // Simple parent logic: split by / or \
    // We rely on backend 'path' logic mostly, but here we just want to go up one level.
    // Normalized path from backend is unix-style usually?
    // Let's rely on server normalization or just split.
    // If path is "input/moon", up is "input".
    // If path is "input", up is ".".
    
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
      
      this.currentPath = data.path; // Update with normalized path from server
      this.render(data);
      
    } catch (e) {
      this.listEl.innerHTML = `<li style="padding:0.5rem; color:#ef4444;">Network Error: ${e.message}</li>`;
    }
  },

  render(data) {
    this.pathEl.textContent = data.path || './';
    this.listEl.innerHTML = '';
    
    if (data.entries.length === 0) {
      this.listEl.innerHTML = '<li style="padding:0.5rem; color:#666; font-style:italic;">(Empty directory)</li>';
      return;
    }
    
    data.entries.forEach(entry => {
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
      }
      
      li.appendChild(icon);
      li.appendChild(name);
      
      // Interaction
      li.addEventListener('mouseover', () => { li.style.background = '#333'; });
      li.addEventListener('mouseout', () => { li.style.background = 'transparent'; });
      
      li.addEventListener('click', () => {
        if (entry.isDirectory) {
          const separator = data.sep || '/';
          // Avoid double separators
          let newPath = data.path === '.' ? entry.name : `${data.path}/${entry.name}`; 
          // Use / always for URL
          newPath = newPath.replace(/\\/g, '/'); 
          this.loadPath(newPath);
        } else {
             // Maybe open file or just show info?
             // For now, no action on file click
        }
      });
      
      this.listEl.appendChild(li);
    });
  }
};
