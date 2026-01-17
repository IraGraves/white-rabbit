import type * as THREE from 'three';
import { config } from '../../../config';
import type { Config, PlanetWrapper } from '../../../types';
import {
  updateAsterismsVisibility,
  updateAxesVisibility,
  updateConstellationsBoundariesVisibility,
  updateDwarfVisibility,
  updateHabitableZoneVisibility,
  updateMagneticFieldScales,
  updateMagneticFieldsVisibility,
  updateMoonVisibility,
  updateNormalDebug,
  updateOrbitColors,
  updateOrbitsVisibility,
  updatePlanetVisibility,
  updateSunVisibility,
  updateZodiacSignsVisibility,
} from './sceneUpdates';

type BooleanConfigKey = {
  [K in keyof Config]: Config[K] extends boolean ? K : never;
}[keyof Config];

interface ControlItem {
  configKey: BooleanConfigKey;
  label: string;
  icon: string;
  updateFn: (val: boolean) => void;
  childToggle?: {
    configKey: BooleanConfigKey;
    label: string;
    updateFn?: () => void;
  };
}

export function setupObjectsControlsCustom(
  container: HTMLElement,
  planets: PlanetWrapper[],
  sun: THREE.Mesh
) {
  const cfg = config as unknown as Config;
  const items: ControlItem[] = [
    {
      configKey: 'showSun',
      label: 'Sun',
      icon: '☀️',
      updateFn: (val: boolean) => updateSunVisibility(val, sun),
    },
    {
      configKey: 'showPlanets',
      label: 'Planets',
      icon: '🪐',
      updateFn: (val: boolean) => updatePlanetVisibility(val, planets),
    },
    {
      configKey: 'showDwarfPlanets',
      label: 'Dwarf Planets',
      icon: '🪨',
      updateFn: (val: boolean) => updateDwarfVisibility(val, planets),
    },
    {
      configKey: 'showLargestMoons',
      label: 'Largest Moons',
      icon: '🌕',
      updateFn: (val: boolean) => updateMoonVisibility(val, planets, 'largest'),
    },
    {
      configKey: 'showMajorMoons',
      label: 'Major Moons',
      icon: '🌖',
      updateFn: (val: boolean) => updateMoonVisibility(val, planets, 'major'),
    },
    {
      configKey: 'showSmallMoons',
      label: 'Small Moons',
      icon: '🥔',
      updateFn: (val: boolean) => updateMoonVisibility(val, planets, 'small'),
    },
  ];

  const list = document.createElement('div');
  list.className = 'object-list';

  items.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'object-item';
    if (cfg[item.configKey]) el.classList.add('active');

    el.innerHTML = `
        <div class="object-icon">${item.icon}</div>
        <div class="object-label">${item.label}</div>
    `;

    el.addEventListener('click', () => {
      // Toggle config
      cfg[item.configKey] = !cfg[item.configKey];
      const isActive = cfg[item.configKey];

      // Update UI
      if (isActive) el.classList.add('active');
      else el.classList.remove('active');

      // Trigger update
      item.updateFn(isActive as boolean);
    });

    list.appendChild(el);
  });

  container.appendChild(list);
}

export function setupAsterismsControlsCustom(
  container: HTMLElement,
  zodiacGroup: THREE.Group,
  asterismsGroup: THREE.Group,
  zodiacSignsGroup: THREE.Group,
  constellationsGroup: THREE.Group
) {
  const cfg = config as unknown as Config;
  const items: ControlItem[] = [
    {
      configKey: 'showConstellations',
      label: 'Constellations',
      icon: '🌐',
      updateFn: () => updateConstellationsBoundariesVisibility(constellationsGroup),
    },
    {
      configKey: 'showAsterisms',
      label: 'Asterisms',
      icon: '☆',
      updateFn: () => updateAsterismsVisibility(zodiacGroup, asterismsGroup),
    },
    {
      configKey: 'showZodiacs',
      label: 'Zodiacs',
      icon: '⁂',
      updateFn: () => updateAsterismsVisibility(zodiacGroup, asterismsGroup),
    },
    {
      configKey: 'showZodiacSigns',
      label: 'Zodiac Signs',
      icon: '🦁',
      updateFn: (val: boolean) => updateZodiacSignsVisibility(val, zodiacSignsGroup),
    },
  ];

  const list = document.createElement('div');
  list.className = 'object-list';

  items.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'object-item';
    if (cfg[item.configKey]) el.classList.add('active');

    el.innerHTML = `
        <div class="object-icon">${item.icon}</div>
        <div class="object-label">${item.label}</div>
    `;

    el.addEventListener('click', () => {
      // Toggle config
      cfg[item.configKey] = !cfg[item.configKey];
      const isActive = cfg[item.configKey];

      // Update UI
      if (isActive) el.classList.add('active');
      else el.classList.remove('active');

      // Trigger update
      item.updateFn(isActive as boolean);
    });

    list.appendChild(el);
  });

  container.appendChild(list);
}

