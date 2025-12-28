/**
 * @file WindowManager.ts
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
export interface WindowConfig {
  x?: number;
  y?: number;
  width?: string;
  height?: string;
  snap?: { x?: 'left' | 'right'; y?: 'top' | 'bottom' };
  onClose?: () => void;
  [key: string]: unknown;
}

export interface WindowState {
  id: string;
  element: HTMLElement;
  header: HTMLElement;
  content: HTMLElement;
  closeBtn: HTMLElement;
  x: number;
  y: number;
  snapState: { x: string; y: string };
  onClose?: () => void;
  resizeObserver?: ResizeObserver;
  controller?: { selectTab?: (tabId: string) => void };
  update?: () => void;
}

export class WindowManager {
  windows: Map<string, WindowState>;
  zIndexCounter: number;
  container: HTMLElement;

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
   * @param {WindowConfig} options - Options: { x, y, width, height, onClose }
   */
  createWindow(id: string, _title: string, options: WindowConfig = {}): WindowState {
    if (this.windows.has(id)) {
      return this.windows.get(id) as WindowState;
    }

    const win = document.createElement('div');
    win.id = id;
    win.className = 'ui-window';
    win.style.zIndex = this.zIndexCounter++ + '';

    // Default position/size
    let x = options.x || 100;
    let y = options.y || 100;

    // Initial Snap Logic
    let snapX = 'none';
    let snapY = 'none';
    const SNAP_PADDING = 20;

    if (options.snap) {
      if (options.snap.x === 'right') {
        // Calculate position based on width
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
        // Height is often content-dependent ('auto'), so estimate initial position and correct after render
        let heightVal = 400; // Heuristic default
        if (options.height && typeof options.height === 'string' && options.height.endsWith('px')) {
          heightVal = parseInt(options.height, 10);
        }

        // Set initial position, will be corrected after append
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
    const windowObj: WindowState = {
      id,
      element: win,
      header: win.querySelector('.window-header') as unknown as HTMLElement,
      content: win.querySelector('.window-content') as unknown as HTMLElement,
      closeBtn: win.querySelector('.window-close') as unknown as HTMLElement,
      x,
      y,
      snapState: { x: snapX, y: snapY }, // 'none', 'left', 'right' | 'none', 'top', 'bottom'
      onClose: options.onClose,
    };

    this.windows.set(id, windowObj);
    this._setupInteractions(windowObj);

    return windowObj;
  }

  getWindow(id: string) {
    return this.windows.get(id);
  }

  toggleWindow(id: string) {
    const win = this.windows.get(id);
    if (win) {
      if (win.element.style.display === 'none') {
        this.showWindow(id);
      } else {
        this.hideWindow(id);
      }
    }
  }

  showWindow(id: string) {
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

  hideWindow(id: string) {
    const win = this.windows.get(id);
    if (win) {
      win.element.style.display = 'none';
      if (win.onClose) win.onClose();
    }
  }

  bringToFront(id: string) {
    const win = this.windows.get(id);
    if (win) {
      win.element.style.zIndex = ++this.zIndexCounter + '';
    }
  }

  _setupInteractions(winObj: WindowState) {
    // Dragging
    let isDragging = false;
    let startX = 0,
      startY = 0;
    let initialWinX = 0,
      initialWinY = 0;

    const onMouseDown = (e: MouseEvent) => {
      // Allow dragging from anywhere in the window EXCEPT interactive elements
      // like buttons, inputs, or the close button itself.
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('.control-btn') || // Time controls
        target.closest('.speedometer-interaction') || // Speedometer
        target === winObj.closeBtn
      ) {
        return;
      }

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialWinX = winObj.x;
      initialWinY = winObj.y;
      this.bringToFront(winObj.id);
      document.body.style.cursor = 'default';
    };

    const onMouseMove = (e: MouseEvent) => {
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

    winObj.element.addEventListener('mousedown', onMouseDown as EventListener);
    document.addEventListener('mousemove', onMouseMove as EventListener);
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

  _setupResizeObserver(winObj: WindowState) {
    const observer = new ResizeObserver((entries) => {
      for (const _entry of entries) {
        // Use offsetWidth/Height for accurate positioning calculations

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

      // Non-snapped windows may go off-screen but are not automatically repositioned

      if (needsUpdate) {
        winObj.element.style.transform = `translate3d(${winObj.x}px, ${winObj.y}px, 0)`;
      }
    }
  }
}

export const windowManager = new WindowManager();
