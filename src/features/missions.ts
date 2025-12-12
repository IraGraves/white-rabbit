/**
 * @file missions.ts
 * @description Mission trajectory calculation, waypoint interpolation, and visualization for historic space probes.
 *
 * This file dynamically calculates and renders the flight paths of 11 historic space missions using
 * real launch and encounter dates. It supports three trajectory calculation methods:
 * 1. Planetary encounters: Uses Astronomy Engine to get accurate body positions at flyby dates
 * 2. Minor body encounters: Uses custom Keplerian elements for comets/asteroids (67P, Arrokoth)
 * 3. Deep space milestones: Calculates positions along exit vectors for interstellar missions
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
 * The trajectories use Catmull-Rom spline interpolation for smooth curves between waypoints,
 * creating visually realistic arcing paths. Positions are calculated in heliocentric coordinates
 * and transformed to Three.js scene space.
 *
 * HOW IT WORKS (Methodology):
 * Unlike simple interpolation, which can cause paths to "cut through" the Sun when connecting
 * points on opposite sides of the solar system, this system uses "Trajectory Pinning":
 * 1. Precise Dating: Each waypoint has a specific date (Epoch).
 * 2. Orbital Calculation: For asteroid flybys (Gaspra, Ida, etc.), we plug the date and the
 *    asteroid's Keplerian elements (a, e, i, Omega, w, M) into Kepler's equations.
 * 3. Pinning: This gives us the EXACT 3D coordinate of the asteroid on that specific day.
 * 4. Curve Generation: The mission line is forced to pass through this exact point in space.
 *    This "pins" the trajectory to the correct location in the asteroid belt, forcing the
 *    spline to arc outward correctly around the inner solar system instead of taking a shortcut.
 *
 * References: JPL Horizons System, NASA mission archives
 */

import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';
import { AU_TO_SCENE, config, REAL_PLANET_SCALE_FACTOR } from '../config';
import { customBodies, missionData } from '../data/missions';
import { calculateKeplerianPosition } from '../physics/orbits';
import type { CustomBody, MissionWaypoint } from '../types';

function getMissionPointType(wp: MissionWaypoint): string {
  if (wp.dist && !wp.body && !wp.customBody && !wp.pos) return 'exit';
  if (!wp.body && !wp.customBody && !wp.pos && !wp.dist) return 'interpolate';
  return 'fixed';
}

/**
 * Mission trajectory data
 * Positions are dynamically calculated based on dates and celestial bodies.
 */

export function setupMissionInteraction(
  camera: THREE.Camera,
  missionGroup: THREE.Group,
  domElement: HTMLElement
): () => void {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Threshold for line selection
  raycaster.params.Line.threshold = 0.5; // Adjust based on scale (AU is huge, so this might need tuning. Wait, scene is scaled.)
  // AU_TO_SCENE is 20. So 1 AU = 20 units.
  // 0.5 units is reasonable trigger zone.

  const onClick = (event: MouseEvent) => {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const rect = domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Filter outlines (only check main mission lines)
    // Mission lines are direct children of missionGroup or wrapped?
    // initializeMissions adds lines to missionGroup.
    // They are Line objects.

    // We only want visible lines
    const visibleChildren = missionGroup.children.filter((c) => c.visible);

    const intersects = raycaster.intersectObjects(visibleChildren, false);

    if (intersects.length > 0) {
      // Get the first intersected object
      const object = intersects[0].object;
      const missionId = object.userData.id; // We need to ensure userData.id is set on the line!

      if (missionId) {
        // Trigger Selection

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
        const event = new CustomEvent('mission-selected', { detail: { missionId } });
        window.dispatchEvent(event);
      }
    }
  };

  domElement.addEventListener('click', onClick);

  // Return cleanup function
  return () => {
    domElement.removeEventListener('click', onClick);
  };
}
/**
 * Generate smooth path points from waypoints, including time interpolation.
 * @param {Array<{pos: THREE.Vector3, date: number}>} waypoints
 * @param {number} segments
 * @returns {Array<{pos: THREE.Vector3, date: number}>}
 */
function createSmoothPath(
  waypoints: Array<{ pos: THREE.Vector3; date: number }>,
  segments: number = 100
): Array<{ pos: THREE.Vector3; date: number }> {
  if (!waypoints || waypoints.length < 2) {
    return waypoints || [];
  }

  const positions = waypoints.map((wp) => wp.pos);
  // Use 'centripetal' to handle the extreme scale difference between interplanetary legs (5 AU)
  // and the dense flyby fillets (0.02 AU). Uniform 'catmullrom' causes wild loops/overshoots here.
  // Since the corners are now "baked" Bezier curves, centripetal will follow them smoothly without cutting corners.
  const curve = new THREE.CatmullRomCurve3(positions, false, 'centripetal'); 
  
  // curve.tension = 0.5; // Default

  // curve.tension = 0.5; // Default 
  
  // curve.tension = 0.5; // Default

  const points = [];
  const numWaypoints = waypoints.length;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pos = curve.getPoint(t);

    // Interpolate Date
    // Since we use Uniform parameterization, t maps linearly to waypoint indices
    const floatIndex = t * (numWaypoints - 1);
    const lowerIndex = Math.floor(floatIndex);

    // Safety check just in case
    if (lowerIndex < 0) {
      points.push({ pos, date: waypoints[0].date });
      continue;
    }

    // Ensure upperIndex does not exceed array bounds
    const upperIndex = Math.min(lowerIndex + 1, numWaypoints - 1);
    const alpha = Math.max(0, floatIndex - lowerIndex);

    const date =
      waypoints[lowerIndex].date +
      (waypoints[upperIndex].date - waypoints[lowerIndex].date) * alpha;

    points.push({ pos, date });
  }

  return points;
}

