/**
 * @file focusMode.ts
 * @description Camera focus and tracking system for celestial bodies.
 *
 * This file implements the focus mode feature, which allows users to double-click on any celestial
 * body (sun, planet, moon) to smoothly transition the camera to follow that object.
 *
 * Refactored to support OriginAwareArcballControls:
 * - Uses virtual coordinates for camera/target calculations
 * - Delegates actual camera movement to controls
 */
import * as THREE from 'three';
import { config } from '../config';
import { textureManager } from '../managers/TextureManager';
import type {
  CelestialBodyData,
  FocusableObject,
  MoonData,
  MoonWrapper,
  OriginAwareControls,
  PlanetWrapper,
  StarData,
} from '../types';
import { getMissionState } from './missions';

const SCREEN_HIT_RADIUS = 15; // Pixels on screen for hit detection
const ANIMATION_DURATION = 2000; // ms for camera transition
const TARGET_SCREEN_FRACTION = 0.35; // Target screen coverage fraction

let focusedObject: FocusableObject | null = null;
let isAnimating = false;
let animationStartTime = 0;
const animationStartPosition = new THREE.Vector3();
const animationStartTarget = new THREE.Vector3();
const animationEndPosition = new THREE.Vector3();
const animationEndTarget = new THREE.Vector3();
const previousObjectPosition = new THREE.Vector3(); // Tracks object's virtual position

/**
 * Sets up the focus mode system with double-click detection
 */
export function setupFocusMode(
  camera: THREE.Camera,
  controls: OriginAwareControls,
  planets: PlanetWrapper[],
  sun: THREE.Mesh
): void {
  // Handle Right-Click Reset
  const rightClickStartPos = new THREE.Vector2();

  window.addEventListener('mousedown', (event) => {
    if (event.button === 2) {
      rightClickStartPos.set(event.clientX, event.clientY);
    }
  });

  window.addEventListener('mouseup', (event: MouseEvent) => {
    if (event.button === 2 && focusedObject) {
      const dist = rightClickStartPos.distanceTo(new THREE.Vector2(event.clientX, event.clientY));
      if (dist < 5) {
        const clickedObj = findObjectAtPosition(
          event.clientX,
          event.clientY,
          camera,
          controls,
          planets,
          sun
        );

        if (clickedObj) {
          if (clickedObj.mesh === focusedObject.mesh) {
            recenterFocus(camera, controls);
          } else {
            lookAtObject(clickedObj.mesh, camera, controls);
          }
        }
      }
    }
  });

  window.addEventListener('dblclick', (event: MouseEvent) => {
    const clickedObject = findObjectAtPosition(
      event.clientX,
      event.clientY,
      camera,
      controls,
      planets,
      sun
    );
    if (clickedObject) {
      focusOnObject(clickedObject, camera, controls);
    } else if (focusedObject) {
      exitFocusMode(controls);
    }
  });

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && focusedObject) {
      exitFocusMode(controls);
    }
  });
}

/**
 * Updates the camera position when in focus mode
 */
export function formatDecimal(value: number): string {
  // This function seems to be misplaced or intended for another file.
  // As per the instruction, it's added here, but its purpose within focusMode.ts is unclear.
  // Assuming it's a utility function, a basic implementation is provided.
  return value.toFixed(2);
}

