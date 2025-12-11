import * as THREE from 'three';
import { config } from '../config';
import { exitFocusMode, focusOnObject, isFocusModeActive } from '../features/focusMode';
import { getMissionState } from '../features/missions';
import {
  updateAsterismsVisibility,
  updateAxesVisibility,
  updateDwarfVisibility,
  updateHabitableZoneVisibility,
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
  planets: any[];
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
    planets: any[],
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

  jumpToDate(date: Date | string, pause = true): void {
    if (this.jumpToDateFn) {
      this.jumpToDateFn(date, pause);
    } else {
      Logger.warn('jumpToDate function not provided to SimulationControl.');
      // Fallback or do nothing
    }
  }

  jumpToMissionLocation(
    missionId: string,
    date: Date | string,
    pause = true,
    moveCamera = true
  ): void {
    // 1. Jump to Date
    this.jumpToDate(date, pause);

    // 2. Get Mission State (Position & Direction)
    // We defer slightly to allow date update to propagate if needed,
    // but usually synchronous update is fine if data is already there.
    // However, if the date jump triggers a recalc, we might need to wait.
    // For now, let's assume immediate calculation is okay or close enough.

    // Check if we need to wait for update?
    // updateMissionTrajectories runs in main loop.
    // If we change date, coordinates update next frame.
    // So ideally we should execute this on next frame or after update.
    // But let's try immediate first. Reference frames generally only rotate.

    if (!moveCamera) return;

    const state = getMissionState(missionId, date);

    if (state) {
      const { position, direction } = state;
      // "Looking direction of flight" means Camera looks AT the spacecraft, ALIGNED with flight path?
      // Or Camera LOOKS towards where the spacecraft is going?
      // "looking the direction of its flight path" usually means User POV is same as Spacecraft POV.
      // But user said: "jump to the location of the spacecraft... and looking the direction of its flight path".
      // If I am at the location looking in the direction, I don't see the spacecraft (it's inside me).
      // User also said: "slightly 'above' it (in case we add a rendering later)".
      // So likely: Camera is behind and above, looking forward (at the spacecraft and beyond).

      // Scale 1e-6 (~3 km displayed)
      // Camera at 5e-6 behind (~15 km) for good visibility
      const upOffset = 2e-6; // Above
      const backOffset = 5e-6; // Behind

      // Camera Pos = MissionPos - (Direction * backOffset) + (Up * upOffset)
      // Up vector: Y axis? Or ecliptic normal? Scene Y is "Up" (perpendicular to ecliptic plane usually? No, Z is up? Check coords).
      // missions.js: getBodyPosition uses x=x, y=z, z=-y.
      // Standard Three.js: Y is up.
      // Solar system usually has Z as ecliptic normal in some coords, but Three.js usually maps Y to up.
      // Let's assume Scene Y is Up.

      const camPos = position
        .clone()
        .addScaledVector(direction, -backOffset)
        .add(new THREE.Vector3(0, upOffset, 0));

      // Use OriginAware controls API if available to ensure changes persist
      if (this.controls.setVirtualPosition && this.controls.setVirtualTarget) {
        if (this.controls.resetMomentum) this.controls.resetMomentum();
        this.controls.setVirtualTarget(position);
        this.controls.setVirtualPosition(camPos);
      } else {
        // Fallback for standard controls
        this.camera.position.copy(camPos);
        this.controls.target.copy(position);
        this.controls.update();
      }

      // Exit focus mode if active to prevent conflict (and suppress message)
      if (isFocusModeActive?.()) {
        exitFocusMode(this.controls, true);
      }
    } else {
      Logger.warn(`Could not get state for mission ${missionId} at ${date}`);
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
      for (const m of p.moons) {
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
    updateOrbitsVisibility(visible, this.orbitGroup, this.planets, null);
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