// Helper to get position of a body at a specific date
function getBodyPosition(
  bodyName: string | null,
  dateStr: string | Date,
  customElements: CustomBody | null = null
): THREE.Vector3 {
  const date = new Date(dateStr);

  if (customElements) {
    const pos = calculateKeplerianPosition(customElements, date);
    // calculateKeplerianPosition returns {x, y, z} in HELIOCENTRIC coordinates
    // where Z is North Ecliptic Pole.
    // Scene coordinates: X=x, Y=z, Z=-y
    return new THREE.Vector3(pos.x, pos.z, -pos.y);
  }

  if (!bodyName) {
    return new THREE.Vector3(0, 0, 0);
  }
  const body = Astronomy.Body[bodyName as keyof typeof Astronomy.Body];
  if (!body) {
    console.warn(`Body ${bodyName} not found in Astronomy engine`);
    return new THREE.Vector3(0, 0, 0);
  }

  const vec = Astronomy.HelioVector(body, date);
  if (!vec) {
    console.warn(`Failed to calculate vector for ${bodyName} at ${date}`);
    return new THREE.Vector3(0, 0, 0);
  }
  // Convert Astronomy engine coordinates to Scene coordinates
  // Astronomy: x=Equinox, y=90deg, z=North
  // Scene: x=x, y=z, z=-y
  return new THREE.Vector3(vec.x, vec.z, -vec.y);
}

// Helper to get exit vector for deep space missions
function getExitVector(raHours: number, decDeg: number): THREE.Vector3 {
  const raRad = raHours * 15 * (Math.PI / 180);
  const decRad = decDeg * (Math.PI / 180);

  // Spherical to Cartesian (Heliocentric)
  // x = cos(dec) * cos(ra)
  // y = cos(dec) * sin(ra)
  // z = sin(dec)
  const x = Math.cos(decRad) * Math.cos(raRad);
  const y = Math.cos(decRad) * Math.sin(raRad);
  const z = Math.sin(decRad);

  // Convert to Scene: X=x, Y=z, Z=-y
  return new THREE.Vector3(x, z, -y);
}

// Mission definitions imported from data/missions.ts

import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { createMissionLineMaterial } from '../materials/MissionLineMaterial';

const missionLines: Record<string, Line2> = {};

