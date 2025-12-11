/**
 * @file gui.js
 * @description Main GUI orchestrator for the White Rabbit solar system simulator.
 *
 * This file manages the main menu GUI using lil-gui, coordinates the tabbed Visual Tools window,
 * and integrates with the WindowManager for floating windows. It serves as the central hub for
 * all UI setup and updates.
 *
 * Key responsibilities:
 * - Setting up the main menu with all folders (Find, Scale, Visual, Missions, Navigation, etc.)
 * - Creating the tabbed Visual Tools window (Objects, Asterisms, Orbits, Magnetism, Guides)
 * - Managing UI state synchronization with the WindowManager
 * - Providing the updateUI() function for frame-by-frame UI updates
 */
import GUI from 'lil-gui';
import * as THREE from 'three';
import { config, REAL_PLANET_SCALE_FACTOR, REAL_SUN_SCALE_FACTOR } from '../config';
import { menuDock } from './MenuDock';
import { setupAboutFolder } from './modules/about';
import { setupEventsControlsCustom } from './modules/events';
import { setupFindControlsCustom } from './modules/find';
import { setupMissionDetails, setupMissionList, updateMissionTimeline } from './modules/missions';
import { setupNavigationFolder } from './modules/navigation';

import { setupMusicWindow } from './modules/sound';
import { setupStarsTab } from './modules/starsTab';
import { setupSystemUI } from './modules/system';
import { setupSystemTab } from './modules/systemTab';
import { TabbedWindow } from './modules/TabbedWindow';
import { setupTimeFolder } from './modules/time';
import {
  setupAsterismsControlsCustom,
  setupGuidesControlsCustom,
  setupMagneticFieldsControlsCustom,
  setupObjectsControlsCustom,
  setupOrbitsControlsCustom,
  setupVisualFolder,
} from './modules/visual';
import { windowManager } from './WindowManager';

/**
 * Sets up the GUI with Scale, Visual, Time, and Navigation sections
 *
 * @param {Array} planets - Array of planet objects with mesh, moons, etc.
 * @param {THREE.Mesh} sun - The sun mesh
 * @param {THREE.Group} orbitGroup - Group containing planet orbit lines
 * @param {THREE.Group} zodiacGroup - Group containing zodiac constellation lines
 * @param {THREE.Points} stars - The starfield points object
 * @returns {Object} Object containing uiState and control references for updates
 *
 * - Navigation: Help text for camera and focus controls
 */
