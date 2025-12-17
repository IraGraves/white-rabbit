import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';
import { config } from '../../config';
import type { CelestialBodyData } from '../../types';
import { Logger } from '../../utils/logger';
import type { LiveData } from './types';

/**
 * Calculations for live astronomical data.
 */

/**
 * Calculates live astronomical data for a planet
 * @param {Object} data - Planet data
 * @returns {Object|null} Live data object or null if not available
 */
export function calculatePlanetLiveData(data: CelestialBodyData): LiveData | null {
  if (!data.body || !Astronomy?.Body || !((data.body as string) in Astronomy.Body)) {
    return null;
  }

  try {
    const date = config.date instanceof Date ? config.date : new Date();

    if (Number.isNaN(date.getTime())) {
      return {
        trueAnomaly: 'Invalid Date',
        velocity: '---',
        distanceAU: '---',
        lightTime: '---',
      };
    }

    const body = Astronomy.Body[data.body as keyof typeof Astronomy.Body];

    // Live Calculations
    const helio = Astronomy.HelioVector(body, date);
    const geo = Astronomy.GeoVector(body, date, true);

    // Calculate velocity using finite difference (since HelioVector doesn't return velocity)
    const dt = 1 / (24 * 60); // 1 minute in days
    const datePrev = new Date(date.getTime() - 60000);
    const dateNext = new Date(date.getTime() + 60000);
    const helioPrev = Astronomy.HelioVector(body, datePrev);
    const helioNext = Astronomy.HelioVector(body, dateNext);

    const vx = (helioNext.x - helioPrev.x) / (2 * dt);
    const vy = (helioNext.y - helioPrev.y) / (2 * dt);
    const vz = (helioNext.z - helioPrev.z) / (2 * dt);

    // Calculate velocity magnitude in AU/day, then convert to km/s
    const vAuDay = Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2);
    const vKmS = ((vAuDay * 149597870.7) / 86400).toFixed(2); // 1 AU = 149,597,870.7 km

    const distAu = Math.sqrt(geo.x ** 2 + geo.y ** 2 + geo.z ** 2);
    // Light travel time: 1 AU = 499.00478 seconds
    const lightTimeMin = ((distAu * 499.00478) / 60).toFixed(2);

    // --- Calculate True Anomaly ---
    // State vectors r and v
    const r = new THREE.Vector3(helio.x, helio.y, helio.z);
    const v = new THREE.Vector3(vx, vy, vz);

    // Specific angular momentum h = r x v
    const h = new THREE.Vector3().crossVectors(r, v);

    // Gravitational parameter for Sun (GM) in AU^3/day^2
    // Gaussian gravitational constant k = 0.01720209895
    // GM = k^2
    const GM = 0.0002959122082855911;

    // Eccentricity vector e = (v x h) / GM - r / |r|
    const vCrossH = new THREE.Vector3().crossVectors(v, h);
    const rMag = r.length();

    // eVec = (v x h) / GM - r / rMag
    const term1 = vCrossH.clone().divideScalar(GM);
    const term2 = r.clone().divideScalar(rMag);
    const eVec = term1.sub(term2);

    const e = eVec.length();

    let trueAnomalyDeg = 0;

    if (e > 1e-6) {
      // cos(nu) = (e . r) / (e * r)
      const dotER = eVec.dot(r);
      const cosNu = dotER / (e * rMag);

      // Clamp for safety
      const clampedCos = Math.max(-1, Math.min(1, cosNu));
      const nu = Math.acos(clampedCos);

      trueAnomalyDeg = (nu * 180) / Math.PI;

      // Check quadrant: if r . v < 0, then nu = 360 - nu
      if (r.dot(v) < 0) {
        trueAnomalyDeg = 360 - trueAnomalyDeg;
      }
    } else {
      // Circular orbit, True Anomaly is undefined, usually set to Mean Anomaly or Longitude
      trueAnomalyDeg = 0;
    }

    return {
      trueAnomaly: trueAnomalyDeg.toFixed(1),
      velocity: vKmS,
      distanceAU: distAu.toFixed(3),
      lightTime: lightTimeMin,
    };
  } catch (e) {
    Logger.warn(`Error calculating live data for ${data.name}`, e);
    return null;
  }
}

/**
 * Calculates live astronomical data for the Sun
 * @returns {Object|null} Live data object or null if not available
 */
export function calculateSunLiveData(): LiveData | null {
  try {
    const date = config.date instanceof Date ? config.date : new Date();

    // GeoVector('Sun') gives vector from Earth to Sun
    const geo = Astronomy.GeoVector(Astronomy.Body.Sun, date, true);

    const distAu = Math.sqrt(geo.x ** 2 + geo.y ** 2 + geo.z ** 2);
    // Light travel time: 1 AU = 499.00478 seconds
    const lightTimeMin = ((distAu * 499.00478) / 60).toFixed(2);

    return {
      distanceAU: distAu.toFixed(3),
      lightTime: lightTimeMin,
    };
  } catch (e) {
    Logger.warn('Error calculating live data for Sun', e);
    return null;
  }
}