export function updateFocusMode(camera: THREE.Camera, controls: OriginAwareControls): void {
  const now = performance.now();

  // Animation logic
  if (isAnimating) {
    const elapsed = now - animationStartTime;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;

    // Interpolate using VIRTUAL positions
    const currentPos = new THREE.Vector3().lerpVectors(
      animationStartPosition,
      animationEndPosition,
      eased
    );
    const currentTarget = new THREE.Vector3().lerpVectors(
      animationStartTarget,
      animationEndTarget,
      eased
    );

    // Apply via controls API
    if (controls.setVirtualPosition && controls.setVirtualTarget) {
      controls.setVirtualPosition(currentPos);
      controls.setVirtualTarget(currentTarget);
    } else {
      camera.position.copy(currentPos);
      controls.target.copy(currentTarget);
    }

    if (progress >= 1) {
      isAnimating = false;
      // Initialize previous position in VIRTUAL space
      if (focusedObject) {
        if (
          focusedObject.type === 'probe' &&
          focusedObject.data &&
          (focusedObject.data as any).id
        ) {
          const state = getMissionState((focusedObject.data as any).id, config.date);
          if (state) previousObjectPosition.copy(state.position);
          else previousObjectPosition.copy(getObjectVirtualPosition(focusedObject.mesh, controls));
        } else {
          previousObjectPosition.copy(getObjectVirtualPosition(focusedObject.mesh, controls));
        }
      }

      // Reset momentum to prevent jumps
      if (controls.resetMomentum) {
        controls.resetMomentum();
      }

      controls.enabled = true;
    }

    // Controls update loop handles camera sync automatically.
    return;
  }

  // Tracking logic
  if (focusedObject && !isAnimating) {
    if (!focusedObject.mesh.visible) {
      exitFocusMode(controls);
      return;
    }

    // Prevents conflict between Tracking and User Interaction/Momentum
    // If controls are not IDLE (0), user is dragging or momentum is active.
    // We pause tracking to avoid "fighting" the physics which causes acceleration glitches.
    // STATE.IDLE is 0.

    // REMOVED CHECK: For fast moving probes (zoomed in), we MUST continue tracking even during interaction.
    // Applying delta to both camera and target preserves relative view, so rotation should be safe.

    // Get current virtual position of target (the planet/probe)
    let currentObjectPosition: THREE.Vector3;
    if (focusedObject.type === 'probe' && focusedObject.data && (focusedObject.data as any).id) {
      const state = getMissionState((focusedObject.data as any).id, config.date);
      if (state) currentObjectPosition = state.position.clone();
      else currentObjectPosition = getObjectVirtualPosition(focusedObject.mesh, controls);
    } else {
      currentObjectPosition = getObjectVirtualPosition(focusedObject.mesh, controls);
    }

    // Calculate actual movement of the object since last frame
    const delta = new THREE.Vector3().subVectors(currentObjectPosition, previousObjectPosition);

    // Filter out huge jumps (e.g. initial rebase or teleport)
    if (delta.lengthSq() > 0 && delta.lengthSq() < 1000000) {
      // Apply delta to both Camera and Target to move them together
      // This maintains the relative camera position to the object (following)

      if (
        controls.setVirtualPosition &&
        controls.getVirtualPosition &&
        controls.getVirtualTarget &&
        controls.setVirtualTarget
      ) {
        const camPos = controls.getVirtualPosition();
        const targetPos = controls.getVirtualTarget();

        camPos.add(delta);
        targetPos.add(delta);

        controls.setVirtualPosition(camPos);
        controls.setVirtualTarget(targetPos);
      } else {
        camera.position.add(delta);
        controls.target.add(delta);
      }
    }

    previousObjectPosition.copy(currentObjectPosition);
  }
}

/**
 * Helper to get the "Virtual" world position of a mesh
 * Handles both OriginAware and standard controls
 */
function getObjectVirtualPosition(
  mesh: THREE.Object3D,
  controls: OriginAwareControls
): THREE.Vector3 {
  const scenePos = new THREE.Vector3();
  mesh.getWorldPosition(scenePos);

  if (controls.localToWorld) {
    return controls.localToWorld(scenePos);
  }
  return scenePos;
}

/**
 * Focuses the camera on a specific object
 */
