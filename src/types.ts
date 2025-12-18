/**
 * @file types.ts
 * @description Shared TypeScript type definitions for the White Rabbit solar system simulator.
 */

import type { Controller } from 'lil-gui';
import type * as THREE from 'three';
import type { Line2 } from 'three/examples/jsm/lines/Line2.js';

// ... (existing imports)

/**
 * Data structure for a Moon
 */
export interface MoonData {
  name: string;
  category: 'largest' | 'major' | 'small' | string;
  radius: number;
  diameter?: number;
  color: number;
  type: 'real' | 'jovian' | 'simple' | string;
  period: number;
  texture?: string;
  tidallyLocked?: boolean;
  axialTilt?: number;
  mass?: number | string;
  gravity?: number;
  meanTemp?: number;
  discoveryYear?: number | string;
  discoveredBy?: string;
  moonIndex?: number;
  distance?: number;
  body?: string;
  magneticField?: { strength: number; tilt: number; color: number };
  orbitLine?: THREE.Line | THREE.LineLoop | Line2 | null;
  lastOrbitUpdate?: number;
  isSimpleScale?: boolean;
  orbitStartMs?: number;
  cumulativeDistances?: number[];
  totalOrbitalLength?: number;
  axisLine?: THREE.Line;
  [key: string]: unknown;
}

/**
 * Data structure for a Planet or Dwarf Planet
 */
export interface CelestialBodyData {
  name: string;
  category?: string;
  body?: string;
  radius: number;
  color: number;
  period: number;
  texture: string;
  cloudTexture?: string;
  rotationPeriod: number;
  axialTilt: number;
  moons?: MoonData[]; // Typically objects merging MoonData with other props
  magneticField?: { strength: number; tilt: number; color: number };
  details?: {
    mass?: number | string;
    density?: string;
    gravity?: string;
    albedo?: string;
    temp?: string;
    pressure?: string;
    solarDay?: string;
    siderealDay?: string;
    eccentricity?: string;
    inclination?: string;
    [key: string]: unknown;
  };
  ring?: {
    inner: number;
    outer: number;
    color: number;
    texture?: string;
  };
  elements?: CustomBody;
  type?: string;
  visible?: boolean;
  cloudMesh?: THREE.Mesh;
  axisLine?: THREE.Line;
  [key: string]: unknown;
}

export interface PlanetWrapper {
  mesh: THREE.Mesh;
  data: CelestialBodyData;
  moons?: MoonWrapper[];
  orbitLine?: THREE.Line | THREE.LineLoop | Line2 | null;
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
  ra?: number;
  dec?: number;
  mag: number;
  ci?: number;
  distance?: number;
  dist?: number; // Legacy alias?
  luminosity?: number;
  mass?: number;
  radius?: number;
  temperature?: number;
  spectralType?: string;
  spect?: string;
  hd?: number;
  hip?: number;
  con?: string;
  constellation?: string;
  position?: THREE.Vector3;
  x?: number;
  y?: number;
  z?: number;
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
  v?: THREE.Vector3;
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
  launchYear?: number;
  agency?: string;
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
  type: 'sun' | 'planet' | 'moon' | 'star' | 'mission' | 'asterism';
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
  teslaRoadster: boolean;
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
  showFPS: boolean;
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
  enablePan?: boolean;
  getVirtualTarget?: () => THREE.Vector3;
  setVirtualTarget?: (target: THREE.Vector3) => void;
  getVirtualPosition?: () => THREE.Vector3;
  setVirtualPosition?: (position: THREE.Vector3) => void;
  localToWorld?: (vector: THREE.Vector3) => THREE.Vector3;
  resetMomentum?: () => void;
  scaleFactor?: number; // ArcballControls zoom sensitivity (default ~1.1)
  rotateSpeed?: number; // ArcballControls rotation speed (default 1.0)
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * Global UI state managed by the GUI system
 */
export interface UIState {
  date: string;
  time: string;
  stardate: string;
  speedFactor: string;
  scalePreset: string;
  updateSpeedometer?: () => void;
  [key: string]: unknown;
}

// ============================================================================
// Material Types
// ============================================================================

/**
 * Options for creating custom materials
 */
export interface MaterialOptions {
  color?: THREE.ColorRepresentation;
  opacity?: number;
  transparent?: boolean;
  useGradient?: boolean;
  glowIntensity?: number;
  linewidth?: number;
  resolution?: THREE.Vector2;
  [key: string]: unknown;
}

// ============================================================================
// Spatial Data Structures
// ============================================================================

/**
 * Generic octree node for spatial queries
 */
export interface OctreeNode<T = OctreePoint> {
  queryRay(ray: THREE.Ray, maxDistance: number): T[];
  insert?(point: T): void;
  [key: string]: unknown;
}

/**
 * Focusable object - any celestial object that can be focused on
 * This represents the internal structure used by focusMode.ts
 */
export interface FocusableObject {
  mesh: THREE.Mesh | THREE.Object3D;
  data: CelestialBodyData | MoonData | StarData | Record<string, unknown>;
  type: 'sun' | 'planet' | 'moon' | 'star' | 'probe';
  originalGeometry?: THREE.BufferGeometry;
  [key: string]: unknown;
}

// ============================================================================
// System Interfaces
// ============================================================================

export interface RabbitSystem {
  update: (delta: number) => void;
  render: () => void;
}

export interface GUIControls {
  uiState: UIState;
  dateCtrl: Controller;
  timeCtrl: Controller;
  stardateCtrl: Controller;
  speedDisplay: Controller;
  [key: string]: unknown;
}

/**
 * Extended Window interface for global app properties
 */
export interface CustomWindow extends Window {
  scene?: THREE.Scene;
  controls?: OriginAwareControls;
  updateMissions?: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: Avoiding circular dependency with SimulationControl class
  SimulationControl?: any;
  [key: string]: unknown;
}
