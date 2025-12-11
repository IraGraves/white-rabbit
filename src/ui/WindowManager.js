/**
 * @file WindowManager.js
 * @description Central window management system for creating and controlling floating UI windows.
 *
 * This singleton class manages all floating windows in the application, providing a unified API for
 * window creation, visibility toggling, z-index ordering, and drag behavior. Windows snap to screen edges
 * for better organization and can be dragged from anywhere except interactive controls.
 *
 * Key features:
 * - Window creation with customizable position, size, and callbacks
 * - Z-index management for focus and layering (auto-incrementing from 1000)
 * - Drag-to-move with 20px snap zones at screen edges
 * - Smart drag detection: Excludes buttons, inputs, and time controls
 * - Visibility management (show/hide/toggle)
 * - Close button with optional onClose callback
 * - transform3d positioning for GPU acceleration
 *
 * Used by Time & Speed window, Info Window, and tabbed Visual Tools window.
 * The system maintains a Map of all windows for efficient lookups and state management.
 */
export class WindowManager {
  constructor() {
    this.windows = new Map();
    this.zIndexCounter = 1000;
    this.container = document.body; // Or a specific UI container

    // Bind handler (debounce could be added if performance is an issue, but standard resize is usually fine for few windows)
    window.addEventListener('resize', () => this._handleResize());
  }