export function focusOnObject(
  targetObject: FocusableObject,
  camera: THREE.Camera,
  controls: OriginAwareControls,
  screenFraction: number = TARGET_SCREEN_FRACTION
): void {
  if (!targetObject) return;
  if (focusedObject && focusedObject !== targetObject) {
    disableHighRes(focusedObject);
  }

  focusedObject = targetObject;

  if (targetObject.type !== 'probe') {
    enableHighRes(focusedObject);
    // Safe access to 'name' property
    const data = targetObject.data as Partial<CelestialBodyData>;
    if (data.name) {
      textureManager.loadHighRes(data.name);
    }
  }

  // Calculate target position in Virtual Space
  let worldPos: THREE.Vector3;
  if (targetObject.type === 'probe' && targetObject.data && (targetObject.data as any).id) {
    const state = getMissionState((targetObject.data as any).id, config.date);
    worldPos = state
      ? state.position.clone()
      : getObjectVirtualPosition(targetObject.mesh, controls);
  } else {
    worldPos = getObjectVirtualPosition(targetObject.mesh, controls);
  }

  // Calculate Visual Radius
  const data = targetObject.data as Partial<CelestialBodyData>;
  const radius = data.radius || 5;
  let currentScale = 1;
  if (targetObject.type === 'sun') currentScale = config.sunScale;
  else if (targetObject.type === 'planet' || targetObject.type === 'moon')
    currentScale = config.planetScale;

  const visualRadius = radius * currentScale;

  // Calculate Distance
  const fovInRadians = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
  let distance = visualRadius / Math.sin((fovInRadians * screenFraction) / 2);
  if (targetObject.type === 'probe') distance = Math.max(distance, 2e-6);

  // Offset
  let offset: THREE.Vector3;

  if (targetObject.type === 'probe') {
    // Chase Camera: Behind and slightly above
    // Get mission state to find direction
    const missionId = (targetObject.data as { id: string }).id;
    const state = getMissionState(missionId, config.date);
    const direction = new THREE.Vector3(0, 0, 1); // Default fallback

    if (state?.direction) {
      direction.copy(state.direction);
    }

    // Chase camera: position behind probe (-direction) with slight vertical offset
    const backDist = distance * 1.0;
    const upDist = distance * 0.3; // 30% elevation above trajectory

    const up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(direction.dot(up)) > 0.99) {
      up.set(1, 0, 0); // Gimbal lock fallback when direction is vertical
    }

    offset = direction.clone().multiplyScalar(-backDist).add(up.multiplyScalar(upDist));
  } else {
    // Standard Diagonal view for planets
    const angle = Math.PI / 6;
    offset = new THREE.Vector3(
      distance * Math.cos(angle),
      distance * Math.sin(angle),
      distance * Math.cos(angle)
    );
  }

  // Capture Start State
  if (controls.getVirtualPosition && controls.getVirtualTarget) {
    animationStartPosition.copy(controls.getVirtualPosition());
    animationStartTarget.copy(controls.getVirtualTarget());
  } else {
    animationStartPosition.copy(camera.position);
    animationStartTarget.copy(controls.target);
  }

  // Calculate End State
  animationEndPosition.copy(worldPos).add(offset);
  animationEndTarget.copy(worldPos);

  isAnimating = true;
  animationStartTime = performance.now();
  controls.enabled = false;

  if (controls.enablePan !== undefined) controls.enablePan = false;

  // Adjust Control Sensitivity
  if (controls.scaleFactor !== undefined) {
    if (targetObject.type === 'probe') {
      controls.scaleFactor = 1.02; // Slower/finer zoom for small probes
    } else {
      controls.scaleFactor = 1.1; // Standard zoom speed
    }
  }

  // Reduce Rotation Speed for smoother inspection
  if (controls.rotateSpeed !== undefined) {
    controls.rotateSpeed = 0.05;
  }

  const objectName = (targetObject.data as Partial<CelestialBodyData>).name || 'Object';
  showFocusNotification(objectName);
}

/**
 * Recenters focus
 */
export function recenterFocus(camera: THREE.Camera, controls: OriginAwareControls): void {
  if (!focusedObject) return;

  const worldPos = getObjectVirtualPosition(focusedObject.mesh, controls);

  let currentTarget: THREE.Vector3;
  if (controls.getVirtualTarget) {
    currentTarget = controls.getVirtualTarget();
  } else {
    currentTarget = controls.target.clone();
  }

  const panOffset = new THREE.Vector3().subVectors(currentTarget, worldPos);
  if (panOffset.lengthSq() < 0.0001) return;

  if (controls.getVirtualPosition) {
    animationStartPosition.copy(controls.getVirtualPosition());
  } else {
    animationStartPosition.copy(camera.position);
  }
  animationStartTarget.copy(currentTarget);

  // End State: Camera stays put (virtual), Target centers on object (virtual)
  animationEndPosition.copy(animationStartPosition);
  animationEndTarget.copy(worldPos);

  animationStartTime = performance.now();
  isAnimating = true;
  controls.enabled = false;

  // Ensure sensitivity is correct (in case we switched context somehow, though focusOnObject should handle it)
  if (controls.scaleFactor !== undefined && focusedObject.type === 'probe') {
    controls.scaleFactor = 1.02;
  }
  if (controls.rotateSpeed !== undefined) {
    controls.rotateSpeed = 0.05;
  }

  showFocusNotification('View Recentered');
}

/**
 * Looks at object (rotates view)
 */
function lookAtObject(
  targetMesh: THREE.Object3D,
  camera: THREE.Camera,
  controls: OriginAwareControls
): void {
  const worldPos = getObjectVirtualPosition(targetMesh, controls);

  if (controls.getVirtualPosition && controls.getVirtualTarget) {
    animationStartPosition.copy(controls.getVirtualPosition());
    animationStartTarget.copy(controls.getVirtualTarget());
  } else {
    animationStartPosition.copy(camera.position);
    animationStartTarget.copy(controls.target);
  }

  animationEndPosition.copy(animationStartPosition); // Keep camera pos
  animationEndTarget.copy(worldPos); // New target

  animationStartTime = performance.now();
  isAnimating = true;
  controls.enabled = false;

  showFocusNotification('Looking at Target');
}

