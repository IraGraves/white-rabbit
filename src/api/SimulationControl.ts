import * as THREE from 'three';
import { config, REAL_PLANET_SCALE_FACTOR } from '../config';
import { missionData } from '../data/missions';
import { exitFocusMode, focusOnObject, isFocusModeActive } from '../features/focusMode';
import { updateMissionTrajectories } from '../features/missions';
import type { PlanetWrapper } from '../types';
import {
  updateAsterismsVisibility,
  updateAxesVisibility,
  updateDwarfVisibility,
  updateHabitableZoneVisibility,
  updateMagneticFieldScales,
  updateMagneticFieldsVisibility,
  updateMoonVisibility,
  updateOrbitsVisibility,
  updatePlanetVisibility,
  updateReferencePlane,
  updateSunVisibility,
  updateZodiacSignsVisibility,
} from '../ui/modules/visual';
import { Logger } from '../utils/logger';

/**
 * API for controlling the simulation programmatically.
 * Exposed as window.SimulationControl
 */
export class SimulationControl {
  planets: PlanetWrapper[];
  sun: THREE.Mesh;
  orbitGroup: THREE.Group;
  zodiacGroup: THREE.Group;
  asterismsGroup: THREE.Group;
  starsRef: { value: THREE.Group | null };
  camera: THREE.Camera;
  controls: any;
  zodiacSignsGroup: THREE.Group;
  habitableZone: THREE.Mesh | null;
  magneticFieldsGroup: THREE.Group;
  universeGroup: THREE.Group;
  jumpToDateFn: (date: Date | string, pause?: boolean) => void;

  constructor(
    planets: PlanetWrapper[],
    sun: THREE.Mesh,
    orbitGroup: THREE.Group,
    zodiacGroup: THREE.Group,
    asterismsGroup: THREE.Group,
    starsRef: { value: THREE.Group | null },
    camera: THREE.Camera,
    controls: any,
    zodiacSignsGroup: THREE.Group,
    habitableZone: THREE.Mesh | null,
    magneticFieldsGroup: THREE.Group,
    universeGroup: THREE.Group,
    jumpToDate: (date: Date | string, pause?: boolean) => void
  ) {
    this.planets = planets;
    this.sun = sun;
    this.orbitGroup = orbitGroup;
    this.zodiacGroup = zodiacGroup;
    this.asterismsGroup = asterismsGroup;
    this.starsRef = starsRef;
    this.camera = camera;
    this.controls = controls;
    this.zodiacSignsGroup = zodiacSignsGroup;
    this.habitableZone = habitableZone;
    this.magneticFieldsGroup = magneticFieldsGroup;
    this.universeGroup = universeGroup;
    this.jumpToDateFn = jumpToDate; // Store function reference
  }

  setPlanetScale(scale: number): void {
    // scale is internal value (e.g. 1.0 for 500x if factor is 500? No, config.planetScale=scale)
    // Wait, config.planetScale * REAL_PLANET_SCALE_FACTOR = Display
    // If we want Display 1x, then config.planetScale = 1 / REAL_PLANET_SCALE_FACTOR

    // Actually, usually config.planetScale is 1.0 (default) which maps to... wait let's check config.ts
    // config.planetScale = 1; REAL = 500. So 1 = 500x?
    // Let's check systemTab.ts
    // updatePlanet: internalVal = realScale / REAL_PLANET_SCALE_FACTOR
    // toScale(0) = 1.
    // If I want 1x REAL scale.
    // internalVal = 1 / 500 = 0.002.

    const internalVal = scale / REAL_PLANET_SCALE_FACTOR;
    config.planetScale = internalVal;

    this.planets.forEach((p) => {
      p.mesh.scale.setScalar(internalVal);
      p.moons?.forEach((m) => {
        m.mesh.scale.setScalar(internalVal);
      });
    });

    updateMagneticFieldScales(this.planets);
    updateMissionTrajectories(undefined as any, true);

    // Dispatch event for UI
    window.dispatchEvent(new CustomEvent('planet-scale-changed'));
  }

