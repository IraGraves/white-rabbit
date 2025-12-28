/**
 * @file index.ts
 * @description Mission trajectory calculation, waypoint interpolation, and visualization for historic space probes.
 *
 * This file serves as the main entry point for mission-related functionality.
 * The implementation is split across multiple focused modules:
 *
 * - trajectory.ts: Core trajectory calculation and path generation
 * - geometry.ts: Line2 geometry creation and initialization
 * - updates.ts: Runtime updates and coordinate system handling
 * - probes.ts: 3D probe model loading and positioning
 * - interaction.ts: User interaction (clicking on mission lines)
 * - state.ts: Shared state and position interpolation
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

// Re-export from geometry
export { initializeMissions, resizeMissionVisuals } from './geometry';
// Re-export from interaction
export { setupMissionInteraction } from './interaction';
// Re-export from probes
export {
  ensureProbeLoaded,
  getProbeForFocus,
  setMissionProbeScene,
  syncMissionProbes,
  updateMissionProbes,
} from './probes';
// Re-export from state
export { getMissionState, missionLines } from './state';
// Re-export from trajectory
export {
  createSmoothPath,
  densifyMissionPoints,
  getAbsoluteMissionWaypointPosition,
  getBodyPosition,
  getExitVector,
  getMissionPointType,
} from './trajectory';
// Re-export from updates
export { updateMissions, updateMissionTrajectories, updateMissionVisuals } from './updates';

import { setGetMissionStateFunc } from './probes';
// Initialize probe dependencies
import { getMissionState } from './state';

// Wire up the probe module with its dependencies
setGetMissionStateFunc(getMissionState);
