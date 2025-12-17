import { CONSTELLATION_NAMES } from '../../data/constellationNames';
import { sunData } from '../../data/sun';
import type { CelestialBodyData, MoonData, ObjectHitResult, StarData } from '../../types';
import { formatDecimal, formatGravity, formatScientific } from '../../utils/formatting';
import { Logger } from '../../utils/logger';
import { calculatePlanetLiveData, calculateSunLiveData } from './calculations';
import type { LiveData } from './types';

/**
 * HTML Formatting functions for tooltips.
 */

/**
 * Builds HTML tooltip from structured data
 * @param {string} title - Tooltip title
 * @param {Array<{label: string, value: string}>} fields - Array of field objects
 * @param {string} [liveSection] - Optional HTML for live data section
 * @returns {string} HTML string
 */
export function buildTooltip(
  title: string,
  fields: { label: string; value: string }[],
  liveSection: string | null = null
): string {
  let html = `<div class="tooltip-container">`;
  html += `<div class="tooltip-header">${title}</div>`;
  html += `<div class="tooltip-content">`;

  if (fields.length > 0) {
    for (const field of fields) {
      html += `
        <div class="tooltip-row">
          <span class="tooltip-label">${field.label}</span>
          <span class="tooltip-value">${field.value}</span>
        </div>`;
    }
  }

  if (liveSection) {
    html += liveSection;
  }

  html += `</div></div>`;
  return html;
}

function formatLiveDataSection(liveData: LiveData): string {
  let html = `<div class="tooltip-live-section"><span class="tooltip-live-title">Live Data</span>`;

  if (liveData.trueAnomaly) {
    html += `<div class="tooltip-row"><span class="tooltip-label">True Anomaly</span><span class="tooltip-value">${liveData.trueAnomaly}°</span></div>`;
  }
  if (liveData.velocity) {
    html += `<div class="tooltip-row"><span class="tooltip-label">Helio Velocity</span><span class="tooltip-value">${liveData.velocity} km/s</span></div>`;
  }
  if (liveData.distanceAU) {
    html += `<div class="tooltip-row"><span class="tooltip-label">Dist to Earth</span><span class="tooltip-value">${liveData.distanceAU} AU</span></div>`;
  }
  if (liveData.lightTime) {
    html += `<div class="tooltip-row"><span class="tooltip-label">Light Time</span><span class="tooltip-value">${liveData.lightTime} min</span></div>`;
  }

  html += `</div>`;
  return html;
}

/**
 * Formats tooltip for the Sun
 * @returns {string} HTML string
 */
export function formatSunTooltip(): string {
  const fields = sunData.fields;

  const liveData = calculateSunLiveData();
  const liveSection = liveData ? formatLiveDataSection(liveData) : null;

  return buildTooltip('Sun', fields, liveSection);
}

/**
 * Formats tooltip for a planet
 * @param {Object} data - Planet data object
 * @returns {string} HTML string
 */
export function formatPlanetTooltip(data: CelestialBodyData): string {
  let typeStr = 'Planet';
  if (data.type === 'dwarf') {
    typeStr = 'Dwarf Planet';
  } else if (data.category) {
    typeStr = `Planet (${data.category})`;
  }

  const fields = [{ label: 'Type', value: typeStr }];

  // Calculate Radius in km (1 Earth Radius = 6371 km)
  const radiusKm = data.radius * 6371;
  let radiusStr = `${formatDecimal(radiusKm)} km`;
  if (data.name !== 'Earth') {
    radiusStr += ` (${formatDecimal(data.radius)} x Earth)`;
  }

  // Calculate Mass in Earths (1 Earth Mass = 5.97e24 kg)
  let massStr = '';
  if (data.details && typeof data.details.mass === 'number') {
    const earthMass = 5.97e24;
    const massInEarths = data.details.mass / earthMass;
    const massInKg = formatScientific(data.details.mass);

    massStr = `${massInKg} kg`;

    if (data.name !== 'Earth') {
      let relativeStr = `${formatDecimal(massInEarths)} x Earth`;
      if (massInEarths < 0.01) {
        relativeStr = `${formatScientific(massInEarths)} x Earth`;
      }
      massStr += ` (${relativeStr})`;
    }
  }

  // Add detailed fields if available
  if (data.details) {
    fields.push(
      { label: 'Year', value: `${formatDecimal(data.period)} days` },
      { label: 'Radius', value: radiusStr },
      { label: 'Mass', value: massStr },
      { label: 'Density', value: data.details.density || 'N/A' },
      { label: 'Surface Gravity', value: formatGravity(data.details.gravity) },
      { label: 'Albedo', value: data.details.albedo || 'N/A' },
      { label: 'Surface Temp', value: data.details.temp || 'N/A' }
    );

    fields.push({ label: 'Surface Pressure', value: data.details.pressure || 'N/A' });

    fields.push(
      { label: 'Solar Day', value: data.details.solarDay || 'N/A' },
      { label: 'Sidereal Day', value: data.details.siderealDay || 'N/A' },
      { label: 'Axial Tilt', value: `${data.axialTilt}°` },
      { label: 'Eccentricity', value: data.details.eccentricity || 'N/A' },
      { label: 'Inclination', value: data.details.inclination || 'N/A' }
    );
  }

  const liveData = calculatePlanetLiveData(data);
  const liveSection = liveData ? formatLiveDataSection(liveData) : null;

  return buildTooltip(data.name, fields, liveSection);
}

