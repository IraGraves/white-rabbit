import type GUI from 'lil-gui';
import type * as THREE from 'three';
import { config } from '../../../config';
import type { PlanetWrapper, UIState } from '../../../types';
import { menuDock } from '../../MenuDock';
import {
  updateAsterismsVisibility,
  updateAxesVisibility,
  updateHabitableZoneVisibility,
  updateMagneticFieldScales,
  updateMagneticFieldsVisibility,
  updateOrbitColors,
  updateOrbitsVisibility,
} from './sceneUpdates';

export function setupVisualFolder(
  gui: GUI,
  _starsRef: { value: THREE.Group | null },
  renderer: THREE.WebGLRenderer,
  _universeGroup: THREE.Group,
  _planets: PlanetWrapper[],
  _sun: THREE.Mesh,
  _orbitGroup: THREE.Group,
  _relativeOrbitGroup: THREE.Group,
  uiState: UIState
): void {
  const visualFolder = gui.addFolder('Visual');

  visualFolder.add(config, 'showFPS').name('FPS Counter');

  const gammaSlider = visualFolder
    .add(config, 'gamma', 0.1, 5.0)
    .name('Gamma')
    .onChange((val: number) => {
      if (renderer) {
        renderer.toneMappingExposure = val;
      }
    });
  gammaSlider.domElement.classList.add('hide-value');
  gammaSlider.domElement.classList.add('full-width');
  // Object Info Mode
  visualFolder
    .add(config, 'objectInfoMode', {
      Tooltips: 'tooltip',
      Window: 'window',
      Off: 'off',
    })
    .name('Object Info');

  // Dock Visibility
  if (uiState) {
    visualFolder
      .add(uiState, 'dock')
      .name('Show Dock')
      .onChange((v: boolean) => {
        menuDock.dock.style.display = v ? 'flex' : 'none';
      });
  }

  visualFolder.close(); // Close Visual folder by default
}

export function setupAsterismsControls(
  gui: GUI,
  zodiacGroup: THREE.Group,
  asterismsGroup: THREE.Group,
  zodiacSignsGroup: THREE.Group | null
) {
  // Asterisms (All)
  const asterismsCtrl = gui
    .add(config, 'showAsterisms')
    .name('Asterisms')
    .onChange(() => updateAsterismsVisibility(zodiacGroup, asterismsGroup));
  asterismsCtrl.domElement.classList.add('checkbox-left');

  // Zodiacs
  const zodiacsCtrl = gui
    .add(config, 'showZodiacs')
    .name('Zodiacs')
    .onChange(() => updateAsterismsVisibility(zodiacGroup, asterismsGroup));
  zodiacsCtrl.domElement.classList.add('checkbox-left');

  // Zodiac Signs
  const zodiacSignsCtrl = gui
    .add(config, 'showZodiacSigns')
    .name('Zodiac Signs')
    .onChange((val: boolean) => {
      if (zodiacSignsGroup) zodiacSignsGroup.visible = val;
    });
  zodiacSignsCtrl.domElement.classList.add('checkbox-left');
}

export function setupOrbitsControls(
  gui: GUI,
  orbitGroup: THREE.Group,
  planets: PlanetWrapper[],
  relativeOrbitGroup: THREE.Group
) {
  const sunOrbitsCtrl = gui
    .add(config, 'showSunOrbits')
    .name('Sun')
    .onChange(() => {
      updateOrbitsVisibility(orbitGroup, planets, null);
    });
  sunOrbitsCtrl.domElement.classList.add('checkbox-left');

  // Planet Orbits
  const planetOrbitsCtrl = gui
    .add(config, 'showPlanetOrbits')
    .name('Planets')
    .onChange((val: boolean) => {
      updateOrbitsVisibility(orbitGroup, planets, null);
      val ? planetColorsCtrl.show() : planetColorsCtrl.hide();
    });
  planetOrbitsCtrl.domElement.classList.add('checkbox-left');

  const planetColorsCtrl = gui
    .add(config, 'showPlanetColors')
    .name('Use Colors')
    .onChange(() => {
      updateOrbitColors(orbitGroup, relativeOrbitGroup, planets);
    });
  planetColorsCtrl.domElement.classList.add('checkbox-left');
  planetColorsCtrl.domElement.classList.add('child-control');
  config.showPlanetOrbits ? planetColorsCtrl.show() : planetColorsCtrl.hide();

  // Dwarf Planet Orbits
  const dwarfPlanetOrbitsCtrl = gui
    .add(config, 'showDwarfPlanetOrbits')
    .name('Dwarf Planets')
    .onChange((val: boolean) => {
      updateOrbitsVisibility(orbitGroup, planets, null);
      val ? dwarfPlanetColorsCtrl.show() : dwarfPlanetColorsCtrl.hide();
    });
  dwarfPlanetOrbitsCtrl.domElement.classList.add('checkbox-left');

  const dwarfPlanetColorsCtrl = gui
    .add(config, 'showDwarfPlanetColors')
    .name('Use Colors')
    .onChange(() => {
      updateOrbitColors(orbitGroup, relativeOrbitGroup, planets);
    });
  dwarfPlanetColorsCtrl.domElement.classList.add('checkbox-left');
  dwarfPlanetColorsCtrl.domElement.classList.add('child-control');
  config.showDwarfPlanetOrbits ? dwarfPlanetColorsCtrl.show() : dwarfPlanetColorsCtrl.hide();

  // Moon Orbits
  const moonOrbitsCtrl = gui
    .add(config, 'showMoonOrbits')
    .name('Moons')
    .onChange(() => {
      updateOrbitsVisibility(orbitGroup, planets, capMoonOrbitsCtrl);
    });
  moonOrbitsCtrl.domElement.classList.add('checkbox-left');

  const capMoonOrbitsCtrl = gui
    .add(config, 'capMoonOrbits')
    .name('Cap When Scaling')
    .onChange(() => {
      // Moon positions will be updated in the next animation frame
    });
  capMoonOrbitsCtrl.domElement.classList.add('checkbox-left');
  capMoonOrbitsCtrl.domElement.classList.add('child-control'); // Indent it
}