export function exitFocusMode(
  controls: OriginAwareControls,
  suppressFeedback: boolean = false
): void {
  if (focusedObject) {
    disableHighRes(focusedObject);
    focusedObject = null;
  }
  controls.enabled = true;
  if (controls.enablePan !== undefined) controls.enablePan = true;

  // Restore default sensitivity
  if (controls.scaleFactor !== undefined) {
    controls.scaleFactor = 1.1;
  }
  if (controls.rotateSpeed !== undefined) {
    controls.rotateSpeed = 1.0;
  }

  if (!suppressFeedback) {
    showFocusNotification('Focus mode deactivated');
  }
}

// NOTE: findObjectAtPosition uses raycasting which operates in Scene Space.
// No virtual coordinate conversion needed since camera is at origin and objects are shifted.

function enableHighRes(objectWrapper: FocusableObject): void {
  if (!objectWrapper || !objectWrapper.mesh) return;

  if (!objectWrapper.originalGeometry) {
    objectWrapper.originalGeometry = (objectWrapper.mesh as THREE.Mesh).geometry;
  }
  const radius = (objectWrapper.data as Partial<CelestialBodyData>).radius || 5;
  const highResGeo = new THREE.SphereGeometry(radius, 128, 128);
  (objectWrapper.mesh as THREE.Mesh).geometry = highResGeo;
}

function disableHighRes(objectWrapper: FocusableObject): void {
  if (!objectWrapper || !objectWrapper.mesh || !objectWrapper.originalGeometry) return;
  (objectWrapper.mesh as THREE.Mesh).geometry.dispose();
  (objectWrapper.mesh as THREE.Mesh).geometry = objectWrapper.originalGeometry;
  delete objectWrapper.originalGeometry;
}

function findObjectAtPosition(
  mouseX: number,
  mouseY: number,
  camera: THREE.Camera,
  _controls: OriginAwareControls,
  planets: PlanetWrapper[],
  sun: THREE.Mesh | null
): FocusableObject | null {
  // Raycasting works in Scene Space (Visual)
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  mouse.x = (mouseX / window.innerWidth) * 2 - 1;
  mouse.y = -(mouseY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const interactableObjects: THREE.Object3D[] = [];
  const objectMap = new Map<string, FocusableObject>();

  if (sun) {
    interactableObjects.push(sun);
    objectMap.set(sun.uuid, {
      mesh: sun,
      data: { name: 'Sun', radius: 4.65 } as CelestialBodyData,
      type: 'sun',
    });
  }

  planets.forEach((planet) => {
    if (planet.mesh?.visible) {
      interactableObjects.push(planet.mesh);
      objectMap.set(planet.mesh.uuid, {
        mesh: planet.mesh,
        data: planet.data,
        type: 'planet',
      });
      planet.moons?.forEach((moon: MoonWrapper) => {
        if (moon.mesh?.visible) {
          interactableObjects.push(moon.mesh);
          objectMap.set(moon.mesh.uuid, {
            mesh: moon.mesh,
            data: moon.data,
            type: 'moon',
          });
        }
      });
    }
  });

  const intersects = raycaster.intersectObjects(interactableObjects, false);
  if (intersects.length > 0) {
    return objectMap.get(intersects[0].object.uuid) || null;
  }

  // Fallback: Proximity (Screen Space)
  let closestObject: FocusableObject | null = null;
  let closestDistance = SCREEN_HIT_RADIUS;

  const checkObject = (
    mesh: THREE.Object3D,
    objectData: CelestialBodyData | MoonData | StarData | Record<string, unknown>,
    objectType: 'sun' | 'planet' | 'moon' | 'star' | 'probe'
  ) => {
    if (!mesh || !mesh.position || !mesh.visible) return;
    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos); // Scene Space
    const projected = worldPos.clone().project(camera);
    if (projected.z > 1 || projected.z < -1) return;
    const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const screenY = (-(projected.y * 0.5) + 0.5) * window.innerHeight;
    const dx = mouseX - screenX;
    const dy = mouseY - screenY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestObject = { mesh, data: objectData, type: objectType };
    }
  };

  if (sun) checkObject(sun, { name: 'Sun', radius: 4.65 } as CelestialBodyData, 'sun');
  planets.forEach((planet) => {
    checkObject(planet.mesh, planet.data, 'planet');
    planet.moons?.forEach((moon: MoonWrapper) => {
      checkObject(moon.mesh, moon.data, 'moon');
    });
  });

  return closestObject;
}

function showFocusNotification(message: string): void {
  let notification = document.getElementById('focus-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'focus-notification';
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
    document.body.appendChild(notification);
  }
  notification.textContent = message;
  notification.style.opacity = '1';
  setTimeout(() => {
    notification.style.opacity = '0';
  }, 2000);
}

export function isFocusModeActive(): boolean {
  return focusedObject !== null;
}

export function getFocusedObject(): FocusableObject | null {
  return focusedObject;
}