  jumpToDate(date: Date | string, pause = true): void {
    if (this.jumpToDateFn) {
      this.jumpToDateFn(date, pause);
    } else {
      Logger.warn('jumpToDate function not provided to SimulationControl.');
      // Fallback or do nothing
    }
  }

  async jumpToMissionLocation(
    missionId: string,
    date: Date | string,
    pause = true,
    moveCamera = true
  ): Promise<void> {
    // Check for Flyby -> Reset Scale
    const mission = missionData.find((m) => m.id === missionId);
    if (mission) {
      const targetTime = new Date(date).getTime();
      // Find waypoint matching this time (within reasonable delta, e.g. 1 hour)
      const wp = mission.waypoints.find(
        (w) => Math.abs(new Date(w.date).getTime() - targetTime) < 3600000
      );

      if (wp && (wp.body || wp.customBody)) {
        // It's a flyby/encounter! Reset scale to 1x (Real)
        this.setPlanetScale(1.0);
        Logger.info(`Flyby detected at ${wp.body || wp.customBody}. Resetting planet scale to 1x.`);
      }
    }

    // 1. Jump to Date
    this.jumpToDate(date, pause);

    // Ensure Mission is Visible
    if (!config.showMissions[missionId]) {
      config.showMissions[missionId] = true;
      window.dispatchEvent(
        new CustomEvent('mission-visibility-changed', { detail: { missionId: missionId } })
      );
      if ((window as any).updateMissions) (window as any).updateMissions();
    }

    if (!moveCamera) {
      // If we are NOT moving the camera (just time jump), we must ensure we are NOT
      // in focus/tracking mode. If we are tracking, the camera will "chase" the probe
      // to the new date, effectively moving the camera.
      if (isFocusModeActive?.()) {
        exitFocusMode(this.controls, true); // suppress feedback
      }
      return;
    }

    // 2. Focus on Probe
    try {
      const { ensureProbeLoaded, getProbeForFocus } = await import('../features/missionProbes');
      const loaded = await ensureProbeLoaded(missionId);

      if (loaded) {
        const probe = getProbeForFocus(missionId);
        if (probe) {
          focusOnObject(probe, this.camera, this.controls);
          Logger.info(`Focused on mission ${missionId}`);
        } else {
          Logger.warn(`Probe wrapper not found for ${missionId}`);
        }
      } else {
        Logger.warn(`Failed to ensure probe loaded for ${missionId}`);
      }
    } catch (e) {
      Logger.error('Error focusing on mission:', e);
    }
  }

  getConfig() {
    return config;
  }

  // --- Time & Speed ---

  setSpeed(speed: number): void {
    config.simulationSpeed = speed;
    // UI updates automatically via updateUI loop
  }

  setDate(dateString: string): void {
    // Format: YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    const current = config.date;
    config.date = new Date(
      year,
      month - 1,
      day,
      current.getHours(),
      current.getMinutes(),
      current.getSeconds()
    );
  }

  // --- Focus ---

  focus(name: string): void {
    // Search for object by name
    const lowerName = name.toLowerCase();

    if (lowerName === 'sun') {
      focusOnObject(
        { mesh: this.sun, data: { name: 'Sun', radius: 5 }, type: 'sun' },
        this.camera,
        this.controls
      );
      return;
    }

    for (const p of this.planets) {
      if (p.data.name.toLowerCase() === lowerName) {
        focusOnObject(p, this.camera, this.controls);
        return;
      }
      for (const m of p.moons ?? []) {
        if (m.data.name.toLowerCase() === lowerName) {
          focusOnObject(m, this.camera, this.controls);
          return;
        }
      }
    }
    Logger.warn(`Object '${name}' not found.`);
  }

  exitFocus() {
    exitFocusMode(this.controls);
  }

