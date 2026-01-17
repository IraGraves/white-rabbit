import type { Controller } from 'lil-gui';
import * as THREE from 'three';
import { config, REAL_PLANET_SCALE_FACTOR } from '../../../config';
import { updateOrbitMaterialColor } from '../../../materials/OrbitMaterial';
import type { MoonWrapper, PlanetWrapper } from '../../../types';

export function updateAsterismsVisibility(
  zodiacGroup: THREE.Group | null,
  asterismsGroup: THREE.Group | null
): void {
  const showZ = config.showZodiacs;
  const showC = config.showAsterisms;

  // Zodiac Group Visibility: Visible if either switch is ON
  if (zodiacGroup) {
    zodiacGroup.visible = showZ || showC;

    // Zodiac Group Color: Distinct (Blue) if Zodiac switch is ON, else same as others
    // Use brighter colors with low opacity for ethereal halo effect
    const color = showZ ? 0x77aaee : 0xbbccee;
    zodiacGroup.children.forEach((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        (mesh.material as THREE.MeshBasicMaterial).color.setHex(color);
        // Lower opacity for ethereal halo look
        (mesh.material as THREE.Material).opacity = showZ ? 0.45 : 0.35;
      }
    });
  }

  // Other Asterisms Visibility: Only if Asterisms switch is ON
  if (asterismsGroup) {
    asterismsGroup.visible = showC;
  }
}

export function updateAxesVisibility(
  val: boolean,
  sun: { axisLine?: THREE.Object3D },
  planets: PlanetWrapper[]
): void {
  // Toggle sun axis
  if (sun.axisLine) sun.axisLine.visible = val;

  // Toggle planet axes
  planets.forEach((p: PlanetWrapper) => {
    if (p.data.axisLine) p.data.axisLine.visible = val;

    // Toggle moon axes
    p.moons?.forEach((m: MoonWrapper) => {
      if (m.data.axisLine) m.data.axisLine.visible = val;
    });
  });
}

export function updateConstellationsBoundariesVisibility(
  constellationsGroup: THREE.Group | null
): void {
  if (constellationsGroup) {
    constellationsGroup.visible = config.showConstellations;
  }
}

export function updateDwarfVisibility(val: boolean, planets: PlanetWrapper[]) {
  planets.forEach((p) => {
    if (p.data.type === 'dwarf' && p.data.name !== 'Tesla Roadster') {
      if (p.group) p.group.visible = val;
      if (p.orbitLine) {
        p.orbitLine.visible = val && config.showDwarfPlanetOrbits;
      }
    }
  });
}

export function updateHabitableZoneVisibility(
  val: boolean,
  habitableZone: THREE.Object3D | null
): void {
  if (habitableZone) {
    habitableZone.visible = val;
  }
}

/**
 * Updates the scale of magnetic field meshes based on planet scale and capping setting.
 * If capped, fields won't grow beyond 100x planet scale equivalent.
 */
export function updateMagneticFieldScales(planets: PlanetWrapper[]): void {
  const currentScale = config.planetScale * REAL_PLANET_SCALE_FACTOR;
  let magScale = 1.0;

  if (config.capMagneticFields && currentScale > 100) {
    // Cap at 100x equivalent
    magScale = 100 / currentScale;
  }

  planets.forEach((p) => {
    // Planet fields
    const field = p.mesh.getObjectByName('MagneticField');
    if (field) field.scale.setScalar(magScale);

    // Moon fields
    (p.moons ?? []).forEach((m: MoonWrapper) => {
      const mField = m.mesh.getObjectByName('MagneticField');
      if (mField) mField.scale.setScalar(magScale);
    });
  });
}

export function updateMagneticFieldsVisibility(
  val: boolean,
  magneticFieldsGroup: THREE.Group | null,
  planets: PlanetWrapper[],
  capMagneticFieldsCtrl: Controller | null | undefined
): void {
  if (magneticFieldsGroup) {
    magneticFieldsGroup.visible = val;

    planets.forEach((p) => {
      p.mesh.children.forEach((child: THREE.Object3D) => {
        if (
          child.type === 'Group' &&
          child.children.length > 0 &&
          child.children[0].type === 'Line'
        ) {
          child.visible = val;
        }
      });

      // Also moons
      p.moons?.forEach((m: MoonWrapper) => {
        m.mesh.children.forEach((child: THREE.Object3D) => {
          if (
            child.type === 'Group' &&
            child.children.length > 0 &&
            child.children[0].type === 'Line'
          ) {
            child.visible = val;
          }
        });
      });
    });
  }
  if (capMagneticFieldsCtrl) {
    val ? capMagneticFieldsCtrl.show() : capMagneticFieldsCtrl.hide();
  }
}