export function setupMagneticFieldsControls(
  gui: GUI,
  magneticFieldsGroup: THREE.Group,
  planets: PlanetWrapper[],
  universeGroup: THREE.Group
) {
  // Sun basic field (dipole without solar wind)
  const sunMagneticFieldBasicCtrl = gui
    .add(config, 'showSunMagneticFieldBasic')
    .name('Sun')
    .onChange((val: boolean) => {
      if (universeGroup) {
        const field = universeGroup.children.find((c) => c.name === 'SunMagneticFieldBasic');
        if (field) field.visible = val;
      }
      // Toggle child control
      if (sunMagneticFieldCtrl) {
        val ? sunMagneticFieldCtrl.show() : sunMagneticFieldCtrl.hide();
      }
    });
  sunMagneticFieldBasicCtrl.domElement.classList.add('checkbox-left');

  // Sun with solar wind (Parker Spiral)
  const sunMagneticFieldCtrl = gui
    .add(config, 'showSunMagneticField')
    .name('Solar Wind')
    .onChange((val: boolean) => {
      if (universeGroup) {
        // Find by name in universeGroup (direct child)
        const field = universeGroup.children.find((c) => c.name === 'MagneticField');
        if (field) field.visible = val;
      }
    });
  sunMagneticFieldCtrl.domElement.classList.add('checkbox-left');
  sunMagneticFieldCtrl.domElement.classList.add('child-control');

  // Initialize visibility of child control
  config.showSunMagneticFieldBasic ? sunMagneticFieldCtrl.show() : sunMagneticFieldCtrl.hide();

  const magneticFieldsCtrl = gui
    .add(config, 'showMagneticFields')
    .name('Planets, Moons')
    .onChange((val: boolean) =>
      updateMagneticFieldsVisibility(val, magneticFieldsGroup, planets, capMagneticFieldsCtrl)
    );
  magneticFieldsCtrl.domElement.classList.add('checkbox-left');

  const capMagneticFieldsCtrl = gui
    .add(config, 'capMagneticFields')
    .name('Cap When Scaling')
    .onChange(() => {
      updateMagneticFieldScales(planets);
    });
  capMagneticFieldsCtrl.domElement.classList.add('checkbox-left');
  capMagneticFieldsCtrl.domElement.classList.add('child-control');

  // Show/hide child control based on parent state
  updateMagneticFieldsVisibility(
    config.showMagneticFields,
    magneticFieldsGroup,
    planets,
    capMagneticFieldsCtrl
  );
}

export function setupExtraOverlaysControls(
  gui: GUI,
  sun: THREE.Mesh,
  planets: PlanetWrapper[],
  habitableZone: THREE.Object3D
) {
  // Create a wrapper object with optional axisLine for the updateAxesVisibility function
  const sunWithAxis = { axisLine: (sun as THREE.Mesh & { axisLine?: THREE.Line }).axisLine };

  // Axes
  const axesCtrl = gui
    .add(config, 'showAxes')
    .name('Axes')
    .onChange((val: boolean) => updateAxesVisibility(val, sunWithAxis, planets));
  axesCtrl.domElement.classList.add('checkbox-left');

  // Habitable Zone
  const habitableZoneCtrl = gui
    .add(config, 'showHabitableZone')
    .name('Habitable Zone')
    .onChange((val: boolean) => updateHabitableZoneVisibility(val, habitableZone));
  habitableZoneCtrl.domElement.classList.add('checkbox-left');
}

export function setupOverlaysFolder(
  gui: GUI,
  orbitGroup: THREE.Group,
  zodiacGroup: THREE.Group,
  asterismsGroup: THREE.Group,
  planets: PlanetWrapper[],
  sun: THREE.Mesh,
  zodiacSignsGroup: THREE.Group,
  habitableZone: THREE.Object3D,
  magneticFieldsGroup: THREE.Group,
  relativeOrbitGroup: THREE.Group,
  universeGroup: THREE.Group
) {
  const overlaysFolder = gui.addFolder('Overlays');

  const asterismsFolder = overlaysFolder.addFolder('Asterisms');
  asterismsFolder.domElement.classList.add('constellations-folder');
  setupAsterismsControls(asterismsFolder, zodiacGroup, asterismsGroup, zodiacSignsGroup);
  asterismsFolder.close();

  const orbitsFolder = overlaysFolder.addFolder('Orbits');
  orbitsFolder.domElement.classList.add('orbits-folder');
  setupOrbitsControls(orbitsFolder, orbitGroup, planets, relativeOrbitGroup);
  orbitsFolder.close();

  const magneticFieldsFolder = overlaysFolder.addFolder('Magnetic Fields');
  magneticFieldsFolder.domElement.classList.add('magnetic-fields-folder');
  setupMagneticFieldsControls(magneticFieldsFolder, magneticFieldsGroup, planets, universeGroup);
  magneticFieldsFolder.close();

  setupExtraOverlaysControls(overlaysFolder, sun, planets, habitableZone);

  overlaysFolder.close();
}
