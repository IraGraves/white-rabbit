/**
 * @file Simulation.ts
 * @description Main simulation class that orchestrates the entire White Rabbit application.
 *
 * This class serves as the core orchestrator, managing the initialization, animation loop,
 * and coordination of all simulation subsystems. It instantiates the Three.js scene, creates
 * celestial bodies, sets up the GUI, and manages the frame-by-frame update cycle.
 *
 * Key responsibilities:
 * - Initializing the Three.js scene, camera, renderer, and controls
 * - Creating planets, moons, stars, and other celestial objects
 * - Setting up GUI, tooltips, focus mode, and mission trajectories
 * - Running the main animation loop and updating all subsystems
 * - Managing magnetic field animations and coordinate system transformations
 * - Exposing the SimulationControl API for programmatic access
 *
 * The simulation uses a class-based architecture for better encapsulation and state management.
 */

import Stats from 'stats.js';
import * as THREE from 'three';
import { SimulationControl } from '../api/SimulationControl';
import { config } from '../config';
import { OriginAwareArcballControls } from '../controls/OriginAwareArcballControls';
import { setupFocusMode, updateFocusMode } from '../features/focusMode';
import {
  initializeMissions,
  resizeMissionVisuals,
  setMissionProbeScene,
  setupMissionInteraction,
  syncMissionProbes,
  updateMissionProbes,
  updateMissions,
  updateMissionTrajectories,
  updateMissionVisuals,
} from '../features/missions';
import { updateCoordinateSystem } from '../systems/coordinates';
import { createHabitableZone } from '../systems/habitableZone';
import {
  createMagneticField,
  createSunMagneticField,
  createSunMagneticFieldBasic,
} from '../systems/magneticFields';
import { resizeMoons, updateAllMoonOrbitGradients } from '../systems/moons';
import { musicSystem } from '../systems/music';
import { resizeHeliocentricOrbits, updateAllOrbitGradients } from '../systems/orbits';
import { createRabbit } from '../systems/rabbit';
import { resizeRelativeOrbits, updateRelativeOrbits } from '../systems/relativeOrbits';
import { setupTooltipSystem } from '../systems/tooltips';
import { alignZodiacSigns, createZodiacSigns } from '../systems/zodiacSigns';
import type { CustomWindow, GUIControls, PlanetWrapper, RabbitSystem } from '../types';
import { setupGUI, updateUI } from '../ui/gui';
import { Logger } from '../utils/logger';
import { createPlanets, updatePlanets } from './planets';
import { createScene } from './scene';
import { createAsterisms, createConstellations, createStarfield } from './stars';
import { CompositionManager } from '../managers/CompositionManager'; // Import CompositionManager

export class Simulation {
  scene: THREE.Scene | null;
  composition: CompositionManager | null; // Add CompositionManager
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;

  controls: OriginAwareArcballControls | null;
  universeGroup: THREE.Group | null;
  config: typeof config;
  planets: PlanetWrapper[];
  sun: THREE.Mesh | null;
  orbitGroup: THREE.Group | null;
  relativeOrbitGroup: THREE.Group | null;
  zodiacGroup: THREE.Group | null;
  starsRef: { value: THREE.Group | null };
  uiControls: GUIControls | null;
  rabbit: RabbitSystem | null;
  clock: THREE.Clock;
  magneticFieldTime: number;
  shadowLight: THREE.SpotLight | null;
  sunLight: THREE.PointLight | null;
  magneticFieldsGroup: THREE.Group | null;
  missionGroup: THREE.Group | null;
  cleanupMissionInteraction: (() => void) | null;
  stats: Stats | null;

  constructor() {
    this.scene = null;
    this.composition = null;
    this.camera = null;

    this.renderer = null;
    this.controls = null;
    this.universeGroup = null;
    this.config = config;
    this.planets = [];
    this.sun = null;
    this.orbitGroup = null;
    this.relativeOrbitGroup = null;
    this.zodiacGroup = null;
    this.starsRef = { value: null };
    this.uiControls = null;
    this.rabbit = null;
    this.clock = new THREE.Clock();
    this.magneticFieldTime = 0;
    this.shadowLight = null;
    this.sunLight = null;
    this.magneticFieldsGroup = null;
    this.missionGroup = null;
    this.cleanupMissionInteraction = null;
    this.stats = null;

    // Note: controls created later as VirtualCameraControls after universeGroup exists
  }