export function updateMoonVisibility(val: boolean, planets: PlanetWrapper[], category: string) {
  planets.forEach((p) => {
    (p.moons ?? []).forEach((m: MoonWrapper) => {
      if (m.data.category === category) {
        m.mesh.visible = val;
        if (m.data.orbitLine) {
          m.data.orbitLine.visible = val && config.showMoonOrbits;
        }
      }
    });
  });
}

export function updateOrbitColors(
  orbitGroup: THREE.Group,
  relativeOrbitGroup: THREE.Group,
  planets: PlanetWrapper[]
) {
  const showColors = config.showPlanetColors;
  const showDwarfColors = config.showDwarfPlanetColors;
  const defaultColor = 0x77aaee; // Boosted cyan for better visibility

  // 1. Update Standard Orbits (Heliocentric / Tychonic)
  orbitGroup.children.forEach((line: THREE.Object3D) => {
    const planetName = line.name.replace('_Orbit', '');
    const planet = planets.find((p) => p.data.name === planetName);

    if (planet) {
      const isDwarf = planet.data.type === 'dwarf';
      const useColor = isDwarf ? showDwarfColors : showColors;
      const color = useColor ? planet.data.color || defaultColor : defaultColor;
      const opacity = useColor ? 0.9 : 0.7;

      // Use utility function that handles both shader and basic materials
      const l = line as THREE.Line;
      const mat = l.material as THREE.ShaderMaterial | THREE.LineBasicMaterial;
      updateOrbitMaterialColor(mat, color as number, opacity);

      // Update glow intensity based on color mode
      if ('uniforms' in mat && mat.uniforms?.uGlowIntensity) {
        mat.uniforms.uGlowIntensity.value = useColor ? 0.4 : 0.2;
      }
    }
  });

  // 2. Update Relative Orbits
  relativeOrbitGroup.children.forEach((line: THREE.Object3D) => {
    const bodyName = line.name.replace('_Trail', '');
    if (bodyName === 'Sun') return;

    const planet = planets.find((p) => p.data.name === bodyName);
    if (planet) {
      const isDwarf = planet.data.type === 'dwarf';
      const useColor = isDwarf ? showDwarfColors : showColors;
      const color = useColor ? planet.data.color || defaultColor : defaultColor;
      const opacity = useColor ? 0.9 : 0.7;

      // Use utility function that handles both shader and basic materials
      const l = line as THREE.Line;
      const mat = l.material as THREE.ShaderMaterial | THREE.LineBasicMaterial;
      updateOrbitMaterialColor(mat, color as number, opacity);

      // Update glow intensity based on color mode
      if ('uniforms' in mat && mat.uniforms?.uGlowIntensity) {
        mat.uniforms.uGlowIntensity.value = useColor ? 0.4 : 0.2;
      }
    }
  });
}

export function updateOrbitsVisibility(
  _orbitGroup: THREE.Group,
  planets: PlanetWrapper[],
  capMoonOrbitsCtrl: Controller | null | undefined
): void {
  // 1. Update Standard Orbits (Heliocentric / Tychonic)
  // Note: relativeOrbits.ts handles the actual visibility of the group and lines for relative modes.
  // Here we handle the "static" orbit lines attached to planets/moons.

  // Planet Orbits
  planets.forEach((p: PlanetWrapper) => {
    if (p.data.type !== 'dwarf') {
      if (p.orbitLine) {
        // Visible if Planet Orbits are ON AND the Planet itself is visible
        p.orbitLine.visible = config.showPlanetOrbits && config.showPlanets;
      }
    } else {
      // Dwarf Planet Orbits
      // Special case: Tesla Roadster is controlled by Mission toggle, not Dwarf toggle
      if (p.orbitLine && p.data.name !== 'Tesla Roadster') {
        p.orbitLine.visible = config.showDwarfPlanetOrbits && config.showDwarfPlanets;
      }
    }

    // Moon Orbits
    p.moons?.forEach((m: MoonWrapper) => {
      if (m.data.orbitLine) {
        // Check category visibility
        let isCategoryVisible = false;
        if (m.data.category === 'largest' && config.showLargestMoons) isCategoryVisible = true;
        else if (m.data.category === 'major' && config.showMajorMoons) isCategoryVisible = true;
        else if (m.data.category === 'small' && config.showSmallMoons) isCategoryVisible = true;
        if (!m.data.category) isCategoryVisible = true; // Fallback

        // Visible if Moon Orbits are ON AND the Moon Category is visible
        m.data.orbitLine.visible = config.showMoonOrbits && isCategoryVisible;
      }
    });
  });

  if (capMoonOrbitsCtrl) {
    capMoonOrbitsCtrl.domElement.style.display = config.showMoonOrbits ? '' : 'none';
  }
}

