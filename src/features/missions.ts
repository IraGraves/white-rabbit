/**
 * @file missions.ts
 * @description Mission trajectory calculation, waypoint interpolation, and visualization for historic space probes.
 *
 * This file serves as the main entry point for mission-related functionality.
 * The implementation is split across multiple focused modules:
 *
 * - missionTrajectory.ts: Core trajectory calculation and path generation
 * - missionGeometry.ts: Line2 geometry creation and initialization
 * - missionUpdates.ts: Runtime updates and coordinate system handling
 * - missionProbes.ts: 3D probe model loading and positioning
 * - missionInteraction.ts: User interaction (clicking on mission lines)
 * - missionState.ts: Shared state and position interpolation
 * - missionScaling.ts: Planet-scale-aware trajectory corrections
 *
 * Supported missions:
 * - Voyager 1 & 2: Grand Tour of outer planets, now in interstellar space
 * - Pioneer 10 & 11: First to Jupiter/Saturn, now silent in deep space
 * - Galileo: Venus-Earth-Earth-Gaspra-Earth-Ida-Jupiter tour with orbital insertion
 * - Cassini: Venus-Venus-Earth-Jupiter-Saturn with 13-year Saturn orbit
 * - New Horizons: Jupiter-Pluto-Arrokoth flyby sequence
 * - Parker Solar Probe: Multiple Venus flybys and close solar approaches
 * - Juno: Earth-Earth-Jupiter with extended mission including moon flybys
 * - Rosetta: Complex tour to comet 67P with Steins/Lutetia encounters
 * - Ulysses: Jupiter gravity assist for solar polar orbit
 *
 * References: JPL Horizons System, NASA mission archives
 */

// Re-export from missionTrajectory
export {
  createSmoothPath,
  densifyMissionPoints,
  getAbsoluteMissionWaypointPosition,
  getBodyPosition,
  getExitVector,
  getMissionPointType,
} from './missionTrajectory';

// Re-export from missionGeometry
export { initializeMissions, resizeMissionVisuals } from './missionGeometry';

// Re-export from missionUpdates
export { updateMissions, updateMissionTrajectories, updateMissionVisuals } from './missionUpdates';

// Re-export from missionProbes
export {
  ensureProbeLoaded,
  getProbeForFocus,
  setMissionProbeScene,
  syncMissionProbes,
  updateMissionProbes,
} from './missionProbes';

// Re-export from missionInteraction
export { setupMissionInteraction } from './missionInteraction';

// Re-export from missionState
export { getMissionState, missionLines } from './missionState';

// Re-export from missionScaling (for external use)
export {
  getScaledPoint,
  type ScalingStatus,
} from './missionScaling';

// Initialize probe dependencies
import { getMissionState, missionLines } from './missionState';
import { setGetMissionStateFunc, setMissionLinesRef } from './missionProbes';

// Wire up the probe module with its dependencies
setGetMissionStateFunc(getMissionState);
setMissionLinesRef(missionLines);
