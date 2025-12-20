/**
 * @file missionProbes.ts
 * @description 3D probe model loading and positioning for space missions.
 *
 * This module handles:
 * - Loading GLTF/GLB probe models with DRACO compression
 * - Positioning probes along their trajectories based on simulation time
 * - Model caching for efficiency (shared with ModelPreview)
 * - Probe visibility management
 */

import * as THREE from 'three';
import { config } from '../config';
import { missionData } from '../data/missions';
import type { MissionData, PlanetWrapper } from '../types';

// Extend window interface for mission scene reference
declare global {
  interface Window {
    _mainMissionScene?: THREE.Object3D;
    updateMissions?: () => void;
    SimulationControl?: {
      planets: PlanetWrapper[];
      camera?: THREE.Camera;
      universeGroup?: THREE.Group;
      controls?: {
        getVirtualPosition: () => THREE.Vector3;
      };
    };
  }
}

// Store probe groups by missionId
const missionProbes: Record<string, THREE.Object3D> = {};

// Reference to missionLines - will be set by missionState module
let getMissionStateFunc:
  | ((
      missionId: string,
      date: Date | number,
      overrideSystem?: string
    ) => { position: THREE.Vector3; direction: THREE.Vector3 } | null)
  | null = null;

/**
 * Sets the getMissionState function reference (to avoid circular dependency).
 * @param fn - The getMissionState function from missionState module
 */
export function setGetMissionStateFunc(
  fn: (
    missionId: string,
    date: Date | number,
    overrideSystem?: string
  ) => { position: THREE.Vector3; direction: THREE.Vector3 } | null
): void {
  getMissionStateFunc = fn;
}

/**
 * Sets the scene reference for probe models.
 * @param scene - The main scene to add probes to
 */
export function setMissionProbeScene(scene: THREE.Object3D): void {
  window._mainMissionScene = scene;
}

/**
 * Loads a probe model for a mission (from cache or via GLTFLoader).
 * Uses the same cache as ModelPreview for efficiency.
 * @param missionId - The mission identifier
 * @param modelPath - Path to the GLTF/GLB model file
 */
async function loadMissionProbe(missionId: string, modelPath: string): Promise<void> {
  const mainScene = window._mainMissionScene;
  if (!mainScene || missionProbes[missionId]) return;

  // Dynamic import to avoid circular dependency
  const { ModelPreview } = await import('../ui/components/ModelPreview');
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');

  // Practical scale: 0.01 scene units (HUGE TEST SCALE ~7.5 million km)
  const PROBE_SCALE = 0.01;

  // Check cache first
  if (ModelPreview.modelCache.has(modelPath)) {
    const gltf = ModelPreview.modelCache.get(modelPath);
    const model = gltf.scene.clone();
    model.name = `probe_${missionId}`;
    model.scale.setScalar(PROBE_SCALE);

    // Make materials emissive so probe is visible in dark space
    model.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Mesh).isMesh && (node as THREE.Mesh).material) {
        const material = (node as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach((m) => {
            const stdMat = m as THREE.MeshStandardMaterial;
            if (stdMat.color) {
              stdMat.emissive = stdMat.color.clone();
              stdMat.emissiveIntensity = 0.5;
            }
          });
        } else {
          (material as THREE.MeshStandardMaterial).emissive =
            (material as THREE.MeshStandardMaterial).color?.clone() || new THREE.Color(1, 1, 1);
          (material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
        }
      }
    });

    const probeGroup = new THREE.Group();
    probeGroup.add(model);
    mainScene.add(probeGroup);
    missionProbes[missionId] = probeGroup;
    return;
  }

  // Load if not cached
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    modelPath,
    (gltf) => {
      // Cache it
      ModelPreview.modelCache.set(modelPath, gltf);

      const model = gltf.scene.clone();
      model.name = `probe_${missionId}`;
      model.scale.setScalar(PROBE_SCALE);

      // Make materials emissive
      gltf.scene.traverse((node: THREE.Object3D) => {
        if ((node as THREE.Mesh).isMesh && (node as THREE.Mesh).material) {
          const mat = (node as THREE.Mesh).material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => {
              if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhongMaterial) {
                m.emissive = m.color?.clone() || new THREE.Color(1, 1, 1);
                m.emissiveIntensity = 0.5;
              }
            });
          } else if (
            mat instanceof THREE.MeshStandardMaterial ||
            mat instanceof THREE.MeshPhongMaterial
          ) {
            mat.emissive = mat.color?.clone() || new THREE.Color(1, 1, 1);
            mat.emissiveIntensity = 0.5;
          }
        }
      });

      const probeGroup = new THREE.Group();
      probeGroup.add(model);
      mainScene.add(probeGroup);
      missionProbes[missionId] = probeGroup;
    },
    undefined,
    (error) => {
      console.warn(`Failed to load probe model for ${missionId}:`, error);
    }
  );
}