/**
 * Initialize mission trajectories and add them to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
export function initializeMissions(scene: THREE.Object3D): Record<string, Line2> {
  missionData.forEach((mission) => {
    // Calculate positions for all waypoints
    const calculatedWaypoints = mission.waypoints.map((wp, _index) => {
      // Use unified helper for all types (Body, Custom, Pos)
      // Note: Exit/Dist points return (0,0,0) here, handled in pass 2
      const pos = getAbsoluteMissionWaypointPosition(wp);
      const type = getMissionPointType(wp);

      return {
        pos,
        date: new Date(wp.date).getTime(),
        type,
        dist: wp.dist,
      };
    });

    // Second pass to resolve 'exit' and 'interpolate'
    const finalPoints = [];

    for (let i = 0; i < calculatedWaypoints.length; i++) {
      const wp = calculatedWaypoints[i];

      if (wp.pos) {
        finalPoints.push({ pos: wp.pos, date: wp.date });
      } else if (wp.type === 'exit') {
        // For exit points, we need the direction.
        if (mission.exit) {
          const exitVec = getExitVector(mission.exit.ra, mission.exit.dec);
          const pos = exitVec.multiplyScalar(wp.dist || 0);
          finalPoints.push({ pos, date: wp.date });
        } else {
          // Fallback when no exit vector is defined
          finalPoints.push({ pos: new THREE.Vector3(0, 0, 0), date: wp.date });
        }
      } else if (wp.type === 'interpolate') {
        // Find previous and next known points
        const prev = finalPoints[i - 1];
        let next = null;
        // Search forward for next known point
        for (let j = i + 1; j < calculatedWaypoints.length; j++) {
          if (calculatedWaypoints[j].type !== 'interpolate') {
            // Fixed: check against 'type', not 'pos'
            next = calculatedWaypoints[j];
            break;
          }
        }

        if (prev && next) {
          // Time-based interpolation
          const totalTime = next.date - prev.date;
          const elapsedTime = wp.date - prev.date;
          const alpha = elapsedTime / totalTime;

          const pos = new THREE.Vector3().lerpVectors(prev.pos, next.pos, alpha);
          finalPoints.push({ pos, date: wp.date });
        } else {
          // Fallback if interpolation fails
          finalPoints.push({ pos: new THREE.Vector3(0, 0, 0), date: wp.date });
        }
      } else {
        // It's a point we calculated in pass 1 (orbit, body, or exit)
        finalPoints.push({ pos: wp.pos, date: wp.date });
      }
    }

    // Densify points near planets (Fillet corners)
    const densifiedPoints = densifyMissionPoints(finalPoints, mission.waypoints);

    // Regenerate geometry
    let smoothPoints;
    try {
      // Higher resolution (12k) for detailed flybys, but not 200k (too heavy).
      smoothPoints = createSmoothPath(densifiedPoints, 12000);
    } catch (e) {
      console.warn(`Failed to create path for mission ${mission.id}:`, e);
      return; // Skip this mission
    }

    if (!smoothPoints || smoothPoints.length < 2) {
      // Not enough points to make a line
      return;
    }

    // Filter degenerate points (too close to each other) to prevent Line2 shader artifacts
    // This fixes the "wild jitter" at the start point when zooming in.
    const filteredPoints = [smoothPoints[0]];
    for (let i = 1; i < smoothPoints.length; i++) {
        const last = filteredPoints[filteredPoints.length - 1];
        const current = smoothPoints[i];
        
        // Threshold: 1e-4 scene units squared (distances < 0.01)
        // Previous 1e-12 was too small to prevent miter artifacts.
        // 0.01 scene units ~ 75000km, which is fine for trajectory resolution (we have many points)
        // Let's try 1e-6 (dist < 0.001 units = 7500km)
        if (last.pos.distanceToSquared(current.pos) > 1e-6) {
            filteredPoints.push(current);
        }
    }

    // Ensure we still have a path
    if (filteredPoints.length < 2) return;
    
    // Use filtered points for geometry
    smoothPoints = filteredPoints;

    // --- Line2 Implementation ---

    const geometry = new LineGeometry();

    // Convert points to flat array for LineGeometry
    const positions: number[] = [];
    smoothPoints.forEach((p) => {
      const scaled = p.pos.clone().multiplyScalar(AU_TO_SCENE);
      positions.push(scaled.x, scaled.y, scaled.z);
    });

    geometry.setPositions(positions);

    const material = createMissionLineMaterial({
      color: mission.color ?? 0xffffff,
      linewidth: 3, // Thicker line as requested (starts at 2x)
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    });

    const line = new Line2(geometry, material);

    // Initial Distance Calculation necessary for dashed lines
    line.computeLineDistances();

    // Store metadata
    const startTime = smoothPoints[0].date;
    const endTime = smoothPoints[smoothPoints.length - 1].date;
    const duration = endTime - startTime;

    line.userData.id = mission.id;
    line.userData.startTime = startTime;
    line.userData.duration = duration;
    line.visible = config.showMissions[mission.id as keyof typeof config.showMissions];

    // Debug Metadata for Three.js DevTools
    line.name = `Trajectory: ${mission.name}`;
    line.userData.missionName = mission.name;
    line.userData.pointCount = smoothPoints.length;
    line.userData.dateRange = `${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()}`;


    // Store original high-precision points for rebasing
    line.userData.originalPoints = smoothPoints.map((p) =>
      p.pos.clone().multiplyScalar(AU_TO_SCENE)
    );
    // Store full trajectory data with dates for precise probe positioning
    line.userData.trajectoryData = smoothPoints.map((p) => ({
      pos: p.pos.clone().multiplyScalar(AU_TO_SCENE),
      date: p.date,
    }));

    // Initial local origin
    line.userData.localOrigin = new THREE.Vector3(0, 0, 0);

    scene.add(line);
    missionLines[mission.id] = line;
  });

  return missionLines;
}

/**
 * Update mission visibility based on config
 */
export function updateMissions(): void {
  Object.keys(missionLines).forEach((id) => {
    const key = id as keyof typeof config.showMissions;
    if (missionLines[id]) {
      missionLines[id].visible = config.showMissions[key];
    }
  });
}

let lastCoordinateSystem: string | null = null;

/**
 * Updates mission trajectories when the coordinate system changes.
 * Recalculates all waypoints relative to the new center (e.g., Earth for Geocentric).
 * @param {THREE.Scene} scene - The scene (unused, but kept for consistency)
 * @param {boolean} forceUpdate - If true, recalculate even if system hasn't changed (e.g. for planet scale).
 */