  /** Handles browser window resize, updating camera aspect ratio and resolution-dependent systems. */
  onWindowResize() {
    if (!this.camera || !this.renderer || !this.composition) return;
    this.composition.resize(window.innerWidth, window.innerHeight);
    // this.camera.aspect and renderer.setSize handled by composition.resize

    resizeMissionVisuals(window.innerWidth, window.innerHeight);
    resizeRelativeOrbits(window.innerWidth, window.innerHeight);
    resizeHeliocentricOrbits(window.innerWidth, window.innerHeight);
    resizeMoons(window.innerWidth, window.innerHeight);
  }

  /** Initializes the entire simulation: scene, planets, GUI, stars, and starts the animation loop. */
  async init(): Promise<void> {
    try {
      this.stats = new Stats();
      this.stats.dom.style.display = 'none';
      this.stats.dom.id = 'fps-stats';
      document.body.appendChild(this.stats.dom);

      Logger.log('White Rabbit Version: 1.3 (Class-based Init)');
      const loading = document.getElementById('loading');
      if (loading) {
        loading.textContent = `Initializing... (Base: ${import.meta.env.BASE_URL})`;
      }

      // 1. Setup Scene
      if (loading) loading.textContent = 'Creating Scene...';
      const { scene, camera, renderer, orbitGroup, zodiacGroup, sunLight, shadowLight } =
        createScene();

      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;
      this.orbitGroup = orbitGroup;
      this.zodiacGroup = zodiacGroup;
      this.shadowLight = shadowLight;
      this.sunLight = sunLight;

      // 1.1 Init CompositionManager
      this.composition = new CompositionManager(renderer, camera);
      this.composition.worldScene = scene; // Use the created scene as World Layer

      // Add Sun Light to Foreground Scene (to light probes)
      const fgSunLight = sunLight.clone();
      fgSunLight.name = 'ForegroundSunLight';
      this.composition.foregroundScene.add(fgSunLight);

      (window as unknown as CustomWindow).scene = scene; // Expose for debugging

      // Create Universe Group (Root for all celestial objects)
      this.universeGroup = new THREE.Group();
      // scene.add(this.universeGroup); // OLD: Added to single scene
      this.composition.worldScene.add(this.universeGroup); // NEW: Add to World Scene

      // Add lights to universeGroup
      this.universeGroup.add(sunLight);
      this.universeGroup.add(shadowLight);

      // Add groups to universe
      this.universeGroup.add(orbitGroup);
      // this.universeGroup.add(zodiacGroup); // OLD: Zodiacs in World
      this.composition.backgroundScene.add(zodiacGroup); // NEW: Zodiacs in Background

      // Create OriginAwareArcballControls - extends ArcballControls with origin-aware positioning
      // Intercepts camera movement and moves universe group instead for float32 precision
      if (scene && this.universeGroup) {
        this.controls = new OriginAwareArcballControls(
          camera,
          renderer.domElement,
          scene,
          this.universeGroup
        );
      }
      if (this.controls) {
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        if (typeof this.controls.setGizmosVisible === 'function') {
          this.controls.setGizmosVisible(false);
        }
      }
      if (this.controls) (window as unknown as CustomWindow).controls = this.controls; // Expose for debugging

      const asterismsGroup = new THREE.Group();
      // this.universeGroup.add(asterismsGroup); // OLD
      this.composition.backgroundScene.add(asterismsGroup); // NEW
      asterismsGroup.visible = config.showAsterisms;

      zodiacGroup.visible = config.showZodiacs;

      const constellationsGroup = new THREE.Group();
      // this.universeGroup.add(constellationsGroup); // OLD
      this.composition.backgroundScene.add(constellationsGroup); // NEW
      constellationsGroup.visible = config.showConstellations;

      // 1.5 Create Zodiac Signs
      const textureLoader = new THREE.TextureLoader();
      // Pass backgroundScene instead of universeGroup?
      // Zodiac Signs (images) should probably be in Background too?
      // Existing: createZodiacSigns(this.universeGroup...
      // Let's put them in Background for now as they are usually backdrop.
      const zodiacSignsGroup = createZodiacSigns(this.composition.backgroundScene, textureLoader);

      // 1.6 Create Habitable Zone
      const habitableZone = createHabitableZone(this.universeGroup);

      // 2. Create Planets & Sun (Immediate)
      if (loading) loading.textContent = 'Loading Planets...';
      const { planets, sun } = createPlanets(this.universeGroup, orbitGroup);
      this.planets = planets;
      this.sun = sun;

      // 2.5 Create Magnetic Fields
      this.setupMagneticFields();

      this.relativeOrbitGroup = new THREE.Group();
      this.universeGroup.add(this.relativeOrbitGroup);

      // 3. Setup GUI & Interactions (Immediate)
      if (loading) loading.textContent = 'Setting up GUI...';

      if (this.controls && this.magneticFieldsGroup && this.universeGroup) {
        this.uiControls = setupGUI(
          planets,
          sun,
          orbitGroup,
          this.relativeOrbitGroup,
          zodiacGroup,
          asterismsGroup,
          this.starsRef,
          renderer,
          camera,
          this.controls,
          zodiacSignsGroup,
          habitableZone,
          this.magneticFieldsGroup, // Use the stored group
          this.universeGroup,
          constellationsGroup
        );
      }

      setupTooltipSystem(camera, planets, sun, this.starsRef, zodiacGroup, asterismsGroup);
      if (this.controls) {
        setupFocusMode(camera, this.controls, planets, sun);
      }

      // Create dedicated group for missions
      // We add it to universeGroup so it moves with the rest of the solar system during origin rebasing
      this.missionGroup = new THREE.Group();
      if (this.universeGroup) {
        this.universeGroup.add(this.missionGroup);
      }
      initializeMissions(this.missionGroup);
      // IDENTITY RULE: Probes must be direct children of Scene (not missionGroup)
      // This ensures probe.matrixWorld matches probe.matrix (no parent transforms)
      // The rebased coordinates are: probe.position = helio - virtualCameraPos
      setMissionProbeScene(this.composition.foregroundScene); // NEW: Probes in Foreground Scene

      // Setup Mission Interaction (Click to Select)
      // We pass the domElement to listen for clicks
      if (this.camera) {
        this.cleanupMissionInteraction = setupMissionInteraction(
          this.camera,
          this.missionGroup,
          this.renderer ? this.renderer.domElement : document.body
        );
      }

      (window as unknown as CustomWindow).updateMissions = () => {
        updateMissions();
        syncMissionProbes();
      };

      // Listen for mission visibility changes to toggle linked celestial bodies (e.g. Tesla Roadster)
      window.addEventListener('mission-visibility-changed', (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail && detail.missionId === 'teslaRoadster') {
          const roadster = this.planets.find((p) => p.data.name === 'Tesla Roadster');
          if (roadster) {
            const isVisible = config.showMissions.teslaRoadster;
            if (roadster.group) {
              roadster.group.visible = isVisible;
            }
            if (roadster.orbitLine) {
              roadster.orbitLine.visible = isVisible;
            }
          }
        }
      });

      // Initialize relative orbits
      updateRelativeOrbits(orbitGroup, this.relativeOrbitGroup, planets, sun);

      // 3.1 Setup Simulation Control API
      if (this.controls && this.magneticFieldsGroup && this.universeGroup) {
        (window as unknown as CustomWindow).SimulationControl = new SimulationControl(
          planets,
          sun,
          orbitGroup,
          zodiacGroup,
          asterismsGroup,
          this.starsRef,
          camera,
          this.controls,
          zodiacSignsGroup,
          habitableZone,
          this.magneticFieldsGroup,
          this.universeGroup,
          this.jumpToDate
        );
      }

      // Force initial resolution update for Mission Lines (Line2)
      resizeMissionVisuals(window.innerWidth, window.innerHeight);

      // 3.5 Setup Rabbit Intro
      this.rabbit = createRabbit(renderer);

      // 4. Remove Loading Screen (Immediate)
      if (loading) {
        loading.style.opacity = '0';
        loading.style.pointerEvents = 'none';
      }

      // 6. Initialize Music System (After page is interactive)
      setTimeout(() => {
        musicSystem.init();
      }, 100);

      // 7. Load Stars & Constellations (Background)
      createStarfield(this.composition.backgroundScene) // NEW: Stars in Background
        .then(({ stars, rawData }) => {
          if (stars) {
            this.starsRef.value = stars;
            this.starsRef.value = stars;
            // Opacity now handled by StarManager internally based on config
            createAsterisms(zodiacGroup, asterismsGroup, rawData);
            createConstellations(constellationsGroup); // Add boundaries to dedicated group
            alignZodiacSigns(zodiacSignsGroup);
          }
        })
        .catch((err) => Logger.error('Error loading stars:', err));

      // Start Animation Loop
      this.animate();
    } catch (error) {
      Logger.error('Initialization error:', error);
      const loadingEl = document.getElementById('loading');
      if (loadingEl) {
        loadingEl.textContent = `Error loading simulation: ${error instanceof Error ? error.message : 'Unknown error'}`;
        loadingEl.style.color = 'red';
      }
    }
  }

  /** Creates magnetic field visualizations for the Sun and all bodies with magnetic field data. */
  setupMagneticFields() {
    this.magneticFieldsGroup = new THREE.Group();
    this.magneticFieldsGroup.visible = config.showMagneticFields;
    if (!this.universeGroup) return;
    this.universeGroup.add(this.magneticFieldsGroup);

    // Sun field - Basic
    if (this.sun) {
      const sunFieldBasic = createSunMagneticFieldBasic(this.sun);
      if (sunFieldBasic) {
        sunFieldBasic.visible = config.showSunMagneticFieldBasic;
        this.universeGroup.add(sunFieldBasic);
      }
    }

    // Sun field - Parker Spiral
    if (this.sun) {
      const sunField = createSunMagneticField(this.sun);
      if (sunField) {
        sunField.visible = config.showSunMagneticField;
        this.universeGroup.add(sunField);
      }
    }

    this.planets.forEach((p) => {
      if (p.data.magneticField) {
        const field = createMagneticField(p.data, p.data.radius);
        if (field) p.mesh.add(field);
      }
      p.moons?.forEach((m) => {
        if (m.data.magneticField) {
          const field = createMagneticField(m.data, m.data.radius);
          if (field) m.mesh.add(field);
        }
      });
    });
  }

  /** Main animation loop callback - runs update() on each frame. */
  animate = () => {
    requestAnimationFrame(this.animate);
    this.update();
  };

  /** Per-frame update: advances time, updates all subsystems, and renders the scene. */
  update() {
    if (!this.scene || !this.camera || !this.renderer) return;

    if (this.stats) {
      if (this.config.showFPS) {
        if (this.stats.dom.style.display === 'none') {
          this.stats.dom.style.display = 'block';
        }
        this.stats.begin();
      } else {
        if (this.stats.dom.style.display !== 'none') {
          this.stats.dom.style.display = 'none';
        }
      }
    }

    const delta = this.clock.getDelta();

    if (!config.stop) {
      const secondsToAdd = config.simulationSpeed * delta;
      config.date.setTime(config.date.getTime() + secondsToAdd * 1000);
      this.magneticFieldTime += delta * config.simulationSpeed * 0.00025;
    }

    if (this.uiControls) {
      updateUI(this.uiControls.uiState, this.uiControls);
    }
    if (this.sun) {
      updatePlanets(this.planets, this.sun, this.shadowLight, this.sunLight);
    }
    if (this.universeGroup && this.sun) {
      updateCoordinateSystem(this.universeGroup, this.planets, this.sun);
    }
    if (this.orbitGroup && this.relativeOrbitGroup && this.sun) {
      updateRelativeOrbits(this.orbitGroup, this.relativeOrbitGroup, this.planets, this.sun);
    }
    if (this.orbitGroup) {
      updateAllOrbitGradients(this.orbitGroup, this.planets);
    }
    updateAllMoonOrbitGradients(this.planets);
    this.rabbit?.update(delta);

    // Update controls first to ensure universe position is final for this frame
    this.controls?.update();

    if (this.controls) {
      if (this.camera) {
        updateFocusMode(this.camera, this.controls);
      }
    }
    // VirtualCameraControls handles camera-at-origin internally by moving universeGroup

    // Update Mission Trajectories (re-calculate if coordinate system changed)
    // Must happen AFTER controls update so we can compensate for universe movement correctly
    if (this.config.coordinateSystem && (this.missionGroup?.children.length ?? 0) > 0) {
      if (this.scene) {
        updateMissionTrajectories(this.scene);
      }
      updateMissionVisuals(this.config.date.getTime(), this.camera || undefined);
      updateMissionProbes(this.config.date); // Update probe positions
    }

    // Sync Foreground Light with World Sun
    if (this.composition && this.sun && this.camera) {
      const fgSun = this.composition.foregroundScene.getObjectByName('ForegroundSunLight');
      if (fgSun) {
        const worldPos = new THREE.Vector3();
        this.sun.getWorldPosition(worldPos);
        // Transform Sun position to be relative to the Camera (since Foreground Camera is at 0,0,0)
        fgSun.position.subVectors(worldPos, this.camera.position);
      }
    }

    if (this.scene && this.camera && this.renderer && this.composition) {
      this.composition.render(); // NEW: Render via CompositionManager
      // this.renderer.render(this.scene, this.camera); // OLD
    }

    this.updateMagneticFieldsAnimations();
    this.rabbit?.render();

    if (this.stats && this.config.showFPS) {
      this.stats.end();
    }
  }

  /**
   * Jumps the simulation to a specific date.
   * @param {string|Date} date - Target date.
   * @param {boolean} pause - Whether to pause after jumping (default true).
   */
  jumpToDate = (date: string | Date, pause: boolean = true) => {
    const targetDate = new Date(date);
    if (Number.isNaN(targetDate.getTime())) {
      Logger.error('Invalid date passed to jumpToDate:', date);
      return;
    }

    config.date = targetDate;
    if (pause) {
      config.simulationSpeed = 0;
    }

    // Force updates immediately to reflect the new state
    if (this.sun) {
      updatePlanets(this.planets, this.sun, this.shadowLight);
    }
    if (this.universeGroup && this.sun) {
      updateCoordinateSystem(this.universeGroup, this.planets, this.sun);
    }
    if (this.orbitGroup && this.relativeOrbitGroup && this.sun) {
      updateRelativeOrbits(this.orbitGroup, this.relativeOrbitGroup, this.planets, this.sun);
    }
    if (this.scene) {
      updateMissionTrajectories(this.scene, true);
    }
    if (this.camera && this.controls) {
      updateFocusMode(this.camera, this.controls);
    }

    // Update UI controls if they exist
    if (this.uiControls) {
      updateUI(this.uiControls.uiState, this.uiControls);
    }

    Logger.log(`Jumped to date: ${targetDate.toISOString()}`);
  };

  updateMagneticFieldsAnimations() {
    // Update Sun Magnetic Field Animation
    if (this.universeGroup) {
      const sunField = this.universeGroup.children.find((c) => c.name === 'MagneticField');

      if (sunField?.visible && sunField.userData.material) {
        sunField.userData.material.uniforms.uTime.value = this.magneticFieldTime;
        if (this.sun) {
          sunField.rotation.y = this.sun.rotation.y;
        }
      }

      // Update Sun Basic Magnetic Field Animation
      const sunFieldBasic = this.universeGroup.children.find(
        (c) => c.name === 'SunMagneticFieldBasic'
      );

      if (sunFieldBasic?.visible) {
        const time = this.magneticFieldTime + sunFieldBasic.userData.timeOffset;
        if (sunFieldBasic.userData.shaderUniforms) {
          const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
          const currentMs = config.date.getTime();
          const hoursSinceJ2000 = (currentMs - J2000) / (1000 * 60 * 60);
          sunFieldBasic.userData.shaderUniforms.uTime.value = hoursSinceJ2000;
          if (this.sun) {
            sunFieldBasic.rotation.y = this.sun.rotation.y;
          }
        }
        sunFieldBasic.children.forEach((child: THREE.Object3D) => {
          const line = child as THREE.Line;
          if (line.userData.isPolar && line.userData.basePoints) {
            const positions = line.geometry.attributes.position;
            const basePoints = line.userData.basePoints;
            for (let i = 0; i < basePoints.length; i++) {
              const basePoint = basePoints[i];
              const flutter = Math.sin(time * 0.3 + i * 0.1) * 0.1;
              const offset = new THREE.Vector3(flutter, 0, flutter);
              positions.setXYZ(
                i,
                basePoint.x + offset.x,
                basePoint.y + offset.y,
                basePoint.z + offset.z
              );
            }
            positions.needsUpdate = true;
          }
        });
      }
    }
  }
}
