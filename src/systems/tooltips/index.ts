/**
 * @file index.ts
 * @description Interactive tooltip system with multi-mode object detection for celestial bodies, stars, and constellations.
 */
import * as THREE from 'three';
import { config, PARSEC_TO_SCENE } from '../../config';
import type {
  CelestialBodyData,
  MoonData,
  ObjectHitResult,
  OctreePoint,
  PlanetWrapper,
  StarData,
} from '../../types';
import { windowManager } from '../../ui/WindowManager';
import { distToSegmentSquared, findClosestObjectScreenSpace } from '../../utils/screenSpace';
import { formatTooltip } from './formatters';

const SCREEN_HIT_RADIUS = 10; // Pixels on screen for hit detection

/**
 * Sets up the interactive tooltip system for celestial objects
 * @param {THREE.Camera} camera - The scene camera
 * @param {Array} planets - Array of planet objects
 * @param {THREE.Mesh} sun - The sun mesh
 * @param {Object} starsRef - Reference to the starfield points object
 * @param {THREE.Group} zodiacGroup - Group containing zodiac lines
 * @param {THREE.Group} constellationsGroup - Group containing other constellation lines
 */
export function setupTooltipSystem(
  camera: THREE.Camera,
  planets: PlanetWrapper[],
  sun: THREE.Mesh,
  starsRef: { value: THREE.Group | null },
  zodiacGroup: THREE.Group,
  asterismsGroup: THREE.Group
): void {
  const tooltip = document.getElementById('tooltip');

  // Create Info Window via WindowManager
  const infoWindowObj = windowManager.createWindow('object-info', 'Object Info', {
    x: 20,
    y: 20,
    width: '300px',
    onClose: () => {
      // Optional: Update config or dock state if needed
    },
  });

  // Start hidden
  windowManager.hideWindow('object-info');

  const infoWindow = infoWindowObj?.element; // Keep reference for existing logic checking .info-window class

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('mousemove', (event) => {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Block tooltips if hovering over the GUI, Info Window, or Mini-Orrery radar
    const target = event.target as HTMLElement;
    if (
      target &&
      (target.closest('.lil-gui') ||
        target.closest('.mini-orrery-container') ||
        (target.closest('.info-window') && config.objectInfoMode === 'window'))
    ) {
      if (config.objectInfoMode === 'tooltip' && tooltip) {
        tooltip.style.display = 'none';
      }
      document.body.style.cursor = 'default';
      return;
    }

    if (!tooltip) return;

    // Check Mode
    if (config.objectInfoMode === 'off') {
      tooltip.style.display = 'none';
      if (infoWindow) infoWindow.style.display = 'none';
      document.body.style.cursor = 'default';
      return;
    }

    let closestObject: ObjectHitResult | null = null;

    // 1. Check Planets, Sun, and Moons using Raycaster (3D)
    const interactableObjects = [sun];
    planets.forEach((p) => {
      interactableObjects.push(p.mesh);
      if (p.moons) {
        for (const m of p.moons) {
          interactableObjects.push(m.mesh);
        }
      }
    });

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactableObjects, true);

    if (intersects.length > 0) {
      // Found a 3D object (Planet/Sun/Moon)
      const hit = intersects[0];
      const objectData = getObjectData(hit.object, planets, sun);
      if (objectData) {
        closestObject = objectData;
      }
    }

    // 1.5 Screen Space Fallback for Planets/Moons (Generous Hit)
    if (!closestObject) {
      const fallbackObject = findClosestObjectScreenSpace(
        mouseX,
        mouseY,
        camera,
        planets,
        sun
      ) as ObjectHitResult | null;
      if (fallbackObject) {
        closestObject = fallbackObject;
      }
    }

    // 2. Check Stars (only if no 3D object found)
    if (!closestObject) {
      const starsGroup = starsRef.value;
      if (starsGroup) {
        const manager = starsGroup.userData.manager;

        const STAR_HIT_RADIUS = 15;
        let minScreenDist = STAR_HIT_RADIUS;

        const candidates: OctreePoint[] = [];

        if (manager) {
          const octrees = manager.getOctrees();
          if (octrees.length > 0) {
            raycaster.setFromCamera(mouse, camera);

            // Transform ray to local octree space
            const inverseMatrix = new THREE.Matrix4().copy(starsGroup.matrixWorld).invert();
            const localOrigin = raycaster.ray.origin.clone().applyMatrix4(inverseMatrix);
            const normalMatrix = new THREE.Matrix3().getNormalMatrix(inverseMatrix);
            const localDirection = raycaster.ray.direction
              .clone()
              .applyMatrix3(normalMatrix)
              .normalize();
            const localRay = new THREE.Ray(localOrigin, localDirection);

            // Use very large threshold - we'll filter by screen space anyway
            // 50000 scene units ensures we catch distant stars
            for (const octree of octrees) {
              const results = octree.queryRay(localRay, 50000);
              candidates.push(...results);
            }
          }
        }

        // Screen-space filtering of candidates
        for (const candidate of candidates) {
          const star = candidate.data;
          if (!star) continue;

          // Visibility check
          if (star.mag !== undefined && config.magnitudeLimit !== undefined) {
            if (star.mag > config.magnitudeLimit) continue;
          }

          // Get position - either from octree or calculate
          let starPos: THREE.Vector3;
          if (candidate.position) {
            starPos = candidate.position.clone();
          } else {
            starPos = new THREE.Vector3(
              (star.x ?? 0) * PARSEC_TO_SCENE,
              (star.z ?? 0) * PARSEC_TO_SCENE,
              -(star.y ?? 0) * PARSEC_TO_SCENE
            );
          }

          // Transform to world space and project
          starPos.applyMatrix4(starsGroup.matrixWorld);
          const projected = starPos.clone().project(camera);

          // Skip stars behind camera
          if (projected.z > 1 || projected.z < -1) continue;

          // Screen-space distance check
          const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
          const screenY = (-(projected.y * 0.5) + 0.5) * window.innerHeight;

          const dx = mouseX - screenX;
          const dy = mouseY - screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < minScreenDist) {
            minScreenDist = dist;
            closestObject = { data: star, type: 'star' } as ObjectHitResult;
          }
        }
      }
    }

    // 3. Check Constellations (Screen Space) - Only if no planet or star hit
    if (!closestObject) {
      const groupsToCheck = [];
      if (zodiacGroup?.visible) groupsToCheck.push(zodiacGroup);
      if (asterismsGroup?.visible) groupsToCheck.push(asterismsGroup);

      let minLineDist = SCREEN_HIT_RADIUS;

      groupsToCheck.forEach((group) => {
        group.children.forEach((line) => {
          if (!(line instanceof THREE.Line)) return;

          const positions = (line as THREE.Line).geometry.attributes.position;
          const p1 = new THREE.Vector3();
          const p2 = new THREE.Vector3();

          // Iterate segments
          for (let i = 0; i < positions.count - 1; i++) {
            p1.fromBufferAttribute(positions, i);
            p2.fromBufferAttribute(positions, i + 1);

            // Transform to world space then project
            p1.applyMatrix4(line.matrixWorld);
            p2.applyMatrix4(line.matrixWorld);

            const s1 = p1.clone().project(camera);
            const s2 = p2.clone().project(camera);

            // Check if in front of camera
            if (s1.z < -1 || s1.z > 1 || s2.z < -1 || s2.z > 1) continue;

            // Convert to screen coords
            const x1 = (s1.x * 0.5 + 0.5) * window.innerWidth;
            const y1 = (-(s1.y * 0.5) + 0.5) * window.innerHeight;
            const x2 = (s2.x * 0.5 + 0.5) * window.innerWidth;
            const y2 = (-(s2.y * 0.5) + 0.5) * window.innerHeight;

            // Distance from point (mouseX, mouseY) to segment (x1,y1)-(x2,y2)
            const dist = distToSegmentSquared(mouseX, mouseY, x1, y1, x2, y2);

            if (dist < minLineDist * minLineDist) {
              minLineDist = Math.sqrt(dist);
              closestObject = { type: 'asterism', data: line.userData } as ObjectHitResult;
            }
          }
        });
      });
    }

    // Display based on mode
    if (closestObject) {
      document.body.style.cursor = 'pointer';
      const content = formatTooltip(closestObject);

      if (config.objectInfoMode === 'tooltip') {
        tooltip.innerHTML = content;
        tooltip.style.display = 'block';
        if (infoWindow) infoWindow.style.display = 'none';

        // Smart positioning to keep tooltip on screen
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const margin = 15;

        let left = mouseX + margin;
        let top = mouseY + margin;

        // Check right edge
        if (left + tooltipWidth > window.innerWidth) {
          left = mouseX - tooltipWidth - margin;
        }

        // Check bottom edge
        if (top + tooltipHeight > window.innerHeight) {
          top = mouseY - tooltipHeight - margin;
        }

        // Ensure it doesn't go off top/left
        if (left < 0) left = margin;
        if (top < 0) top = margin;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      } else if (config.objectInfoMode === 'window') {
        tooltip.style.display = 'none';

        // Only update if window is open (Inspector mode)
        const winState = windowManager.getWindow('object-info');
        if (winState && winState.element.style.display !== 'none') {
          // Window is open, we can update it.
          if (infoWindowObj?.content) {
            infoWindowObj.content.innerHTML = content;
          }
        } else {
          // Window is closed. Do not force open.
          return;
        }

        // Update Title
        let title = 'Object Info';
        if (closestObject.type === 'planet' || closestObject.type === 'moon') {
          title = (closestObject.data as CelestialBodyData | MoonData).name;
        } else if (closestObject.type === 'sun') {
          title = 'Sun';
        } else if (closestObject.type === 'star') {
          const sData = closestObject.data as StarData;
          title = sData.name || `HD ${sData.id}`;
        } else if (closestObject.type === 'asterism') {
          title = (closestObject.data as { id: string }).id;
        }

        if (infoWindowObj?.header) {
          const titleEl = infoWindowObj.header.querySelector('.window-title');
          if (titleEl) titleEl.textContent = title;
        }
      }
    } else {
      tooltip.style.display = 'none';
      document.body.style.cursor = 'default';
    }
  });
}

/**
 * Helper to map mesh back to data object
 */
function getObjectData(
  mesh: THREE.Object3D,
  planets: PlanetWrapper[],
  sun: THREE.Mesh
): ObjectHitResult | null {
  if (mesh.userData && mesh.userData.type === 'asterism') {
    return { type: 'asterism', data: mesh.userData };
  }

  if (mesh === sun || mesh.parent === sun) {
    return { type: 'sun', data: {} as CelestialBodyData };
  }

  for (const p of planets) {
    if (p.mesh === mesh || p.mesh === mesh.parent) {
      return { type: 'planet', data: p.data, parentName: undefined };
    }
    if (p.moons) {
      for (const m of p.moons) {
        if (m.mesh === mesh || m.mesh === mesh.parent) {
          return { type: 'moon', data: m.data, parentName: p.data.name };
        }
      }
    }
  }
  return null;
}
