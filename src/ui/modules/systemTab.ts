/**
 * @file systemTab.ts
 * @description Logic for the "System" tab in Visual Tools (Custom UI).
 *
 * This module consolidates system-level controls:
 * - Origin (Coordinate System)
 * - Reference Plane
 * - Scale Adjustments (Presets & Custom)
 */
import type * as THREE from 'three';
import { config, REAL_PLANET_SCALE_FACTOR, REAL_SUN_SCALE_FACTOR } from '../../config';
import { updateMissionTrajectories } from '../../features/missions';
import { updateCoordinateSystem } from '../../systems/coordinates';
import { updateRelativeOrbits } from '../../systems/relativeOrbits';
import type { PlanetWrapper } from '../../types';
import {
  updateMagneticFieldScales,
  updateReferencePlane,
  updateSunMagneticFieldScale,
} from './visual';

export function setupSystemTab(
  container: HTMLElement,
  uiState: any,
  planets: PlanetWrapper[],
  sun: THREE.Mesh,
  universeGroup: THREE.Group,
  orbitGroup: THREE.Group,
  relativeOrbitGroup: THREE.Group
): { setScalePreset: (preset: string) => void } {
  // Clear any existing content
  container.innerHTML = '';

  const list = document.createElement('div');
  list.className = 'system-list';
  container.appendChild(list);

  // --- HELPERS ---
  const createSection = (title: string) => {
    const sec = document.createElement('div');
    sec.className = 'system-section';
    const t = document.createElement('div');
    t.className = 'system-section-title';
    t.textContent = title;
    sec.appendChild(t);
    list.appendChild(sec);
    return sec;
  };

  const createSelect = (
    parent: HTMLElement,
    labelText: string,
    optionsMap: Record<string, string>,
    getVal: () => string,
    setVal: (val: string) => void
  ) => {
    const row = document.createElement('div');
    row.className = 'system-row';

    const label = document.createElement('div');
    label.className = 'system-label';
    label.textContent = labelText;
    row.appendChild(label);

    const select = document.createElement('select');
    select.className = 'system-select';

    // OptionsMap: { "Label": "value" }
    Object.entries(optionsMap).forEach(([text, val]) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = text;
      if (val === getVal()) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', (e: Event) => {
      setVal((e.target as HTMLSelectElement).value);
    });

    row.appendChild(select);
    parent.appendChild(row);
  };

  const createSliderControl = (
    parent: HTMLElement,
    labelText: string,
    valueFn: () => number,
    onChangeFn: (val: number) => void,
    formatter: () => string
  ) => {
    const row = document.createElement('div');
    row.className = 'system-row';

    const label = document.createElement('div');
    label.className = 'system-label';
    label.textContent = labelText;
    row.appendChild(label);

    const sliderCont = document.createElement('div');
    sliderCont.className = 'system-slider-container';

    const input = document.createElement('input');
    input.type = 'range';
    input.className = 'system-slider';
    input.min = '0';
    input.max = '1000';
    input.value = valueFn().toString(); // Expected 0-1000

    // Value Display
    const valSpan = document.createElement('span');
    valSpan.className = 'system-value';
    valSpan.textContent = formatter();

    input.addEventListener('input', (e: Event) => {
      onChangeFn(parseFloat((e.target as HTMLInputElement).value));
      const newVal = formatter();
      valSpan.textContent = newVal;
    });

    sliderCont.appendChild(input);
    row.appendChild(sliderCont);
    row.appendChild(valSpan); // Value at the end

    parent.appendChild(row);

    return {
      update: () => {
        input.value = valueFn().toString();
        valSpan.textContent = formatter();
      },
    };
  };

  // --- COORDINATE SYSTEMS ---
  const coordSec = createSection('Coordinate System');

  // Origin
  createSelect(
    coordSec,
    'Origin',
    {
      'Center of Mass (Barycentric)': 'Barycentric',
      'Earth (Geocentric)': 'Geocentric',
      'Earth (Tychonic)': 'Tychonic',
      'Sun (Heliocentric)': 'Heliocentric',
    },
    () => config.coordinateSystem,
    (val) => {
      config.coordinateSystem = val as 'Heliocentric' | 'Geocentric' | 'Barycentric' | 'Tychonic';
      updateCoordinateSystem(universeGroup, planets, sun);
      updateRelativeOrbits(orbitGroup, relativeOrbitGroup, planets, sun);
    }
  );

  // Reference Plane
  // Options: Equatorial, Ecliptic
  // Map array to object
  const refOpts = { Equatorial: 'Equatorial', Ecliptic: 'Ecliptic' };
  createSelect(
    coordSec,
    'Reference Plane', // Full label
    refOpts,
    () => config.referencePlane,
    (val) => {
      config.referencePlane = val as 'Equatorial' | 'Ecliptic';
      updateReferencePlane(val, universeGroup);
    }
  );

  // --- SCALE ---
  const scaleSec = createSection('Scale');

  // Custom CreateSelect for Presets
  const createPresetSelect = () => {
    const row = document.createElement('div');
    row.className = 'system-row';

    const label = document.createElement('div');
    label.className = 'system-label';
    label.textContent = 'Preset';
    row.appendChild(label);

    const select = document.createElement('select');
    select.className = 'system-select';

    const presetOpts = { Realistic: 'Realistic', Artistic: 'Artistic', Custom: 'Custom' };
    Object.entries(presetOpts).forEach(([k, v]) => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = k;
      select.appendChild(opt);
    });
    select.value = uiState.scalePreset;

    select.addEventListener('change', (e: Event) => {
      uiState.scalePreset = (e.target as HTMLSelectElement).value;
      applyPreset(uiState.scalePreset);
    });

    row.appendChild(select);
    scaleSec.appendChild(row);

    return {
      update: () => {
        select.value = uiState.scalePreset;
      },
    };
  };

  // Logic from scale.ts
  let isPresetChanging = false;

  const applyPreset = (val: string) => {
    isPresetChanging = true;
    if (val === 'Realistic') {
      // Sun 1x, Planet 1x
      updateSun(1);
      updatePlanet(0); // t=0
    } else if (val === 'Artistic') {
      // Sun 20x, Planet 500x
      updateSun(1.0 * REAL_SUN_SCALE_FACTOR);
      // Calculate t for 500x
      const t = ((500 - 1) / (REAL_PLANET_SCALE_FACTOR * 5 - 1)) ** (1 / 3);
      updatePlanet(t * 1000);
    }
    isPresetChanging = false;
  };

  const presetCtrl = createPresetSelect();

  // Sun Scale
  const sunMin = 1;
  const sunMax = 70;

  const getSunVal = () => {
    const real = config.sunScale * REAL_SUN_SCALE_FACTOR; // 1 to 70
    // Map to 0-1000
    return ((real - sunMin) / (sunMax - sunMin)) * 1000;
  };

  const updateSun = (realVal: number) => {
    // realVal is e.g. 20
    const internalVal = realVal / REAL_SUN_SCALE_FACTOR;
    config.sunScale = internalVal;
    sun.scale.setScalar(internalVal);
    updateSunMagneticFieldScale(universeGroup, internalVal);

    if (sunCtrl) sunCtrl.update();
  };

  const onSunChange = (sliderVal: number) => {
    // 0-1000
    const t = sliderVal / 1000;
    const realVal = sunMin + t * (sunMax - sunMin);
    updateSun(realVal);

    if (!isPresetChanging && uiState.scalePreset !== 'Custom') {
      uiState.scalePreset = 'Custom';
      presetCtrl.update();
    }
  };

  const sunFormatter = () => {
    return `${(config.sunScale * REAL_SUN_SCALE_FACTOR).toFixed(0)}x`;
  };

  const sunCtrl = createSliderControl(scaleSec, 'Sun Scale', getSunVal, onSunChange, sunFormatter);

  // Planet Scale
  const toScale = (t: number) => 1 + (REAL_PLANET_SCALE_FACTOR * 5 - 1) * t ** 3;
  const toTb = (scale: number) => ((scale - 1) / (REAL_PLANET_SCALE_FACTOR * 5 - 1)) ** (1 / 3);

  const getPlanetVal = () => {
    // Returns 0-1000
    const currentScale = config.planetScale * REAL_PLANET_SCALE_FACTOR;
    const t = toTb(currentScale);
    return t * 1000;
  };

  const updatePlanet = (sliderVal: number) => {
    // 0-1000
    const t = sliderVal / 1000;
    const realScale = toScale(t);
    const internalVal = realScale / REAL_PLANET_SCALE_FACTOR;
    config.planetScale = internalVal;

    planets.forEach((p) => {
      p.mesh.scale.setScalar(internalVal);
      p.moons?.forEach((m) => {
        m.mesh.scale.setScalar(internalVal);
      });
    });
    updateMagneticFieldScales(planets);
    // Force mission trajectory update (for scale-aware offsets)
    updateMissionTrajectories(undefined as any, true);

    if (planetCtrl) planetCtrl.update();
  };

  const onPlanetChange = (sliderVal: number) => {
    updatePlanet(sliderVal);
    if (!isPresetChanging && uiState.scalePreset !== 'Custom') {
      uiState.scalePreset = 'Custom';
      presetCtrl.update();
    }
  };

  const planetFormatter = () => {
    const currentScale = config.planetScale * REAL_PLANET_SCALE_FACTOR;
    return `${currentScale.toFixed(0)}x`;
  };

  const planetCtrl = createSliderControl(
    scaleSec,
    'Planet Scale',
    getPlanetVal,
    onPlanetChange,
    planetFormatter
  );

  // Return API
  const api = {
    setScalePreset: (preset: string) => {
      uiState.scalePreset = preset;
      presetCtrl.update(); // Update select UI
      applyPreset(preset); // Apply logic
    },
  };

  // Listen for external scale changes (e.g. from Flyby reset)
  window.addEventListener('planet-scale-changed', () => {
    if (planetCtrl) planetCtrl.update();
    // Use timeout to ensure UI state is settled? No, direct update is fine.
    // Also consider updating preset to Custom if it doesn't match?
    // accurate preset matching is complex, let's just leave preset as is or switch to Custom?
    // If we only change planet scale, we are likely in Custom or deviating from Realistic/Artistic.
    if (uiState.scalePreset !== 'Custom') {
      uiState.scalePreset = 'Custom';
      if (presetCtrl) presetCtrl.update();
    }
  });

  return api;
}
