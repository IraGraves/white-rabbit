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
import type { MissionData } from '../types';

// Extend window interface for mission scene reference
declare global {
  interface Window {
    _mainMissionScene?: THREE.Object3D;
    updateMissions?: () => void;
  }
}

// Store probe groups by missionId
const missionProbes: Record<string, THREE.Object3D> = {};

// Reference to missionLines - will be set by missionState module
let getMissionStateFunc:
  | ((
      missionId: string,
      date: Date | number
    ) => { position: THREE.Vector3; direction: THREE.Vector3 } | null)
  | null = null;
let missionLinesRef: Record<string, THREE.Object3D> | null = null;

/**
 * Sets the getMissionState function reference (to avoid circular dependency).
 * @param fn - The getMissionState function from missionState module
 */
export function setGetMissionStateFunc(
  fn: (
    missionId: string,
    date: Date | number
  ) => { position: THREE.Vector3; direction: THREE.Vector3 } | null
): void {
  getMissionStateFunc = fn;
}

/**
 * Sets the mission lines reference for local origin access.
 * @param lines - The missionLines record
 */
export function setMissionLinesRef(lines: Record<string, THREE.Object3D>): void {
  missionLinesRef = lines;
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

  // Practical scale: 1e-6 scene units (~3 km displayed size)
  const PROBE_SCALE = 1e-6;

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
    const state = getMissionStateFunc(missionId, time);

    if (state) {
      probe.visible = true;

      // Apply LOCAL REBASE OFFSET
      // If missions are rebased, the missionGroup is shifted by 'localOrigin'.
      let localOrigin = new THREE.Vector3(0, 0, 0);
      if (missionLinesRef) {
        const line = missionLinesRef[missionId];
        if (line?.userData?.localOrigin) {
          localOrigin = line.userData.localOrigin;
        }
      }

      // Calculate relative position
      const relativePos = state.position.clone().sub(localOrigin);
      probe.position.copy(relativePos);

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
      radius: 2e-6, // Matches PROBE_SCALE (~3km visual)
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