export function setupOrbitsControlsCustom(
  container: HTMLElement,
  orbitGroup: THREE.Group,
  planets: PlanetWrapper[],
  relativeOrbitGroup: THREE.Group
) {
  const cfg = config as unknown as Config;
  const items: ControlItem[] = [
    {
      configKey: 'showSunOrbits',
      label: 'Sun',
      icon: '☀️',
      updateFn: () => updateOrbitsVisibility(orbitGroup, planets, null),
    },
    {
      configKey: 'showPlanetOrbits',
      label: 'Planets',
      icon: '🪐',
      updateFn: () => updateOrbitsVisibility(orbitGroup, planets, null),
      childToggle: {
        configKey: 'showPlanetColors',
        label: 'Colors',
        updateFn: () => updateOrbitColors(orbitGroup, relativeOrbitGroup, planets),
      },
    },
    {
      configKey: 'showDwarfPlanetOrbits',
      label: 'Dwarf Planets',
      icon: '🪨',
      updateFn: () => updateOrbitsVisibility(orbitGroup, planets, null),
      childToggle: {
        configKey: 'showDwarfPlanetColors',
        label: 'Colors',
        updateFn: () => updateOrbitColors(orbitGroup, relativeOrbitGroup, planets),
      },
    },
    {
      configKey: 'showMoonOrbits',
      label: 'Moons',
      icon: '🌕',
      updateFn: () => updateOrbitsVisibility(orbitGroup, planets, null),
      childToggle: {
        configKey: 'capMoonOrbits',
        label: 'Cap',
        updateFn: () => {}, // Handled in animation loop or updateOrbitsVisibility
      },
    },
  ];

  const list = document.createElement('div');
  list.className = 'object-list';

  items.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'object-item';
    if (cfg[item.configKey]) el.classList.add('active');

    // Main Content
    const leftPart = document.createElement('div');
    leftPart.style.display = 'flex';
    leftPart.style.alignItems = 'center';
    leftPart.style.flexGrow = '1';
    leftPart.innerHTML = `
        <div class="object-icon">${item.icon}</div>
        <div class="object-label">${item.label}</div>
    `;
    el.appendChild(leftPart);

    // Child Toggle (if any)
    let toggleEl: HTMLElement | null = null;

    if (item.childToggle) {
      toggleEl = document.createElement('div');
      toggleEl.className = 'object-toggle';
      if (cfg[item.childToggle.configKey]) toggleEl.classList.add('active');
      toggleEl.textContent = item.childToggle.label;

      toggleEl.style.display = cfg[item.configKey] ? 'flex' : 'none';

      toggleEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!item.childToggle) return;
        cfg[item.childToggle.configKey] = !cfg[item.childToggle.configKey];
        const isToggleActive = cfg[item.childToggle.configKey];

        if (toggleEl) {
          if (isToggleActive) toggleEl.classList.add('active');
          else toggleEl.classList.remove('active');
        }

        if (item.childToggle.updateFn) item.childToggle.updateFn();
      });

      el.appendChild(toggleEl);
    }

    // Main Click
    leftPart.addEventListener('click', () => {
      cfg[item.configKey] = !cfg[item.configKey];
      const isActive = cfg[item.configKey];

      if (isActive) {
        el.classList.add('active');
        if (toggleEl) toggleEl.style.display = 'flex';
      } else {
        el.classList.remove('active');
        if (toggleEl) toggleEl.style.display = 'none';
      }

      item.updateFn(isActive as boolean);
    });

    list.appendChild(el);
  });

  container.appendChild(list);
}