export function updatePlanetVisibility(val: boolean, planets: PlanetWrapper[]) {
  planets.forEach((p: PlanetWrapper) => {
    if (p.data.type !== 'dwarf') {
      p.mesh.visible = val;
      if (p.data.cloudMesh) p.data.cloudMesh.visible = val;

      // Toggle planet orbit line
      if (p.orbitLine) {
        p.orbitLine.visible = val && config.showPlanetOrbits;
      }

      // Rings should also be toggled
      p.group?.children.forEach((child: THREE.Object3D) => {
        if (child !== p.mesh && child !== p.orbitLinesGroup && child.type === 'Mesh') {
          if (!child.userData.isMoon) {
            // This catches rings
            child.visible = val;
          }
        }
      });
    }
  });
}

export function updateReferencePlane(val: string, universeGroup: THREE.Group | null): void {
  if (universeGroup) {
    if (val === 'Ecliptic') {
      // Rotate universe so Ecliptic is flat (X-Z plane)
      // Ecliptic is tilted by Obliquity relative to Equatorial (~23.44 degrees)
      // Equatorial Y is North. Ecliptic North is tilted.
      // To make Ecliptic flat, we rotate the whole universe around X axis.

      const obliquity = 23.43928; // Mean Obliquity of the Ecliptic J2000
      const obliquityRad = THREE.MathUtils.degToRad(obliquity);

      // Rotate around X axis to bring Ecliptic to horizontal
      // Equatorial to Ecliptic transformation requires negative rotation
      universeGroup.rotation.x = -obliquityRad;
    } else {
      // Equatorial (Default)
      universeGroup.rotation.x = 0;
    }
  }
}

/**
 * Updates the scale of the Sun's magnetic field meshes.
 * @param {THREE.Group} universeGroup - The universe group containing the sun fields
 * @param {number} scale - The new scale factor
 */
export function updateSunMagneticFieldScale(universeGroup: THREE.Group, scale: number) {
  if (!universeGroup) return;

  const basicField = universeGroup.children.find((c) => c.name === 'SunMagneticFieldBasic');
  if (basicField) {
    basicField.scale.setScalar(scale);
  }

  const solarWindField = universeGroup.children.find((c) => c.name === 'MagneticField');
  if (solarWindField) {
    // User requested fixed size for solar wind (equivalent to 20x sun scale)
    // 20x sun scale corresponds to internal scale of 1.0
    solarWindField.scale.setScalar(1.0);
  }
}

export function updateSunVisibility(val: boolean, sun: THREE.Mesh) {
  sun.visible = val;
}

export function updateZodiacSignsVisibility(
  val: boolean,
  zodiacSignsGroup: THREE.Group | null
): void {
  if (zodiacSignsGroup) {
    zodiacSignsGroup.visible = val;
  }
}

export function updateNormalDebug(val: boolean, planets: PlanetWrapper[]) {
  planets.forEach((p) => {
    // Check if planet has S2Tileset attached (usually via 'tileset' property or similar)
    // Since PlanetWrapper is generic, we check loosely or via userData
    // However, the most robust way given our architecture is to check if 'tileset' exists on the wrapper
    // or if the mesh itself has the uniform (for non-S2 planets).

    // 1. Standard Mesh (Non-S2 or Root)
    const mesh = p.mesh;
    if (mesh && mesh.material) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat.userData.debugUniforms?.uDebugNormals) {
        mat.userData.debugUniforms.uDebugNormals.value = val;
      }
    }

    // 2. S2 Tileset
    // We assume the tileset reference might be stored on the wrapper or mesh userData
    // Based on previous knowledge, S2Tileset is separate.
    // But since we can't easily import S2Tileset type here without circular deps or type issues?
    // Let's assume (p as any).tileset exists if it was initialized.
    const tileset = (p as any).tileset;
    if (tileset && typeof tileset.setDebugNormals === 'function') {
      tileset.setDebugNormals(val);
    }
  });
}