export function updateMissionTrajectories(_scene: THREE.Scene, forceUpdate: boolean = false): void {
  const currentSystem = config.coordinateSystem;

  // Only update if the coordinate system has changed OR forced
  if (lastCoordinateSystem === currentSystem && !forceUpdate) {
    return;
  }

  lastCoordinateSystem = currentSystem;

  missionData.forEach((mission) => {
    const line = missionLines[mission.id];
    if (!line) return;

    // Recalculate positions for all waypoints with coordinate system correction
    const calculatedWaypoints = mission.waypoints.map((wp, _index) => {
      let pos = new THREE.Vector3();
      const time = new Date(wp.date);

      // 1. Calculate base Heliocentric position (with Offsets)
      pos = getAbsoluteMissionWaypointPosition(wp);

      // Handle Exit Points specially (since helper returns 0 for pure dist)
      if (wp.dist && mission.exit && !wp.body && !wp.customBody && !wp.pos) {
        const exitVec = getExitVector(mission.exit.ra, mission.exit.dec);
        pos = exitVec.multiplyScalar(wp.dist);
        // Apply offset if exists
        if (wp.offset) {
          const scale = 1;
          const offsetVec = new THREE.Vector3(wp.offset.x || 0, wp.offset.y || 0, wp.offset.z || 0);
          pos.add(offsetVec.multiplyScalar(scale));
        }
      }

      // 2. Apply Coordinate System Correction
      // If Geocentric/Tychonic, subtract Earth's position at that time
      // If Barycentric, subtract SSB position at that time
      const correction = new THREE.Vector3(0, 0, 0);

      if (currentSystem === 'Geocentric' || currentSystem === 'Tychonic') {
        const earthPos = getBodyPosition('Earth', wp.date);
        correction.copy(earthPos);
      } else if (currentSystem === 'Barycentric') {
        const ssb = Astronomy.HelioVector(Astronomy.Body.SSB, time);
        // Convert to Scene: x=x, y=z, z=-y
        correction.set(ssb.x, ssb.z, -ssb.y);
      }

      pos.sub(correction);

      return {
        pos,
        date: time.getTime(),
        type: getMissionPointType(wp),
        dist: wp.dist,
      };
    });

    // Second pass to resolve 'exit' and 'interpolate' with CORRECTED positions
    const finalPoints = [];

    for (let i = 0; i < calculatedWaypoints.length; i++) {
      const wp = calculatedWaypoints[i];

      if (wp.type === 'interpolate') {
        // Find previous and next known points (which are already corrected!)
        const prev = finalPoints[i - 1];
        let next = null;
        // Search forward for next known point
        for (let j = i + 1; j < calculatedWaypoints.length; j++) {
          if (calculatedWaypoints[j].type !== 'interpolate') {
            next = calculatedWaypoints[j];
            break;
          }
        }

        if (prev && next) {
          const totalTime = next.date - prev.date;
          const elapsedTime = wp.date - prev.date;
          const alpha = elapsedTime / totalTime;
          const pos = new THREE.Vector3().lerpVectors(prev.pos, next.pos, alpha);
          finalPoints.push({ pos, date: wp.date });
        } else {
          finalPoints.push({ pos: new THREE.Vector3(0, 0, 0), date: wp.date });
        }
      } else {
        // It's a point we calculated in pass 1 (orbit, body, or exit)
        finalPoints.push({ pos: wp.pos, date: wp.date });
      }
    }

    // Densify points near planets (Fillet corners)
    const densifiedPoints = densifyMissionPoints(finalPoints, mission.waypoints);

    // Regenerate geometry
    let smoothPoints;
    try {
      // use 12000 segments for update
      smoothPoints = createSmoothPath(densifiedPoints, 12000);
    } catch (e) {
      console.warn(`Failed to update path for mission ${mission.id}:`, e);
      return;
    }

    if (!smoothPoints || smoothPoints.length < 2) {
      return;
    }

    // Filter degenerate points to prevent Line2 artifact (same as init)
    const filteredPoints = [smoothPoints[0]];
    for (let i = 1; i < smoothPoints.length; i++) {
        const last = filteredPoints[filteredPoints.length - 1];
        const current = smoothPoints[i];
        if (last.pos.distanceToSquared(current.pos) > 1e-6) {
            filteredPoints.push(current);
        }
    }
    if (filteredPoints.length < 2) return;
    smoothPoints = filteredPoints;

    // --- Update Line2 Geometry ---
    const geometry = line.geometry;

    // LineGeometry setPositions expects flat array
    const positions: number[] = [];
    smoothPoints.forEach((p) => {
      const scaled = p.pos.clone().multiplyScalar(AU_TO_SCENE);
      positions.push(scaled.x, scaled.y, scaled.z);
    });

    geometry.setPositions(positions);

    // IMPORTANT: Recompute distances for dashing
    line.computeLineDistances();

    // Update original high-precision points for rebasing
    line.userData.originalPoints = smoothPoints.map((p) =>
      p.pos.clone().multiplyScalar(AU_TO_SCENE)
    );

    // Store full trajectory data with dates for precise probe positioning
    line.userData.trajectoryData = smoothPoints.map((p) => ({
      pos: p.pos.clone().multiplyScalar(AU_TO_SCENE),
      date: p.date,
    }));

    geometry.computeBoundingSphere();

    // Reset local origin as the points are fresh absolute positions (rebase will kick in next frame)
    line.userData.localOrigin.set(0, 0, 0);
    line.position.set(0, 0, 0); // Reset position offset
    line.userData.totalLength = null; // Force recalc of length
  });
}

/**
 * Updates visual uniforms for mission lines based on current simulation time.
 * Also handles continuous centering (Local Rebase) to prevent floating point jitter.
 * Should be called every frame.
 * @param {number} currentSimTime - Time in ms
 */
