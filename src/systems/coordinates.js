import * as THREE from 'three';
import { config } from '../config.js';

// Relative masses (approximate, in Earth masses)
// Source: NASA Planetary Fact Sheets
const MASSES = {
  Sun: 333000,
  Mercury: 0.055,
  Venus: 0.815,
  Earth: 1,
  Mars: 0.107,
  Jupiter: 317.8,
  Saturn: 95.2,
  Uranus: 14.5,
  Neptune: 17.1,
};

/**
 * Calculates the Barycenter of the system based on current planet positions.
 * @param {Array} planets - Array of planet objects
 * @param {THREE.Mesh} sun - Sun mesh
 * @returns {THREE.Vector3} Barycenter position in scene coordinates
 */
function calculateBarycenter(planets, sun) {
  let totalMass = MASSES.Sun;
  const weightedPosition = new THREE.Vector3().copy(sun.position).multiplyScalar(MASSES.Sun);

  planets.forEach((p) => {
    const name = p.data.name;
    if (MASSES[name]) {
      const mass = MASSES[name];
      totalMass += mass;
      
      // p.mesh.position is local to universeGroup (Heliocentric-ish)
      const planetPos = p.mesh.position; 
      weightedPosition.addScaledVector(planetPos, mass);
    }
  });

  return weightedPosition.divideScalar(totalMass);
}

/**
 * Updates the position of the universeGroup to shift the coordinate system.
 * @param {THREE.Group} universeGroup - The root group containing all celestial bodies
 * @param {Array} planets - Array of planet objects
 * @param {THREE.Mesh} sun - Sun mesh
 */
export function updateCoordinateSystem(universeGroup, planets, sun) {
  const system = config.coordinateSystem;
  const targetPosition = new THREE.Vector3();

  if (system === 'Geocentric') {
    const earth = planets.find((p) => p.data.name === 'Earth');
    if (earth) {
      targetPosition.copy(earth.mesh.position);
    }
  } else if (system === 'Barycentric') {
    const barycenter = calculateBarycenter(planets, sun);
    targetPosition.copy(barycenter);
  } else {
    // Heliocentric (Default)
    // Assuming Sun is at (0,0,0) in local coordinates
    targetPosition.copy(sun.position);
  }

  // We want the Target to be at World (0,0,0).
  // universeGroup.position + (universeGroup.rotation * targetPosition) = 0
  // universeGroup.position = -(universeGroup.rotation * targetPosition)
  
  targetPosition.applyQuaternion(universeGroup.quaternion);
  universeGroup.position.copy(targetPosition).negate();
}