  rotateToDarkSide() {
    const target = this.controls.target;
    const camera = this.camera;

    // Sun is at 0,0,0
    const sunPos = new THREE.Vector3(0, 0, 0);
    const objPos = target.clone();

    // Vector from Sun to Object
    const sunToObj = new THREE.Vector3().subVectors(objPos, sunPos).normalize();
    const dist = camera.position.distanceTo(objPos);

    // New position: ObjectPos + SunToObj * dist
    // This places the camera directly behind the object relative to the Sun
    const newPos = objPos.clone().add(sunToObj.multiplyScalar(dist));

    camera.position.copy(newPos);
    this.controls.update();
  }

  // --- Visual Settings ---

  setReferencePlane(plane: string): void {
    if (plane !== 'Equatorial' && plane !== 'Ecliptic') {
      Logger.warn("Invalid plane. Use 'Equatorial' or 'Ecliptic'.");
      return;
    }
    config.referencePlane = plane;
    updateReferencePlane(plane, this.universeGroup);
  }

  setStarBrightness(val: number): void {
    config.starBrightness = Math.max(0, Math.min(1, val));
    const starsGroup = this.starsRef.value;
    if (starsGroup?.userData?.manager) {
      starsGroup.userData.manager.setBrightness(config.starBrightness);
    }
  }

  toggleOrbits(visible: boolean): void {
    config.showOrbits = visible;
    updateOrbitsVisibility(this.orbitGroup, this.planets, null);
  }

  toggleAxes(visible: boolean): void {
    config.showAxes = visible;
    updateAxesVisibility(visible, this.sun, this.planets);
  }

  toggleZodiacs(visible: boolean): void {
    config.showZodiacs = visible;
    updateAsterismsVisibility(this.zodiacGroup, this.asterismsGroup);
  }

  toggleAsterisms(visible: boolean): void {
    config.showAsterisms = visible;
    updateAsterismsVisibility(this.zodiacGroup, this.asterismsGroup);
  }

  toggleZodiacSigns(visible: boolean): void {
    config.showZodiacSigns = visible;
    updateZodiacSignsVisibility(visible, this.zodiacSignsGroup);
  }

  toggleHabitableZone(visible: boolean): void {
    config.showHabitableZone = visible;
    updateHabitableZoneVisibility(visible, this.habitableZone);
  }

  toggleMagneticFields(visible: boolean): void {
    config.showMagneticFields = visible;
    updateMagneticFieldsVisibility(visible, this.magneticFieldsGroup, this.planets, null);
  }

  toggleSunMagneticFieldBasic(visible: boolean): void {
    config.showSunMagneticFieldBasic = visible;
    if (this.universeGroup) {
      const field = this.universeGroup.children.find((c) => c.name === 'SunMagneticFieldBasic');
      if (field) field.visible = visible;
    }
  }

  toggleSunMagneticFieldSolarWind(visible: boolean): void {
    config.showSunMagneticField = visible;
    if (this.universeGroup) {
      const field = this.universeGroup.children.find((c) => c.name === 'MagneticField');
      if (field) field.visible = visible;
    }
  }

  // --- Object Visibility ---

  toggleSun(visible: boolean): void {
    config.showSun = visible;
    updateSunVisibility(visible, this.sun);
  }

  togglePlanets(visible: boolean): void {
    config.showPlanets = visible;
    updatePlanetVisibility(visible, this.planets);
  }

  toggleDwarfPlanets(visible: boolean): void {
    config.showDwarfPlanets = visible;
    updateDwarfVisibility(visible, this.planets);
  }

  toggleMoons(category: string, visible: boolean): void {
    // category: 'largest', 'major', 'small'
    if (category === 'largest') config.showLargestMoons = visible;
    else if (category === 'major') config.showMajorMoons = visible;
    else if (category === 'small') config.showSmallMoons = visible;
    else {
      Logger.warn("Invalid moon category. Use 'largest', 'major', or 'small'.");
      return;
    }
    updateMoonVisibility(visible, this.planets, category);
  }
}
