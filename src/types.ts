/**
 * @file types.ts
 * @description Shared TypeScript type definitions for the White Rabbit solar system simulator.
 */

import type * as THREE from 'three';

// ============================================================================
// Core Celestial Body Types
// ============================================================================

/**
 * Data structure for planet/dwarf planet information
 */
export interface CelestialBodyData {
  name: string;
  type?: 'planet' | 'dwarf' | 'moon' | 'sun';
  diameter?: number;
  radius?: number;
  mass?: number;
  gravity?: string | number;
  orbitalPeriod?: number;
  rotationPeriod?: number;
  distanceFromSun?: number;
  moons?: number;
  rings?: boolean;
  description?: string;
  cloudTexture?: string; // Path to cloud texture
  cloudMesh?: THREE.Mesh;
  items?: any[]; // For clusters/asterisms if needed
  color?: string | number;
  axialTilt?: number;
  elements?: CustomBody;
  [key: string]: unknown;
}

/**
 * Moon data structure
 */
export interface MoonData {
  name: string;
  diameter?: number;
  orbitalPeriod?: number;
  orbitalRadius?: number;
  inclination?: number;
  eccentricity?: number;
  type?: 'largest' | 'major' | 'small';
  parentPlanet?: string;
  [key: string]: unknown;
}

/**
 * Planet wrapper containing mesh, data, and moons
 */
export interface PlanetWrapper {
  mesh: THREE.Mesh;
  data: CelestialBodyData;
  moons?: MoonWrapper[];
  orbitLine?: THREE.Line | THREE.LineLoop | null;
  group?: THREE.Group;
  rings?: THREE.Mesh;
  highResMesh?: THREE.Mesh;
  lowResMesh?: THREE.Mesh;
  orbitLinesGroup?: THREE.Group;
  [key: string]: unknown;
}

/**
 * Moon wrapper containing mesh and data
 */
export interface MoonWrapper {
  mesh: THREE.Mesh;
  data: MoonData;
  orbitLine?: THREE.Line;
  [key: string]: unknown;
}

// ============================================================================
// Star Types
// ============================================================================

/**
 * Star data from the HYG database
 */
export interface StarData {
  id: number;
  name?: string;
  ra: number;
  dec: number;
  mag: number;
  ci?: number; // Color index
  dist?: number; // Distance in parsecs
  con?: string; // Constellation abbreviation
  position?: THREE.Vector3;
  [key: string]: unknown;
}

/**
 * Point in octree for spatial queries
 */
export interface OctreePoint {
  position: THREE.Vector3;
  data?: StarData;
  index?: number;
  [key: string]: unknown;
}

// ============================================================================
// Mission Types
// ============================================================================

/**
 * Mission waypoint data
 */
export interface MissionWaypoint {
  date: string | Date;
  label?: string;
  body?: string;
  customBody?: string;
  lat?: number;
  lon?: number;
  offset?: { x: number; y: number; z: number };
  dist?: number;
  pos?: THREE.Vector3;
}

/**
 * Custom Keplerian elements for bodies not in Astronomy Engine
 */
export interface CustomBody {
  a: number;
  e: number;
  i: number;
  Omega: number;
  w: number;
  M: number;
  epoch?: number | string;
}

/**
 * Mission trajectory data
 */
export interface MissionData {
  id: string;
  name: string;
  summary?: string;
  color?: string | number;
  image?: string;
  modelPath?: string;
  wikiUrl?: string;
  exit?: { ra: number; dec: number };
  timeline?: { date: string | Date; label: string }[];
  waypoints: MissionWaypoint[];
  [key: string]: unknown;
}

// ============================================================================
// UI Types
// ============================================================================

/**
 * Screen position result from worldToScreen
 */
export interface ScreenPosition {
  x: number;
  y: number;
  z: number;
}

/**
 * Object hit result from raycasting/screen-space detection
 */
export interface ObjectHitResult {
  type: 'sun' | 'planet' | 'moon' | 'star' | 'mission';
  data: CelestialBodyData | MoonData | StarData | MissionData | Record<string, unknown>;
  parentName?: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Music configuration
 */
export interface MusicConfig {
  enabled: boolean;
  volume: number;
  playlist: string[];
  currentTrackName: string;
  shuffle: boolean;
}

/**
 * Mission visibility toggles
 */
export interface MissionVisibility {
  voyager1: boolean;
  voyager2: boolean;
  pioneer10: boolean;
  pioneer11: boolean;
  galileo: boolean;
  cassini: boolean;
  newHorizons: boolean;
  parkerSolarProbe: boolean;
  juno: boolean;
  rosetta: boolean;
  ulysses: boolean;
  [key: string]: boolean;
}

/**
 * Global configuration object type
 */
export interface Config {
  speedExponent: number;
  simulationSpeed: number;
  planetScale: number;
  sunScale: number;
  capMoonOrbits: boolean;
  capMagneticFields: boolean;
  starBrightness: number;
  starSaturation: number;
  magnitudeLimit: number;
  gamma: number;
  showOrbits: boolean;
  showSunOrbits: boolean;
  showPlanetOrbits: boolean;
  showDwarfPlanetOrbits: boolean;
  showMoonOrbits: boolean;
  showAxes: boolean;
  objectInfoMode: 'tooltip' | 'window' | 'off';
  coordinateSystem: 'Heliocentric' | 'Geocentric' | 'Barycentric' | 'Tychonic';
  referencePlane: 'Equatorial' | 'Ecliptic';
  showZodiacs: boolean;
  showConstellations: boolean;
  showAsterisms: boolean;
  showZodiacSigns: boolean;
  showHabitableZone: boolean;
  showMagneticFields: boolean;
  showSunMagneticFieldBasic: boolean;
  showSunMagneticField: boolean;
  showPlanetColors: boolean;
  showDwarfPlanetColors: boolean;
  showSun: boolean;
  showPlanets: boolean;
  showLargestMoons: boolean;
  showMajorMoons: boolean;
  showSmallMoons: boolean;
  showDwarfPlanets: boolean;
  showMissions: MissionVisibility;
  date: Date;
  stop: boolean;
  music: MusicConfig;
  debug: boolean;
}

// ============================================================================
// Control Types
// ============================================================================

/**
 * Extended controls with origin-aware features
 */
export interface OriginAwareControls {
  target: THREE.Vector3;
  virtualTarget?: THREE.Vector3;
  object: THREE.Camera;
  update: () => void;
  enabled: boolean;
  getVirtualTarget?: () => THREE.Vector3;
  setVirtualTarget?: (target: THREE.Vector3) => void;
  [key: string]: unknown;
}