export function updateMissionVisuals(currentSimTime: number): void {
  try {
    const lines = Object.values(missionLines);
    if (lines.length === 0) return;

    // Update screen resolution for all lines (needed for LineMaterial)
    // We should only do this on resize, but checking here is safe enough if costly
    // Use a shared vector to avoid alloc?
    // Actually, renderer is not passed here.
    // We can assume standard window size or pass it.
    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

    // --- Continuous Centering (Local Rebase) ---
    // We check if the camera (inverse universe position) has moved far enough from the
    // last used "Local Origin" for the mesh vertices.
    // If so, we shift the mesh vertices to be relative to the new camera position,
    // and move the mesh container to compensate.

    // 1. Get Virtual Camera Position
    // The mission lines are in missionGroup -> universeGroup.
    // universeGroup is moved by controls to be at -virtualCameraPos.
    // So virtualCameraPos = -universeGroup.position.
    const missionGroup = (lines[0] as any).parent;
    if (!missionGroup || !missionGroup.parent) return; // Should be universeGroup

    const universeGroup = missionGroup.parent;
    const virtualCameraPos = universeGroup.position.clone().negate();

    // 2. Continuous Rebase (Threshold-based)
    // We only rebase when the camera moves significantly, to avoid expensive geometry updates.
    // We check distance from the CURRENT missionGroup position to the new camera position.

    // Check for rebase.
    // Threshold set to 100.0 to avoid constant updates while keeping coordinates manageable.
    if (missionGroup.position.distanceTo(virtualCameraPos) > 100.0) {
      // Move missionGroup to the new origin
      missionGroup.position.copy(virtualCameraPos);
      
      // Increment Rebase Counter (init if needed)
      if (missionGroup.userData.rebaseCount === undefined) missionGroup.userData.rebaseCount = 0;
      missionGroup.userData.rebaseCount++;

      // Rebase all lines to be relative to this new origin
      lines.forEach((line) => {
        // Safeguard: Ensure originalPoints exist
        if (!line.userData.originalPoints) return;

        const positions: number[] = [];
        const originalPoints = line.userData.originalPoints;

        originalPoints.forEach((p: any) => {
          // Vertex = Absolute - NewOrigin (which is now MissionGroup Position)
          positions.push(
            p.x - virtualCameraPos.x,
            p.y - virtualCameraPos.y,
            p.z - virtualCameraPos.z
          );
        });

        line.geometry.setPositions(positions);
        line.computeLineDistances();
        // Keep bounding sphere update just in case, it's good practice during rebase
        line.geometry.computeBoundingSphere();
        
        // Update tracker if we still use it
        if (line.userData.localOrigin) {
          line.userData.localOrigin.copy(virtualCameraPos);
        }
      });
    }



    // Material Resolution & Uniforms Update (Must run every frame)
    lines.forEach((line) => {
      const mat = line.material as LineMaterial;
      // Material Resolution Update
      if (mat.resolution) {
        mat.resolution.copy(resolution);
      }

      if (!line.visible) return;

      const startTime = line.userData.startTime;
      const duration = line.userData.duration;

      if (!line.userData.totalLength) {
        // Calculate once
        let dist = 0;
        const pts = line.userData.originalPoints;
        // Approximate
        for (let i = 1; i < pts.length; i++) {
          dist += pts[i].distanceTo(pts[i - 1]);
        }
        line.userData.totalLength = dist;

        // Update material once
        if (mat.uniforms.uTotalLength) {
          mat.uniforms.uTotalLength.value = dist;
        }
      }

      if (startTime !== undefined && duration > 0) {
        let relativeTime;
        if (duration > 0) {
          // progress 0..1
          relativeTime = (currentSimTime - startTime) / duration;
        } else {
          relativeTime = 1.0;
        }

        // Clamp 0..1 - Actually let it go beyond 0..1 if we want to show everything or hide everything
        relativeTime = Math.max(0, Math.min(1, relativeTime));

        if (mat.uniforms?.uCurrentTime) {
          mat.uniforms.uCurrentTime.value = relativeTime;
        }
      }
    });
  } catch (e) {
    // Suppress spammy visual update errors
    if (!(window as any)._suppressMissionErrors) {
      console.warn('Mission update error:', e);
      (window as any)._suppressMissionErrors = true;
    }
  }
}

/**
 * Gets the interpolated position and flight direction of a mission at a specific date.
 * @param {string} missionId
 * @param {Date | number} date
 * @returns {{ position: THREE.Vector3, direction: THREE.Vector3 } | null}
 */
