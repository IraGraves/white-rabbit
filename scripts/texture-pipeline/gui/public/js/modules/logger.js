export const Logger = {
  terminal: document.getElementById('terminal'),

  init() {
    const clearBtn = document.getElementById('clearTerminalBtn');
    const fontSizeSelect = document.getElementById('fontSizeSelect');

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.terminal.innerHTML = '';
        this.log('[SYSTEM] Terminal cleared.');
      });
    }

    if (fontSizeSelect) {
      fontSizeSelect.addEventListener('change', () => {
        this.terminal.style.fontSize = fontSizeSelect.value;
      });
    }
  },

  log(msg, targetId = null) {
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
    const lastLine = this.terminal.lastElementChild;

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
      lastLine.innerHTML = formattedHTML;
      if (msg.includes('100%') || msg.includes('complete') || msg.includes('Success')) {
        lastLine.dataset.type = 'finished';
      }
    } else {
      const div = document.createElement('div');
      div.className = 'terminal-line';
      if (isProgress) div.dataset.type = 'progress';
      div.innerHTML = formattedHTML;
      this.terminal.appendChild(div);
    }
    this.terminal.scrollTop = this.terminal.scrollHeight;
  },
};