/**
 * Updates all probe model positions based on current simulation time.
 * Should be called every frame from the animation loop.
 * @param currentDate - Current simulation date
 */
export function updateMissionProbes(currentDate: Date): void {
  const mainScene = window._mainMissionScene;
  if (!mainScene || !getMissionStateFunc) return;

  const time = currentDate.getTime();

  Object.keys(missionProbes).forEach((missionId) => {
    const probe = missionProbes[missionId];
    if (!probe) return;

    // Check if mission is visible
    if (!config.showMissions[missionId as keyof typeof config.showMissions]) {
      probe.visible = false;
      return;
    }

    // Get current position from getMissionState
    if (!getMissionStateFunc) return;
    const state = getMissionStateFunc(missionId, time, 'Heliocentric');

    if (state) {
      probe.visible = true;

      // PURE SUBTRACTION - No globalOffset, no group positions
      // Probe is direct Scene child (Identity Rule)
      // Use controls.getVirtualPosition() as single source of truth for camera world position
      const controls = window.SimulationControl?.controls;
      const cameraWorldPos = controls?.getVirtualPosition?.();

      if (cameraWorldPos) {
        // Pure subtraction: probe.position = helioPos - cameraWorldPos
        probe.position.subVectors(state.position, cameraWorldPos);
      } else {
        // Fallback if controls not available - use raw heliocentric
        probe.position.copy(state.position);
      }

      // Probe is direct Scene child, standard matrix update
      // Probe is direct Scene child, standard matrix update
      probe.matrixAutoUpdate = false;
      probe.updateMatrix();

      // Ensure no culling
      probe.frustumCulled = false;

      // DEBUG: Log probe position for Voyager 1 - only when time changes
      if (missionId === 'voyager1') {
        const win = window as Window & { _lastProbeDebugTime?: number };
        const timeDelta = Math.abs((win._lastProbeDebugTime ?? 0) - time);
        if (timeDelta > 1000) {
          // Only log when time changes by more than 1 second
          win._lastProbeDebugTime = time;

          // Get ACTUAL world position through scene hierarchy
          const worldPos = new THREE.Vector3();
          probe.getWorldPosition(worldPos);

          console.log(`[V1 Probe Debug] Time: ${currentDate.toISOString()}`);
          console.log(
            `  CameraWorldPos: ${cameraWorldPos?.x.toFixed(6)}, ${cameraWorldPos?.y.toFixed(6)}, ${cameraWorldPos?.z.toFixed(6)}`
          );
          console.log(
            `  probe.position (rebased): ${probe.position.x.toFixed(6)}, ${probe.position.y.toFixed(6)}, ${probe.position.z.toFixed(6)}`
          );
          console.log(
            `  probe.getWorldPosition(): ${worldPos.x.toFixed(6)}, ${worldPos.y.toFixed(6)}, ${worldPos.z.toFixed(6)}`
          );
          // Additional visibility/model debug
          console.log(
            `  probe.visible: ${probe.visible}, probe.parent: ${probe.parent?.type || 'null'}, children: ${probe.children.length}`
          );
          console.log(
            `  probe.scale: ${probe.scale.x.toFixed(4)}, ${probe.scale.y.toFixed(4)}, ${probe.scale.z.toFixed(4)}`
          );
          console.log(`  probe.frustumCulled: ${probe.frustumCulled}`);
        }
      }

      // Special handling for Tesla Roadster: snap to the orbit line
      // The orbit line is a 360-sample polygon. We find the closest point ON the orbit segments.
      if (missionId === 'teslaRoadster') {
        const simCtrl = window.SimulationControl;
        if (simCtrl?.planets) {
          const teslaPlanet = simCtrl.planets.find(
            (p: PlanetWrapper) => p.data.name === 'Tesla Roadster'
          );
          if (teslaPlanet?.orbitLine?.geometry) {
            const geom = teslaPlanet.orbitLine.geometry;
            const posAttr = geom.getAttribute('position');

            if (posAttr && posAttr.count > 2) {
              // Get the calculated Keplerian position from the mesh (already positioned by updatePlanets)
              const meshWorldPos = new THREE.Vector3();
              teslaPlanet.mesh.getWorldPosition(meshWorldPos);

              // Transform the world position to the Orbit Line's LOCAL space
              // This handles the case where OrbitGroup is offset (e.g. in Geocentric mode)
              // while the geometry points remain in their original (Heliocentric) local space
              if (teslaPlanet.orbitLine.parent) {
                teslaPlanet.orbitLine.parent.updateMatrixWorld(true);
              }
              teslaPlanet.orbitLine.updateMatrixWorld(true);

              const searchPosLocal = meshWorldPos.clone();
              teslaPlanet.orbitLine.worldToLocal(searchPosLocal);

              // Find closest point ON the orbit line segments in Local Space
              let minDist = Infinity;
              const closestPointLocal = new THREE.Vector3();

              for (let i = 0; i < posAttr.count; i++) {
                const nextIdx = (i + 1) % posAttr.count; // Wrap for closed loop

                const p1 = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
                const p2 = new THREE.Vector3(
                  posAttr.getX(nextIdx),
                  posAttr.getY(nextIdx),
                  posAttr.getZ(nextIdx)
                );

                // Find closest point on segment p1-p2 to searchPosLocal
                const segDir = new THREE.Vector3().subVectors(p2, p1);
                const segLen = segDir.length();
                if (segLen < 1e-10) continue;
                segDir.divideScalar(segLen); // normalize

                const toProbe = new THREE.Vector3().subVectors(searchPosLocal, p1);
                let t = toProbe.dot(segDir);
                t = Math.max(0, Math.min(segLen, t)); // clamp to segment

                const pointOnSeg = p1.clone().add(segDir.multiplyScalar(t));
                const dist = searchPosLocal.distanceTo(pointOnSeg);

                if (dist < minDist) {
                  minDist = dist;
                  closestPointLocal.copy(pointOnSeg);
                }
              }

              // Transform the closest point back to World Space -> Probe Local Space
              const resultWorld = closestPointLocal.clone();
              teslaPlanet.orbitLine.localToWorld(resultWorld);

              const probeTargetPos = resultWorld.clone();
              if (probe.parent) {
                probe.parent.worldToLocal(probeTargetPos);
              }

              // Snap probe to the orbit line
              probe.position.copy(probeTargetPos);
            }
          }
        }
      }

      // Orient probe along flight direction
      if (state.direction) {
        const lookTarget = probe.position.clone().add(state.direction);
        probe.lookAt(lookTarget);
      }
    } else {
      // Before launch or after mission end
      probe.visible = false;
    }
  });
}