// Unified helper to get absolute position of a waypoint (Heliocentric)
// Applies dynamic scaling to offsets based on planet scale to prevent clipping
function getAbsoluteMissionWaypointPosition(wp: MissionWaypoint): THREE.Vector3 {
  let pos = new THREE.Vector3(0, 0, 0);

  // 1. Base Position
  if (wp.body) {
    pos = getBodyPosition(wp.body, wp.date);
  } else if (wp.customBody && customBodies[wp.customBody]) {
    pos = getBodyPosition(null, wp.date, customBodies[wp.customBody]);
  } else if (wp.pos) {
    pos = wp.pos.clone();
  } else if (wp.dist) {
    // Dist is handled by context (exit vector) usually, but return 0 here
    return new THREE.Vector3(0, 0, 0);
  }

  // 2. Apply Offset (Scale-Aware)
  if (wp.offset) {
    // If it's a body-relative waypoint, scale the offset with the planet
    // so the trajectory doesn't end up inside the expanded planet.
    // config.planetScale is 0..1 (UI Slider). Visual size is Scale * FACTOR.
    // We default scale to 1 if not body-relative (shouldn't happen for these offsets).

    let scale = 1;
    if (wp.body || wp.customBody) {
      // Use the same logic as planets.ts mesh scaling:
      // scale = config.planetScale * REAL_PLANET_SCALE_FACTOR
      // But if config.planetScale is near 0 (Real Scale), use 1.

      // Scale factor based on planet scale config (minimum 1x to prevent invisibility)
      const factor = Math.max(1, config.planetScale * REAL_PLANET_SCALE_FACTOR);
      scale = factor;
    }

    // Check if offset is x,y,z object or Vector3
    const offsetVec = new THREE.Vector3(wp.offset.x || 0, wp.offset.y || 0, wp.offset.z || 0);

    pos.add(offsetVec.multiplyScalar(scale));
  } else if (wp.lat !== undefined && wp.lon !== undefined && wp.body) {
    // Dynamic Geolocation Offset
    // Calculates the position of a specific Lat/Lon on the rotating body surface/orbit

    // Scale factor
    const factor = Math.max(1, config.planetScale * REAL_PLANET_SCALE_FACTOR);

    // 1. Get Sidereal Time (Greenwich Apparent Sidereal Time)
    const date = new Date(wp.date);
    const gst = Astronomy.SiderealTime(date); // in hours

    // 2. Convert Lon to RA (RA = GST + Lon)
    // Lon is degrees (-180 to 180), RA is hours (0 to 24)
    // 15 degrees = 1 hour
    const lonHours = wp.lon / 15.0;
    const raLocal = (gst + lonHours + 24) % 24; // Normalized RA in hours
    const decLocal = wp.lat; // Dec = Lat

    // 3. Convert RA/Dec to Cartesian (Equatorial J2000 direction)
    // Note: This assumes Body's axis is aligned with J2000 Z (Earth approx)
    // For other bodies, we might need more complex rotation, but this is mainly for Earth launch.

    const raRad = (raLocal * 15 * Math.PI) / 180;
    const decRad = (decLocal * Math.PI) / 180;

    const x = Math.cos(decRad) * Math.cos(raRad);
    const y = Math.cos(decRad) * Math.sin(raRad);
    const z = Math.sin(decRad);

    // 4. Scale by Altitude (Radius + Alt)
    // Earth Radius ~ 0.0000426 AU
    // Launch Alt ~ 0.000002 AU (LEO)
    // Total ~ 0.000045 AU
    const radiusAU = 0.000045;

    // const _offsetVec = new THREE.Vector3(x, y, z).multiplyScalar(radiusAU * factor);

    // Astronomy engine uses x=Equinox, z=North.
    // Three.js scene (usually): x=Equinox, y=North (if Y-up) or z=North (if Z-up)?
    // The project seems to use Y-up (Standard Three.js), where Y is Ecliptic North?
    // Let's check getBodyPosition.
    // Astronomy.HelioVector returns x,y,z.
    // Usually converted: x->x, y->z, z->-y (or similar) in the scene.
    // In updateMissionTrajectories: correction.set(ssb.x, ssb.z, -ssb.y);
    // So Astronomy(x,y,z) -> Scene(x, z, -y)?
    // Let's verify coordinate mapping.

    // Astronomy Engine Coords:
    // x: Vernal Equinox
    // y: 90 deg East in Equator
    // z: North Pole

    // App conversion (from earlier in this file):
    // scene.x = astro.x
    // scene.y = astro.z  (North is Up)
    // scene.z = -astro.y (Y is -Z depth)

    const sceneOffset = new THREE.Vector3(x, z, -y).multiplyScalar(radiusAU * factor);

    pos.add(sceneOffset);
  }

  return pos;
}

/**
 * Gets the interpolated position and flight direction of a mission at a specific date.
 * Uses piecewise linear interpolation between waypoints to ensure temporal accuracy,
 * especially at flyby dates.
 * @param {string} missionId
 * @param {Date | number} date
 * @returns {{ position: THREE.Vector3, direction: THREE.Vector3 } | null}
 */