export function setupGUI(
  planets: any[],
  sun: THREE.Mesh,
  orbitGroup: THREE.Group,
  relativeOrbitGroup: THREE.Group,
  zodiacGroup: THREE.Group,
  asterismsGroup: THREE.Group,
  starsRef: { value: THREE.Points | null },
  renderer: THREE.WebGLRenderer,
  camera: THREE.Camera,
  controls: any,
  zodiacSignsGroup: THREE.Group,
  habitableZone: THREE.Object3D | null,
  magneticFieldsGroup: THREE.Group,
  universeGroup: THREE.Group,
  constellationsGroup: THREE.Group
): { uiState: any; dateCtrl: any; timeCtrl: any; stardateCtrl: any; speedDisplay: any } {
  const gui = new GUI({ title: '⚙️' });
  gui.domElement.classList.add('main-gui');
  // gui.close(); // Start closed or maybe open? Let's keep it closed as we have the dock now.
  gui.close();

  const uiState = {
    speedExponent: 0,
    date: '',
    time: '',
    stardate: '',
    speedFactor: '0x',
    planetScaleDisplay: `${(1 * REAL_PLANET_SCALE_FACTOR).toFixed(0)}x`,
    sunScaleDisplay: `${(1 * REAL_SUN_SCALE_FACTOR).toFixed(1)}x`,
    rotate: 'Left Click + Drag',
    pan: 'Right Click + Drag',
    zoom: 'Scroll',
    focusEnter: 'Double Click Object',
    focusExit: 'Escape Key',
    fullScreen: 'F11',
    scalePreset: 'Artistic',
    timeWindow: false,
    objectInfo: false,
    musicWindow: false,
    dock: true,
    visualWindow: false,
    explorerWindow: false,
  };

  let scaleCtrl: { setScalePreset: (preset: string) => void } = {
    setScalePreset: (preset: string) => {},
  }; // Placeholder

  // --- SETUP DOCK ---
  menuDock.addItem('objects', '👆', 'Object Info', () => {
    // For now, we don't have a dedicated Objects window, maybe we can toggle the Objects folder in lil-gui?
    // Or just open the "Object Info" window?
    // Let's open Object Info window for now as a placeholder or "Inspector"
    windowManager.toggleWindow('object-info');
  });

  menuDock.addItem('time', '⏱️', 'Time & Speed', () => {
    windowManager.toggleWindow('time-window');
  });

  menuDock.addItem('music', '🎵', 'Music', () => {
    windowManager.toggleWindow('music-window');
  });

  // --- FIND SECTION ---
  // setupFindFolder removed from here

  // --- TIME SECTION ---
  // We still call this to setup the window, but we don't pass 'gui' if we don't want it in the menu.
  // Actually setupTimeFolder in our refactor DOES NOT use 'gui' anymore except maybe to close it?
  // Let's check time.js... it doesn't use gui.addFolder anymore.
  // It returns controls.
  const { dateCtrl, timeCtrl, stardateCtrl, speedDisplay } = setupTimeFolder(gui, uiState, config);

  // --- VISUAL TOOLS WINDOW (Tabbed) ---
  const visualWindow = new TabbedWindow('visual-tools', 'Visual Tools', {
    width: '320px',
    height: 'auto',
    snap: { x: 'right', y: 'top' },
    tabOrder: ['objects', 'orbits', 'magnetic', 'guides', 'stars', 'asterisms', 'system'],
  });

  // Helper to create a tab with an embedded lil-gui

  // Helper to create a tab with custom content
  const createCustomTab = (id: string, title: string, iconOrSetup: any, setupFn?: any) => {
    let icon = '';
    let setup = setupFn;

    // Handle overload: (id, title, setupFn)
    if (typeof iconOrSetup === 'function') {
      setup = iconOrSetup;
      icon = ''; // Default icon
    } else {
      icon = iconOrSetup;
    }

    if (typeof setup !== 'function') {
      return;
    }

    const container = document.createElement('div');
    container.style.width = '100%';

    setup(container);
    visualWindow.addTab(id, title, container, icon);
  };

  // createGuiTab('objects', 'Objects', (g) => setupObjectsControls(g, planets, sun));

  createCustomTab('objects', 'Bodies', '🪐', (container: HTMLElement) =>
    setupObjectsControlsCustom(container, planets, sun)
  );

  createCustomTab('orbits', 'Orbits', '💫', (container: HTMLElement) =>
    setupOrbitsControlsCustom(container, orbitGroup, planets, relativeOrbitGroup)
  );
  createCustomTab('magnetic', 'Magnetism', '🧲', (container: HTMLElement) =>
    setupMagneticFieldsControlsCustom(container, magneticFieldsGroup, planets, universeGroup)
  );
  createCustomTab('guides', 'Guides', '📐', (container: HTMLElement) =>
    setupGuidesControlsCustom(container, sun, planets, habitableZone)
  );

  createCustomTab('stars', 'Stars', '✨', (container: HTMLElement) =>
    setupStarsTab(container, starsRef, renderer)
  );

  createCustomTab(
    'asterisms',
    'Asterisms',
    '<span style="font-size:1.5em;font-weight:bold">☆</span>',
    (container: HTMLElement) =>
      setupAsterismsControlsCustom(
        container,
        zodiacGroup,
        asterismsGroup,
        zodiacSignsGroup,
        constellationsGroup
      )
  );

  createCustomTab('system', 'System', '☀️', (container: HTMLElement) => {
    const ctrl = setupSystemTab(
      container,
      uiState,
      planets,
      sun,
      universeGroup,
      orbitGroup,
      relativeOrbitGroup
    );
    scaleCtrl = ctrl;
  });

  // --- SCALE SECTION ---
  // Scale controls moved to System tab in Visual Tools
  // const scaleCtrl = setupScaleFolder(gui, uiState, planets, sun, universeGroup);
  // We need to provide the `setScalePreset` function to uiState or other modules if they use it.
  // The setupSystemTab returns { setScalePreset }. We should capture it.
  // However, setupSystemTab is called inside the createCustomTab callback, which is delayed?
  // No, createCustomTab executes the setup immediately when building?
  // Wait, standard createCustomTab implementation (checked earlier) calls setup(container) immediately.
  // So we can capture the return value if we modify createCustomTab or the callback.

  // We need to re-define the callback to capture the result
  // But setupSystemTab returns the object.
  // We can do:
  /*
  createCustomTab('system', 'System', '☀️', (container) => {
    const ctrl = setupSystemTab(container, uiState, planets, sun, universeGroup, orbitGroup, relativeOrbitGroup);
    scaleCtrl = ctrl;
  });
  */

  // --- EXPLORER WINDOW (Tabbed) ---
  const explorerWindow = new TabbedWindow('explorer-window', 'Explorer', {
    width: '320px', // Matches Visual Window
    height: 'auto',
    snap: { x: 'right', y: 'bottom' },
    tabOrder: ['find', 'missions', 'mission-details', 'events'],
  });

  // Helper for Explorer tabs (reused logic)
  const createExplorerTab = (id: string, title: string, icon: string, setupFn: any) => {
    const container = document.createElement('div');
    container.style.width = '100%';
    setupFn(container);
    explorerWindow.addTab(id, title, container, icon);
  };

  createExplorerTab('find', 'Find', '🔍', (container: HTMLElement) =>
    setupFindControlsCustom(container, planets, sun, starsRef, camera, controls)
  );
  createExplorerTab('missions', 'Missions', '🚀', (container: HTMLElement) =>
    setupMissionList(container, config)
  );
  createExplorerTab('mission-details', 'Story', '🎞️', (container: HTMLElement) =>
    setupMissionDetails(container, config)
  );
  createExplorerTab('events', 'Events', '📅', (container: HTMLElement) =>
    setupEventsControlsCustom(container, camera, controls, planets, scaleCtrl.setScalePreset)
  );

  // Swapped order: Explorer icon first, then Visuals
  // Actually, user just said "Swap the icons". Currently 'visuals' was first (line 190ish in original logic implied), but let's see current file state.
  // In the file read, line 171 was 'visuals', then Explorer window creation, then Explorer icon.
  // So 'visuals' was first. Swapping means 'explorer' should come before 'visuals'.

  menuDock.addItem('explorer', '🧭', 'Explorer', () => {
    explorerWindow.toggle();
  });

  menuDock.addItem('visuals', '👁️', 'Visual Tools', () => {
    visualWindow.toggle();
  });

  menuDock.addItem('fullscreen', '⛶', 'Full Screen', () => {
    const doc = document as any;
    const docEl = document.documentElement as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  });

  // --- SCALE SECTION ---
  // Moved up

  // --- VISUAL SECTION ---
  setupVisualFolder(
    gui,
    starsRef,
    renderer,
    universeGroup,
    planets,
    sun,
    orbitGroup,
    relativeOrbitGroup,
    uiState // Pass uiState
  );

  // --- MISSIONS SECTION ---
  // setupMissionsFolder(gui, config); // Removed

  // --- EVENTS SECTION ---
  // setupEventsFolder(gui, camera, controls, planets, scaleCtrl.setScalePreset); // Removed

  // --- NAVIGATION SECTION ---
  setupNavigationFolder(gui, uiState);

  // --- SOUND SECTION ---
  // setupSoundUI(gui); // Removed, moved to window
  setupMusicWindow();

  // --- WINDOWS SECTION ---
  // Removed as per request (Time & Speed, Object Info, Music handled via Dock)
  // Dock toggle moved to Visual section.

  // --- SYSTEM SECTION ---
  setupSystemUI(gui, renderer);

  // --- ABOUT SECTION ---
  setupAboutFolder(gui);

  return { uiState, dateCtrl, timeCtrl, stardateCtrl, speedDisplay };
}

