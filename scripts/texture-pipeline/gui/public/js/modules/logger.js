export const Logger = {
  terminal: document.getElementById('terminal'),
  progressLines: new Map(), // Cache for [PROGRESS:ID]
  queue: [],
  isProcessing: false,
  MAX_LINES: 1000,

  init() {
    const clearBtn = document.getElementById('clearTerminalBtn');
    const fontSizeSelect = document.getElementById('fontSizeSelect');

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.terminal.innerHTML = '';
        this.progressLines.clear();
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

    this.queue.push({ msg, targetId });
    if (!this.isProcessing) {
      this.isProcessing = true;
      requestAnimationFrame(() => this.processQueue());
    }
  },

  processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    const batch = this.queue.splice(0, this.queue.length);
    const fragment = document.createDocumentFragment();

    for (const item of batch) {
      const { msg, targetId } = item;

      // If target specified, log there (simple append for now)
      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) {
          const div = document.createElement('div');
          div.textContent = msg;
          target.appendChild(div);
          target.scrollTop = target.scrollHeight;
        }
      }

      const progressMatch = msg.match(/\[PROGRESS(?::([^\]]+))?\]/);
      const isProgress = !!progressMatch;
      const progressId = progressMatch ? progressMatch[1] : null;

      const formattedHTML = this.formatLine(msg);
      let targetLine = null;

      if (isProgress && progressId) {
        targetLine = this.progressLines.get(progressId);
      }

      if (targetLine) {
        targetLine.innerHTML = formattedHTML;
        if (
          msg.includes('100%') ||
          msg.includes('complete') ||
          msg.includes('Success') ||
          msg.includes('Skipped')
        ) {
          targetLine.dataset.type = 'finished';
          if (progressId) this.progressLines.delete(progressId);
        }
      } else {
        const div = document.createElement('div');
        div.className = 'terminal-line';
        if (isProgress) {
          div.dataset.type = 'progress';
          if (progressId) {
            div.dataset.id = progressId;
            this.progressLines.set(progressId, div);
          }
        }
        div.innerHTML = formattedHTML;
        fragment.appendChild(div);
      }
    }

    if (fragment.childElementCount > 0) {
      this.terminal.appendChild(fragment);
    }

    // Prune terminal size
    while (this.terminal.childElementCount > this.MAX_LINES) {
      const first = this.terminal.firstElementChild;
      if (first.dataset.id) this.progressLines.delete(first.dataset.id);
      this.terminal.removeChild(first);
    }

    this.terminal.scrollTop = this.terminal.scrollHeight;

    if (this.queue.length > 0) {
      requestAnimationFrame(() => this.processQueue());
    } else {
      this.isProcessing = false;
    }
  },

  formatLine(text) {
    if (!text.match(/^\[[0-9: ]+\]/)) {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      text = `[${timeStr}] ${text}`;
    }

    const fullMatch = text.match(/^(\[[0-9: ]+\])\s*(?:\[([^\]]+)\])\s*(.*)/s);
    if (fullMatch) {
      const timestamp = fullMatch[1];
      const rawTag = fullMatch[2];
      const content = fullMatch[3];
      const displayTag = rawTag.startsWith('PROGRESS') ? 'PROGRESS' : rawTag;
      const tagClass = `tag-${displayTag.toLowerCase()}`;
      return `<span class="log-timestamp">${timestamp}</span><span class="log-tag ${tagClass}">[${displayTag}]</span><span class="log-msg">${content}</span>`;
    }

    const fallbackMatch = text.match(/^(\[[0-9: ]+\])?\s*(.*)/s);
    if (fallbackMatch) {
      return `<span class="log-timestamp">${fallbackMatch[1] || ''}</span><span class="log-tag"></span><span class="log-msg">${fallbackMatch[2]}</span>`;
    }
    return `<span class="log-msg">${text}</span>`;
  },
};
