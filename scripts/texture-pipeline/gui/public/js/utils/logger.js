export const Logger = {
  logEl: null,

  init() {
    // If we have a terminal element, we can log to it
    this.terminal = document.getElementById('terminal');
  },

  log(msg) {
    console.log(msg);
    this.toTerminal(msg, 'info');
  },

  warn(msg) {
    console.warn(msg);
    this.toTerminal(msg, 'warn');
  },

  error(msg) {
    console.error(msg);
    this.toTerminal(msg, 'error');
  },

  toTerminal(msg, type = 'info') {
    if (!this.terminal) {
      // Try to get terminal again in case init happened before DOM load
      this.terminal = document.getElementById('terminal');
      if (!this.terminal) return;
    }

    const line = document.createElement('div');
    line.style.fontFamily = "'JetBrains Mono', monospace";
    line.style.marginBottom = '2px';

    const time = new Date().toLocaleTimeString();

    let color = '#ccc';
    if (type === 'warn') color = '#fbbf24';
    if (type === 'error') color = '#ef4444';
    if (msg.startsWith('[SYSTEM]')) color = '#60a5fa';

    line.innerHTML = `<span style="color:#666">[${time}]</span> <span style="color:${color}">${msg}</span>`;

    this.terminal.appendChild(line);
    this.terminal.scrollTop = this.terminal.scrollHeight;
  },
};