/**
 * Formats tooltip for a moon
 * @param {Object} data - Moon data object
 * @param {string} parentName - Name of the parent planet
 * @returns {string} HTML string
 */
export function formatMoonTooltip(data: MoonData, parentName: string): string {
  const fields = [
    { label: 'Type', value: 'Moon' },
    { label: 'Orbiting', value: parentName || 'Unknown' },
  ];

  if (data.diameter) {
    fields.push({ label: 'Diameter', value: `${formatDecimal(data.diameter)} km` });
  }

  if (data.mass) {
    const massStr = typeof data.mass === 'number' ? formatScientific(data.mass) : data.mass;
    fields.push({ label: 'Mass', value: `${massStr} kg` });
  }

  if (data.gravity) {
    fields.push({ label: 'Surface Gravity', value: formatGravity(data.gravity) });
  }

  if (data.meanTemp) {
    fields.push({ label: 'Mean Temp', value: `${data.meanTemp} K` });
  }

  fields.push({ label: 'Orbital Period', value: `${data.period.toFixed(2)} days` });

  if (data.discoveryYear) {
    fields.push({ label: 'Discovered', value: `${data.discoveryYear} (${data.discoveredBy})` });
  }

  return buildTooltip(data.name, fields);
}

/**
 * Formats tooltip for a star
 * @param {Object} data - Star data object
 * @returns {string} HTML string
 */
export function formatStarTooltip(data: StarData): string {
  const distance = data.distance
    ? (data.distance * 3.26156).toLocaleString('en-US', { maximumFractionDigits: 1 })
    : 'N/A';
  const luminosity = data.luminosity
    ? data.luminosity.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : 'N/A';

  let name = data.name;
  if (!name) {
    if (data.hd) name = `HD ${data.hd}`;
    else if (data.hip) name = `HIP ${data.hip}`;
    else name = `HR ${data.id}`;
  }

  const type = data.spectralType || 'Unknown';

  const fields = [
    { label: 'Distance', value: `${distance} LY` },
    { label: 'Type', value: type },
    { label: 'Luminosity', value: `${luminosity} L☉` },
  ];

  if (data.constellation) {
    const conName =
      CONSTELLATION_NAMES[data.constellation as keyof typeof CONSTELLATION_NAMES] ||
      data.constellation;
    fields.push({ label: 'Constellation', value: `${conName} (${data.constellation})` });
  }

  if (data.temperature) {
    fields.push({
      label: 'Temp',
      value: `${Math.round(data.temperature).toLocaleString('en-US')} K`,
    });
  }

  if (data.mass) {
    fields.push({
      label: 'Mass',
      value: `${data.mass.toLocaleString('en-US', { maximumFractionDigits: 2 })} M☉`,
    });
  }

  if (data.radius) {
    fields.push({
      label: 'Radius',
      value: `${data.radius.toLocaleString('en-US', { maximumFractionDigits: 2 })} R☉`,
    });
  }

  if (data.mag !== undefined) {
    fields.push({ label: 'Apparent Mag', value: data.mag.toFixed(2) });
  } else if (data.luminosity && data.distance) {
    const M = 4.83 - 2.5 * Math.log10(data.luminosity);
    const m = M + 5 * (Math.log10(data.distance) - 1);
    fields.push({ label: 'Apparent Mag (Est)', value: m.toFixed(2) });
  }

  if (data.hip) {
    fields.push({ label: 'Hipparcos ID', value: `${data.hip}` });
  }
  if (data.hd) {
    fields.push({ label: 'HD ID', value: `${data.hd}` });
  }

  if (!data.hip && !data.hd) {
    fields.push({ label: 'Catalog ID', value: `${data.id}` });
  }

  return buildTooltip(name, fields);
}

/**
 * Formats tooltip for an asterism
 * @param {Object} data - Asterism/Constellation data
 * @returns {string} HTML string
 */
export function formatAsterismTooltip(data: {
  id: string;
  type?: string;
  [key: string]: unknown;
}): string {
  const code = data.id;
  const CONSTELLATION_NAMES_ANY = CONSTELLATION_NAMES as Record<string, string>;
  const fullName = CONSTELLATION_NAMES_ANY[code] || code;

  const fields = [
    { label: 'Code', value: code },
    { label: 'Full Name', value: fullName },
  ];

  if (data.type === 'constellation') {
    fields.push({ label: 'Type', value: 'Constellation Boundary' });
  } else {
    fields.push({ label: 'Type', value: 'Asterism' });
  }

  return buildTooltip(fullName, fields);
}

/**
 * Formats the tooltip HTML based on the object type
 * @param {Object} closestObject - Object containing data and type
 * @returns {string} HTML string for the tooltip
 */
export function formatTooltip(closestObject: ObjectHitResult): string {
  try {
    const data = closestObject.data;

    switch (closestObject.type) {
      case 'sun':
        return formatSunTooltip();
      case 'planet':
        return formatPlanetTooltip(data as CelestialBodyData);
      case 'moon':
        return formatMoonTooltip(data as MoonData, closestObject.parentName || 'Unknown');
      case 'star':
        return formatStarTooltip(data as StarData);
      case 'asterism':
        return formatAsterismTooltip(data as { id: string; type?: string; [key: string]: unknown });
      default:
        return '';
    }
  } catch (error) {
    Logger.error('Error formatting tooltip:', error);
    return 'Error loading data';
  }
}