export function getMissionState(
  missionId: string,
  date: Date | number | string
): { position: THREE.Vector3; direction: THREE.Vector3 } | null {
  // 1. Get Mission Data
  const mission = missionData.find((m) => m.id === missionId);
  if (!mission) return null;

  const time = typeof date === 'string' || date instanceof Date ? new Date(date).getTime() : date;

  // 2. Try to use High-Precision Trajectory Data (Visual Match)
  // This uses the cached smooth curve points, ensuring the probe aligns perfectly with the line.
  const line = missionLines[missionId];
  if (line?.userData?.trajectoryData && line.userData.trajectoryData.length > 1) {
    const data = line.userData.trajectoryData;
    // Optimization: Check boundaries
    if (time >= data[0].date && time <= data[data.length - 1].date) {
      // Find segment in dense array
      // Linear search is O(N) but N ~ 1000, fast enough for 10 probes.
      // Can be optimized to Binary Search if needed.
      let idx = -1;
      const len = data.length;
      for (let i = 0; i < len - 1; i++) {
        if (time >= data[i].date && time <= data[i + 1].date) {
          idx = i;
          break;
        }
      }

      if (idx !== -1) {
        const p1 = data[idx];
        const p2 = data[idx + 1];
        const duration = p2.date - p1.date;
        const alpha = duration > 0 ? (time - p1.date) / duration : 0;

        // p1.pos and p2.pos are already SCALED (AU_TO_SCENE) and in Absolute Scene coords.
        const position = new THREE.Vector3().lerpVectors(p1.pos, p2.pos, alpha);
        const direction = new THREE.Vector3().subVectors(p2.pos, p1.pos).normalize();
        return { position, direction };
      }
    }
  }

  // 3. Fallback: Parse Waypoints (Original Logic)
  // Used if visual line is not generated or date is out of range of the visual line (early/late?)
  if (!mission.waypoints || mission.waypoints.length < 2) return null;

  // Find Segment
  let segmentIndex = -1;
  const waypoints = mission.waypoints;
  const wpTimes = waypoints.map((wp) => new Date(wp.date).getTime());

  if (time < wpTimes[0]) return null; // Before launch
  if (time > wpTimes[wpTimes.length - 1]) return null; // After end

  for (let i = 0; i < wpTimes.length - 1; i++) {
    if (time >= wpTimes[i] && time <= wpTimes[i + 1]) {
      segmentIndex = i;
      break;
    }
  }

  if (segmentIndex === -1) return null;

  const tStart = wpTimes[segmentIndex];
  const tEnd = wpTimes[segmentIndex + 1];
  const duration = tEnd - tStart;
  const alpha = duration > 0 ? (time - tStart) / duration : 0;

  // Calculate Positions
  const currentSystem = config.coordinateSystem;

  const getCorrectedPos = (wpIndex: number) => {
    const wp = waypoints[wpIndex];
    let pos = getAbsoluteMissionWaypointPosition(wp);

    if (wp.dist && mission.exit) {
      const exitVec = getExitVector(mission.exit.ra, mission.exit.dec);
      pos = exitVec.multiplyScalar(wp.dist);
      if (wp.offset) {
        const scale = 1;
        const offsetVec = new THREE.Vector3(wp.offset.x || 0, wp.offset.y || 0, wp.offset.z || 0);
        pos.add(offsetVec.multiplyScalar(scale));
      }
    }

    const correction = new THREE.Vector3(0, 0, 0);
    if (currentSystem === 'Geocentric' || currentSystem === 'Tychonic') {
      const earthPos = getBodyPosition('Earth', wp.date);
      correction.copy(earthPos);
    } else if (currentSystem === 'Barycentric') {
      const ssb = Astronomy.HelioVector(Astronomy.Body.SSB, new Date(wp.date));
      correction.set(ssb.x, ssb.z, -ssb.y);
    }

    pos.sub(correction);
    return pos;
  };

  const p1 = getCorrectedPos(segmentIndex);
  const p2 = getCorrectedPos(segmentIndex + 1);

  const position = new THREE.Vector3().lerpVectors(p1, p2, alpha);
  const direction = new THREE.Vector3().subVectors(p2, p1).normalize();

  position.multiplyScalar(AU_TO_SCENE);

  return { position, direction };
}

// ============================================================================
// MISSION PROBE MODELS
// ============================================================================

const missionProbes: Record<string, THREE.Object3D> = {}; // Store probe groups by missionId

/**
 * Sets the scene reference for probe models.
 * @param {THREE.Scene} scene
 */
export function setMissionProbeScene(scene: THREE.Object3D) {
  // Store reference to main scene for adding probe groups
  (window as any)._mainMissionScene = scene;
}

/**
 * Loads a probe model for a mission (from cache or via GLTFLoader).
 * Uses the same cache as ModelPreview for efficiency.
 * @param {string} missionId
 * @param {string} modelPath
 */