export function setupMagneticFieldsControlsCustom(
  container: HTMLElement,
  magneticFieldsGroup: THREE.Group,
  planets: PlanetWrapper[],
  universeGroup: THREE.Group
) {
  const cfg = config as unknown as Config;
  const items: ControlItem[] = [
    {
      configKey: 'showSunMagneticFieldBasic',
      label: 'Sun',
      icon: '🔆',
      updateFn: () => {
        if (universeGroup) {
          const field = universeGroup.children.find((c) => c.name === 'SunMagneticFieldBasic');
          if (field) field.visible = config.showSunMagneticFieldBasic;
        }
      },
    },
    {
      configKey: 'showSunMagneticField',
      label: 'Solar Wind',
      icon: '🌬️',
      updateFn: () => {
        if (universeGroup) {
          const field = universeGroup.children.find((c) => c.name === 'MagneticField');
          if (field) field.visible = config.showSunMagneticField;
        }
      },
      childToggle: {
        configKey: 'showSunMagneticFieldBasic',
        label: 'Basic',
        updateFn: () => {
          if (universeGroup) {
            const field = universeGroup.children.find((c) => c.name === 'SunMagneticFieldBasic');
            if (field) field.visible = cfg.showSunMagneticFieldBasic;
          }
        },
      },
    },
    {
      configKey: 'showMagneticFields',
      label: 'Planets, Moons',
      icon: '🧲',
      updateFn: () =>
        updateMagneticFieldsVisibility(
          config.showMagneticFields,
          magneticFieldsGroup,
          planets,
          null
        ),
      childToggle: {
        configKey: 'capMagneticFields',
        label: 'Cap',
        updateFn: () => updateMagneticFieldScales(planets),
      },
    },
  ];

  const list = document.createElement('div');
  list.className = 'object-list';

  items.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'object-item';
    if (cfg[item.configKey]) el.classList.add('active');

    // Main Content
    const leftPart = document.createElement('div');
    leftPart.style.display = 'flex';
    leftPart.style.alignItems = 'center';
    leftPart.style.flexGrow = '1';
    leftPart.innerHTML = `
        <div class="object-icon">${item.icon}</div>
        <div class="object-label">${item.label}</div>
    `;
    el.appendChild(leftPart);

    // Child Toggle (if any)
    let toggleEl: HTMLElement | null = null;

    if (item.childToggle) {
      toggleEl = document.createElement('div');
      toggleEl.className = 'object-toggle';
      if (cfg[item.childToggle.configKey]) toggleEl.classList.add('active');
      toggleEl.textContent = item.childToggle.label;

      toggleEl.style.display = cfg[item.configKey] ? 'flex' : 'none';

      toggleEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!item.childToggle) return;
        cfg[item.childToggle.configKey] = !cfg[item.childToggle.configKey];
        const isToggleActive = cfg[item.childToggle.configKey];

        if (toggleEl) {
          if (isToggleActive) toggleEl.classList.add('active');
          else toggleEl.classList.remove('active');
        }

        if (item.childToggle.updateFn) item.childToggle.updateFn();
      });

      el.appendChild(toggleEl);
    }

    // Main Click
    leftPart.addEventListener('click', () => {
      cfg[item.configKey] = !cfg[item.configKey];
      const isActive = cfg[item.configKey];

      if (isActive) {
        el.classList.add('active');
        if (toggleEl) toggleEl.style.display = 'flex';
      } else {
        el.classList.remove('active');
        if (toggleEl) toggleEl.style.display = 'none';
      }

      item.updateFn(isActive as boolean);
    });

    list.appendChild(el);
  });
  container.appendChild(list);
}

export function setupGuidesControlsCustom(
  container: HTMLElement,
  sun: { axisLine?: THREE.Line },
  planets: PlanetWrapper[],
  habitableZone: THREE.Object3D
) {
  const cfg = config as unknown as Config;
  const items: ControlItem[] = [
    {
      configKey: 'showAxes',
      label: 'Axes',
      icon: '📏',
      updateFn: (val: boolean) => updateAxesVisibility(val, sun, planets),
    },
    {
      configKey: 'showHabitableZone',
      label: 'Habitable Zone',
      icon: '🟢',
      updateFn: (val: boolean) => updateHabitableZoneVisibility(val, habitableZone),
    },
    {
      configKey: 'showNormalDebug',
      label: 'Normal Debug',
      icon: '🐛',
      updateFn: (val: boolean) => updateNormalDebug(val, planets),
    },
  ];

  const list = document.createElement('div');
  list.className = 'object-list';

  items.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'object-item';
    if (cfg[item.configKey]) el.classList.add('active');

    el.innerHTML = `
        <div class="object-icon">${item.icon}</div>
        <div class="object-label">${item.label}</div>
    `;

    el.addEventListener('click', () => {
      // Toggle config
      cfg[item.configKey] = !cfg[item.configKey];
      const isActive = cfg[item.configKey];

      // Update UI
      if (isActive) el.classList.add('active');
      else el.classList.remove('active');

      // Trigger update
      item.updateFn(isActive as boolean);
    });

    list.appendChild(el);
  });

  container.appendChild(list);
}