  /**
   * Creates or returns an existing window
   * @param {string} id - Unique ID for the window
   * @param {string} title - Window title
   * @param {object} options - Options: { x, y, width, height, onClose }
   */
  createWindow(id, _title, options = {}) {
    if (this.windows.has(id)) {
      return this.windows.get(id);
    }

    const win = document.createElement('div');
    win.id = id;
    win.className = 'ui-window';
    win.style.zIndex = this.zIndexCounter++;

    // Default position/size
    let x = options.x || 100;
    let y = options.y || 100;

    // Initial Snap Logic
    let snapX = 'none';
    let snapY = 'none';
    const SNAP_PADDING = 20;

    if (options.snap) {
      if (options.snap.x === 'right') {
        // Need to know width immediately, but we might only have it as string in options
        // or not until appended.
        // We can set style.right for now? Or just calculate if we have fixed width.
        // For TabbedWindow, width is passed as '300px' usually or default.
        // WindowManager usually relies on translate3d.

        // Let's rely on standard width if provided.
        // If width is string '300px', we can parse it.
        let widthVal = 300; // default assumption if not retrievable easily yet
        if (options.width && typeof options.width === 'string' && options.width.endsWith('px')) {
          widthVal = parseInt(options.width, 10);
        }

        x = window.innerWidth - widthVal - SNAP_PADDING;
        snapX = 'right';
      } else if (options.snap.x === 'left') {
        x = SNAP_PADDING;
        snapX = 'left';
      }

      if (options.snap.y === 'bottom') {
        // Height is tricky as it is often content-dependent 'auto'.
        // If 'auto', we can't know Y until render.
        // We might need a post-render snap update?
        // Or we set bottom-aligned style or just initial large Y and let it correct?
        // Let's try to infer if height is known, otherwise maybe we need a callback after append.

        let heightVal = 400; // heuristic
        if (options.height && typeof options.height === 'string' && options.height.endsWith('px')) {
          heightVal = parseInt(options.height, 10);
        }

        // If auto, we really should measure after append.
        // Let's set it to some value, then update after append.
        y = window.innerHeight - heightVal - SNAP_PADDING;
        snapY = 'bottom';
      } else if (options.snap.y === 'top') {
        y = SNAP_PADDING;
        snapY = 'top';
      }
    }

    win.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    if (options.width) win.style.width = options.width;
    if (options.height) win.style.height = options.height;

    win.innerHTML = `
      <div class="window-header">
        <span class="window-title">${_title || ''}</span>
        <div class="window-close">×</div>
      </div>
      <div class="window-content"></div>
    `;

    this.container.appendChild(win);

    // Update position for 'auto' height if snapped to bottom
    if (snapY === 'bottom') {
      const rect = win.getBoundingClientRect();
      y = window.innerHeight - rect.height - SNAP_PADDING;
      win.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    // Also update X if it was 'right' snap and we guessed width
    if (snapX === 'right') {
      const rect = win.getBoundingClientRect();
      x = window.innerWidth - rect.width - SNAP_PADDING;
      win.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    // Store reference
    const windowObj = {
      id,
      element: win,
      header: win.querySelector('.window-header'),
      content: win.querySelector('.window-content'),
      closeBtn: win.querySelector('.window-close'),
      x,
      y,
      snapState: { x: snapX, y: snapY }, // 'none', 'left', 'right' | 'none', 'top', 'bottom'
      onClose: options.onClose,
    };

    this.windows.set(id, windowObj);
    this._setupInteractions(windowObj);

    return windowObj;
  }

  getWindow(id) {
    return this.windows.get(id);
  }

  toggleWindow(id) {
    const win = this.windows.get(id);
    if (win) {
      if (win.element.style.display === 'none') {
        this.showWindow(id);
      } else {
        this.hideWindow(id);
      }
    }
  }

  showWindow(id) {
    const win = this.windows.get(id);
    if (win) {
      win.element.style.display = 'flex';
      this.bringToFront(id);
      // Re-apply snap on show in case resize happened while hidden?
      // Or just let the resize handler handle it if it happens.
      // If we want to be safe, we could call _updatePosition based on current bounds/snap,
      // but usually not strictly necessary if resize is global.
    }
  }

  hideWindow(id) {
    const win = this.windows.get(id);
    if (win) {
      win.element.style.display = 'none';
      if (win.onClose) win.onClose();
    }
  }

  bringToFront(id) {
    const win = this.windows.get(id);
    if (win) {
      win.element.style.zIndex = ++this.zIndexCounter;
    }
  }

  _setupInteractions(winObj) {
    // Dragging
    let isDragging = false;
    let startX, startY;
    let initialWinX, initialWinY;

    const onMouseDown = (e) => {
      // Allow dragging from anywhere in the window EXCEPT interactive elements
      // like buttons, inputs, or the close button itself.
      if (
        e.target.closest('button') ||
        e.target.closest('input') ||
        e.target.closest('.control-btn') || // Time controls
        e.target.closest('.speedometer-interaction') || // Speedometer
        e.target === winObj.closeBtn
      ) {
        return;
      }

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialWinX = winObj.x;
      initialWinY = winObj.y;
      this.bringToFront(winObj.id);
      // e.preventDefault(); // Don't prevent default globally, might block text selection if we want that?
      // But for dragging, usually we want to prevent selection.
      // Let's prevent default only if we are actually dragging?
      // Or just on mousedown to be safe.
      // e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newX = initialWinX + dx;
        let newY = initialWinY + dy;

        // Snapping Logic
        const SNAP_THRESHOLD = 20;
        const SNAP_PADDING = 20;
        const winWidth = winObj.element.offsetWidth;
        const winHeight = winObj.element.offsetHeight;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let snapX = 'none';
        let snapY = 'none';

        // Snap Left
        if (Math.abs(newX - SNAP_PADDING) < SNAP_THRESHOLD) {
          newX = SNAP_PADDING;
          snapX = 'left';
        }
        // Snap Right
        else if (Math.abs(newX - (screenWidth - winWidth - SNAP_PADDING)) < SNAP_THRESHOLD) {
          newX = screenWidth - winWidth - SNAP_PADDING;
          snapX = 'right';
        }

        // Snap Top
        if (Math.abs(newY - SNAP_PADDING) < SNAP_THRESHOLD) {
          newY = SNAP_PADDING;
          snapY = 'top';
        }
        // Snap Bottom
        else if (Math.abs(newY - (screenHeight - winHeight - SNAP_PADDING)) < SNAP_THRESHOLD) {
          newY = screenHeight - winHeight - SNAP_PADDING;
          snapY = 'bottom';
        }

        winObj.x = newX;
        winObj.y = newY;
        winObj.snapState = { x: snapX, y: snapY };

        winObj.element.style.transform = `translate3d(${winObj.x}px, ${winObj.y}px, 0)`;
        e.preventDefault(); // Prevent selection while dragging
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    winObj.element.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Close Button
    winObj.closeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent drag start if clicking close
      this.hideWindow(winObj.id);
    });

    // Focus on click (already handled by mousedown above essentially, but let's keep explicit bringToFront)
    winObj.element.addEventListener('mousedown', () => {
      this.bringToFront(winObj.id);
    });

    this._setupResizeObserver(winObj);
  }

  _setupResizeObserver(winObj) {
    const observer = new ResizeObserver((entries) => {
      for (const _entry of entries) {
        // const { width, height } = entry.contentRect; // Unused
        // We need the full element dimensions, contentRect might exclude border/padding if box-sizing is border-box?
        // ResizeObserver usually returns content box. But for positioning we usually care about offsetWidth/Height.
        // Let's us winObj.element.offsetWidth/Height which is safest for our translation logic.

        const winWidth = winObj.element.offsetWidth;
        const winHeight = winObj.element.offsetHeight;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const SNAP_PADDING = 20;

        let needsUpdate = false;

        // If snapped to right, update X
        if (winObj.snapState.x === 'right') {
          winObj.x = screenWidth - winWidth - SNAP_PADDING;
          needsUpdate = true;
        }

        // If snapped to bottom, update Y
        if (winObj.snapState.y === 'bottom') {
          winObj.y = screenHeight - winHeight - SNAP_PADDING;
          needsUpdate = true;
        }

        if (needsUpdate) {
          winObj.element.style.transform = `translate3d(${winObj.x}px, ${winObj.y}px, 0)`;
        }
      }
    });

    observer.observe(winObj.element);

    // Store observer to disconnect later if needed (e.g. on close/destroy?)
    // currently we don't fully destroy windows, just hide. So observer running is fine.
    winObj.resizeObserver = observer;
  }

  _handleResize() {
    const SNAP_PADDING = 20;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (const winObj of this.windows.values()) {
      let needsUpdate = false;
      const winWidth = winObj.element.offsetWidth;
      const winHeight = winObj.element.offsetHeight;

      // Handle Horizontal Snap
      if (winObj.snapState.x === 'right') {
        winObj.x = screenWidth - winWidth - SNAP_PADDING;
        needsUpdate = true;
      }
      // Note: 'left' snap doesn't need update on resize as 0 is always 0,
      // but if we were centering it might. 'left' is anchored to 20px.

      // Handle Vertical Snap
      if (winObj.snapState.y === 'bottom') {
        winObj.y = screenHeight - winHeight - SNAP_PADDING;
        needsUpdate = true;
      }

      // Optional: Ensure windows don't get lost off-screen even if not snapped
      // e.g. if I shrink window and a non-snapped window was at x=2000
      if (winObj.x + winWidth > screenWidth) {
        // Maybe just push it in? Or only if it was snapped?
        // For now, only handle explicit snap persistence as requested.
        // But "Windows that are 'snapped in' ... should remain in that position" implies only snapped ones.
      }

      if (needsUpdate) {
        winObj.element.style.transform = `translate3d(${winObj.x}px, ${winObj.y}px, 0)`;
      }
    }
  }
}

export const windowManager = new WindowManager();