async function loadMissionProbe(missionId: string, modelPath: string) {
  const mainScene = (window as any)._mainMissionScene;
  if (!mainScene || missionProbes[missionId]) return;

  // Dynamic import to avoid circular dependency
  const { ModelPreview } = await import('../ui/components/ModelPreview');
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');

  // Practical scale: 1e-6 scene units (~3 km displayed size)
  // This is a compromise between realism (5m) and visibility/precision
  const PROBE_SCALE = 1e-6;

  // Check cache first
  if (ModelPreview.modelCache.has(modelPath)) {
    const gltf = ModelPreview.modelCache.get(modelPath);
    const model = gltf.scene.clone();
    model.name = `probe_${missionId}`;
    model.scale.setScalar(PROBE_SCALE);

    // Make materials emissive
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

    // Create a group for the mission probe and add the model to it
    const probeGroup = new THREE.Group();
    probeGroup.add(model);
    mainScene.add(probeGroup);
    missionProbes[missionId] = probeGroup; // Store the group
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

      // Scale: 1e-4 (~750 km displayed)
      // Scale: 1e-6 (~3 km displayed)
      model.scale.setScalar(PROBE_SCALE);

      // Make materials emissive so probe is self-lit (visible in dark space)
      gltf.scene.traverse((node: THREE.Object3D) => {
        if ((node as THREE.Mesh).isMesh && (node as THREE.Mesh).material) {
          // Check if material is standard material to access emissive properties
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

      // Create a group for the mission probe and add the model to it
      const probeGroup = new THREE.Group();
      probeGroup.add(model);
      mainScene.add(probeGroup);
      missionProbes[missionId] = probeGroup; // Store the group
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
 * @param {Date} currentDate
 */
export function updateMissionProbes(currentDate: Date) {
  const mainScene = (window as any)._mainMissionScene;
  if (!mainScene) return;

  const time = currentDate.getTime();

  Object.keys(missionProbes).forEach((missionId) => {
    const probe = missionProbes[missionId];
    if (!probe) return;

    // Check if mission is visible
    if (!config.showMissions[missionId as keyof typeof config.showMissions]) {
      if (missionProbes[missionId]) {
        // Use missionProbes as it now stores the group
        missionProbes[missionId].visible = false;
      }
      return;
    }

    // Get current position from getMissionState
    const state = getMissionState(missionId, time);

    if (state) {
      probe.visible = true;

      // Apply LOCAL REBASE OFFSET
      // If missions are rebased, the missionGroup is shifted by 'localOrigin'.
      // The probe is a child of missionGroup, so its local position must be relative to that origin.
      // Pos = Absolute - localOrigin.

      // Find the associated line to get the shared tracker
      const line = missionLines[missionId];
      let localOrigin = new THREE.Vector3(0, 0, 0);
      if (line?.userData?.localOrigin) {
        localOrigin = line.userData.localOrigin;
      }

      // Calculate relative position
      // Reverting to use localOrigin (snapshot) to ensure Probe stays attached to Line (snapshot)
      // They must share the same reference frame.
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
export function syncMissionProbes() {
  missionData.forEach((mission) => {
    if (config.showMissions[mission.id] && !missionProbes[mission.id] && mission.modelPath) {
      loadMissionProbe(mission.id, mission.modelPath);
    }
  });
}

/**
 * Returns a focus-compatible object for a probe.
 * @param {string} missionId
 * @returns {Object|null} { mesh, data: { name, radius }, type: 'probe' } or null
 */
export function getProbeForFocus(missionId: string) {
  const probe = missionProbes[missionId];
  if (!probe) return null;

  const mission = missionData.find((m) => m.id === missionId);
  if (!mission) return null;

  return {
    mesh: probe,
    data: {
      name: mission.name,
      radius: 2e-6, // Matches new PROBE_SCALE roughly (3km visual)
    },
    type: 'probe',
  };
}

/**
 * Ensures a probe is loaded, returning a promise that resolves when ready.
 * @param {string} missionId
 * @returns {Promise<boolean>} True if probe is loaded
 */
export async function ensureProbeLoaded(missionId: string) {
  // If already loaded
  if (missionProbes[missionId]) return true;

  const mission = missionData.find((m) => m.id === missionId);
  if (!mission || !mission.modelPath) return false;

  // Enable and sync
  config.showMissions[missionId] = true;
  if ((window as any).updateMissions) (window as any).updateMissions();

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

(window as any).updateMissions = updateMissions;

/**
 * Densifies mission points by adding approach/departure helpers at flybys.
 * This fixes "sharp corner" artifacts by forcing the spline to curve around planets.
 */
function densifyMissionPoints(
  points: { pos: THREE.Vector3; date: number }[],
  waypoints: any[] // MissionWaypoint[]
): { pos: THREE.Vector3; date: number }[] {
  const densified: { pos: THREE.Vector3; date: number }[] = [];
  const AU_TO_SCENE = 50;
  // Reverted to 0.2 AU as requested.
  const FILLET_DIST = 0.2 * AU_TO_SCENE;

  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const wp = waypoints[i];

    // Check if this is a Planetary Flyby (has 'body' and neighbors)
    // We don't fillet Earth (Launch) or Endpoints, only middle flybys.
    if (wp.body && i > 0 && i < points.length - 1) {
      const prev = points[i - 1];
      const next = points[i + 1];

      // 1. Approach Point
      const vecIn = new THREE.Vector3().subVectors(curr.pos, prev.pos);
      const distIn = vecIn.length();
      // Place helper 10% out, or max 0.2 AU
      const offsetIn = Math.min(distIn * 0.1, FILLET_DIST);
      const appPos = curr.pos.clone().sub(vecIn.normalize().multiplyScalar(offsetIn));
      
      // Interpolate Date
      const appAlpha = offsetIn / distIn;
      const appDate = curr.date - (curr.date - prev.date) * appAlpha;

      // 2. Departure Point (Calculate upfront)
      const vecOut = new THREE.Vector3().subVectors(next.pos, curr.pos);
      const distOut = vecOut.length();
      const offsetOut = Math.min(distOut * 0.1, FILLET_DIST);
      const depPos = curr.pos.clone().add(vecOut.normalize().multiplyScalar(offsetOut));
      
      const depAlpha = offsetOut / distOut;
      const depDate = curr.date + (next.date - curr.date) * depAlpha;

      // 3. Generate Bezier Curve points (Quadratic Bezier)
      // Control points: P0=appPos, P1=curr.pos, P2=depPos
      const NUM_SUB_STEPS = 8;
      for (let k = 0; k <= NUM_SUB_STEPS; k++) {
        const t = k / NUM_SUB_STEPS;
        
        // Quadratic Bezier Formula: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const p0 = appPos;
        const p1 = curr.pos;
        const p2 = depPos;

        const pos = new THREE.Vector3()
          .copy(p0).multiplyScalar((1 - t) * (1 - t))
          .add(p1.clone().multiplyScalar(2 * (1 - t) * t))
          .add(p2.clone().multiplyScalar(t * t));

        // Linearly interpolate date between appDate and depDate
        const date = appDate + (depDate - appDate) * t;

        densified.push({ pos, date });
      }

    } else {
      // Pass through normal point
      densified.push(curr);
    }
  }

  return densified;
}
