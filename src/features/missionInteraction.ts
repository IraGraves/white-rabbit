/**
 * @file missionInteraction.ts
 * @description User interaction handling for mission trajectory lines.
 *
 * This module handles:
 * - Raycasting for click detection on mission lines
 * - Opening the explorer window when a mission is selected
 * - Dispatching mission selection events
 */

import * as THREE from 'three';

/**
 * Sets up click interaction for mission trajectory lines.
 * Clicking on a visible mission line opens the explorer window and selects that mission.
 * @param camera - The scene camera for raycasting
 * @param missionGroup - The group containing all mission lines
 * @param domElement - The DOM element to attach click listener to
 * @returns Cleanup function to remove the event listener
 */
export function setupMissionInteraction(
  camera: THREE.Camera,
  missionGroup: THREE.Group,
  domElement: HTMLElement
): () => void {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Threshold for line selection (0.5 scene units is reasonable for scaled AU)
  raycaster.params.Line.threshold = 0.5;

  const onClick = (event: MouseEvent) => {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Only check visible mission lines
    const visibleChildren = missionGroup.children.filter((c) => c.visible);
    const intersects = raycaster.intersectObjects(visibleChildren, false);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const missionId = object.userData.id;

      if (missionId) {
        // 1. Open Explorer Window
        import('../ui/WindowManager').then(({ windowManager }) => {
          const win = windowManager.getWindow('explorer-window');
          if (win) {
            windowManager.showWindow('explorer-window');
            if (win.controller) {
              win.controller.selectTab('mission-details');
            }
          }
        });

        // 2. Select Mission via Event
        const customEvent = new CustomEvent('mission-selected', { detail: { missionId } });
        window.dispatchEvent(customEvent);
      }
    }
  };

  domElement.addEventListener('click', onClick);

  // Return cleanup function
  return () => {
    domElement.removeEventListener('click', onClick);
  };
}
