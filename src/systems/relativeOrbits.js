import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';
import { AU_TO_SCENE, config } from '../config.js';
import { calculateKeplerianPosition } from '../physics/orbits.js';

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

// Cache for geometries to avoid reallocation
const orbitGeometries = new Map();

function getHeliocentricPosition(data, time) {
  if (data.body) {
    const vec = Astronomy.HelioVector(Astronomy.Body[data.body], time);
    return new THREE.Vector3(vec.x, vec.y, vec.z);
  } else if (data.elements) {
    const vec = calculateKeplerianPosition(data.elements, time);
    return new THREE.Vector3(vec.x, vec.y, vec.z);
  }
  return new THREE.Vector3(0, 0, 0);
}

function getBarycenterPosition(allBodies, time) {
  let totalMass = MASSES.Sun;
  const weightedPos = new THREE.Vector3(0, 0, 0);

  allBodies.forEach(data => {
    if (MASSES[data.name]) {
      const mass = MASSES[data.name];
      totalMass += mass;
      const pos = getHeliocentricPosition(data, time);
      weightedPos.add(pos.multiplyScalar(mass));
    }
  });

  return weightedPos.divideScalar(totalMass);
}

/**
 * Updates relative orbits dynamically.
 * Should be called every frame if in Geocentric/Barycentric mode.
 */
export function updateRelativeOrbits(orbitGroup, relativeOrbitGroup, planets, sun) {
  const system = config.coordinateSystem;

  // 1. Handle Visibility
  if (system === 'Heliocentric') {
    orbitGroup.visible = config.showOrbits;
    relativeOrbitGroup.visible = false;
    return;
  }

  orbitGroup.visible = false;
  relativeOrbitGroup.visible = config.showOrbits;
  
  // Sync rotation with universeGroup (e.g. for Ecliptic plane)
  if (sun && sun.parent) {
     relativeOrbitGroup.quaternion.copy(sun.parent.quaternion);
  }

  if (!config.showOrbits) return;

  const allBodiesData = planets.map(p => p.data);
  const bodiesToTrace = [...planets];
  if (system === 'Geocentric') {
    bodiesToTrace.push({ data: { name: 'Sun', body: 'Sun', color: 0xffff00, period: 365.25 } });
  }

  // 3. Update Lines
  bodiesToTrace.forEach(bodyObj => {
    const data = bodyObj.data;
    
    // Check Visibility Settings
    let isVisible = true;
    if (data.type === 'dwarf') {
      isVisible = config.showDwarfPlanets;
    } else if (data.name !== 'Sun') {
      isVisible = config.showPlanets;
    }

    // Hide Earth trail in Geocentric
    if (system === 'Geocentric' && data.name === 'Earth') {
      isVisible = false;
    }

    let line = relativeOrbitGroup.getObjectByName(data.name + '_Trail');

    if (!isVisible) {
      if (line) line.visible = false;
      return;
    }

    // Determine Duration and Steps
    const periodDays = data.period || 730; 
    const durationDays = Math.max(365, periodDays);
    
    // Adaptive resolution: 1 step every ~2 days, but capped
    let steps = Math.ceil(durationDays / 2);
    if (steps > 10000) steps = 10000;
    if (steps < 360) steps = 360;

    const halfDuration = durationDays / 2;
    const startTimeMs = config.date.getTime() - halfDuration * 24 * 60 * 60 * 1000;

    // Create or Resize Line
    if (!line || line.geometry.attributes.position.count <= steps) {
      if (line) {
        line.geometry.dispose();
        relativeOrbitGroup.remove(line);
      }

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array((steps + 1) * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.LineBasicMaterial({
        color: data.color || 0x888888,
        transparent: true,
        opacity: 0.4,
      });
      
      line = new THREE.Line(geometry, material);
      line.name = data.name + '_Trail';
      line.frustumCulled = false;
      relativeOrbitGroup.add(line);
    }
    
    line.visible = true;
    line.geometry.setDrawRange(0, steps + 1);
    const positions = line.geometry.attributes.position.array;

    // Update Points
    for (let i = 0; i <= steps; i++) {
      const t = new Date(startTimeMs + (i / steps) * durationDays * 24 * 60 * 60 * 1000);
      
      let targetPos;
      if (data.name === 'Sun') {
        targetPos = new THREE.Vector3(0, 0, 0);
      } else {
        targetPos = getHeliocentricPosition(data, t);
      }

      let centerPos;
      if (system === 'Geocentric') {
        const earthData = allBodiesData.find(d => d.name === 'Earth');
        centerPos = getHeliocentricPosition(earthData, t);
      } else {
        centerPos = getBarycenterPosition(allBodiesData, t);
      }

      const relativePos = new THREE.Vector3().subVectors(targetPos, centerPos);

      // Convert to Scene Coords (X, Z, -Y)
      positions[i * 3] = relativePos.x * AU_TO_SCENE;
      positions[i * 3 + 1] = relativePos.z * AU_TO_SCENE;
      positions[i * 3 + 2] = -relativePos.y * AU_TO_SCENE;
    }

    line.geometry.attributes.position.needsUpdate = true;
  });
}