/**
 * Ensures probes are loaded for all visible missions.
 * Called when mission visibility changes.
 */
export function syncMissionProbes(): void {
  missionData.forEach((mission: MissionData) => {
    if (
      config.showMissions[mission.id as keyof typeof config.showMissions] &&
      !missionProbes[mission.id] &&
      mission.modelPath
    ) {
      loadMissionProbe(mission.id, mission.modelPath);
    }
  });
}

/**
 * Returns a focus-compatible object for a probe.
 * @param missionId - The mission identifier
 * @returns Focus object with mesh, data, and type, or null if not found
 */
export function getProbeForFocus(missionId: string): {
  mesh: THREE.Object3D;
  data: { id: string; name: string; radius: number };
  type: 'probe';
} | null {
  const probe = missionProbes[missionId];
  if (!probe) return null;

  const mission = missionData.find((m: MissionData) => m.id === missionId);
  if (!mission) return null;

  return {
    mesh: probe,
    data: {
      id: missionId,
      name: mission.name,
      radius: 0.01, // Matches PROBE_SCALE
    },
    type: 'probe',
  };
}

/**
 * Ensures a probe is loaded, returning a promise that resolves when ready.
 * @param missionId - The mission identifier
 * @returns True if probe is loaded successfully
 */
export async function ensureProbeLoaded(missionId: string): Promise<boolean> {
  // If already loaded
  if (missionProbes[missionId]) return true;

  const mission = missionData.find((m: MissionData) => m.id === missionId);
  if (!mission || !mission.modelPath) return false;

  // Enable and sync
  (config.showMissions as Record<string, boolean>)[missionId] = true;
  if (window.updateMissions) window.updateMissions();

  // Wait for loading (poll with timeout)
  const maxWait = 5000;
  const interval = 100;
  let waited = 0;

  while (!missionProbes[missionId] && waited < maxWait) {
    await new Promise((r) => setTimeout(r, interval));
    waited += interval;
  }

  return !!missionProbes[missionId];
}