/**
 * Updates the UI display values each frame
 *
 * @param {Object} uiState - UI state object containing display values
 * @param {Object} controls - Object containing GUI control references
 *
 * Updates:
 * - Date, time, and stardate displays
 * - Speed factor (with "Paused" indicator when speed is 0)
 * - Moon orbit scale display (compound of planet and moon scales)
 * - Custom value displays for all sliders
 */
export function updateUI(uiState: any, controls: any): void {
  const y = config.date.getFullYear();
  const m = String(config.date.getMonth() + 1).padStart(2, '0');
  const d = String(config.date.getDate()).padStart(2, '0');
  const dateString = `${y}-${m}-${d}`;
  uiState.date = dateString;
  uiState.time = config.date.toLocaleTimeString();

  const startOfYear = new Date(config.date.getFullYear(), 0, 0);
  const diff = config.date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  uiState.stardate = (config.date.getFullYear() + dayOfYear / 365).toFixed(2);

  if (config.simulationSpeed === 0) {
    uiState.speedFactor = '0x';
  } else {
    uiState.speedFactor = `${Math.round(config.simulationSpeed).toLocaleString()}x`;
  }

  // Manually update the date input value (lil-gui doesn't handle date inputs well)
  const dateInput = controls.dateCtrl.domElement.querySelector('input');
  if (dateInput && dateInput.value !== dateString) {
    dateInput.value = dateString;
  }

  controls.dateCtrl.updateDisplay();
  controls.timeCtrl.updateDisplay();
  controls.stardateCtrl.updateDisplay();

  // Update custom value displays
  if (controls.speedDisplay) controls.speedDisplay.update();

  // Sync Window States
  const timeWin = windowManager.getWindow('time-window');
  if (timeWin) {
    uiState.timeWindow = timeWin.element.style.display !== 'none';
  }

  const infoWin = windowManager.getWindow('object-info');
  if (infoWin) {
    uiState.objectInfo = infoWin.element.style.display !== 'none';
  }

  const musicWin = windowManager.getWindow('music-window');
  if (musicWin) {
    uiState.musicWindow = musicWin.element.style.display !== 'none';
    if (musicWin.update) musicWin.update();
  }

  const visualWin = windowManager.getWindow('visual-tools');
  if (visualWin) {
    uiState.visualWindow = visualWin.element.style.display !== 'none';
  }

  if (menuDock.dock) {
    uiState.dock = menuDock.dock.style.display !== 'none';
  }

  const explorerWin = windowManager.getWindow('explorer-window');
  if (explorerWin) {
    uiState.explorerWindow = explorerWin.element.style.display !== 'none';
    if (uiState.explorerWindow) {
      updateMissionTimeline(config);
    }
  }
}
