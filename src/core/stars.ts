/**
 * @file stars.ts
 * @description Starfield generation, constellation rendering, and stellar catalog management.
 *
 * Supports chunked loading of star data for performance (visible vs deep space).
 * Manages multiple THREE.Points objects and Octrees.
 *
 * NOTE ON RENDERING:
 * Previously, star sizes and fluxes were calculated using the 'luminosity' field from the HYG database.
 * It was discovered that this field likely represents Bolometric Luminosity (total energy output),
 * which includes Infrared/UV. This caused cool stars (like Red Dwarfs, M-types) to have massively
 * inflated visual brightness/size relative to their Visual Magnitude.
 * The rendering logic has been switched to use 'mag' (Visual Magnitude) exclusively for:
 * 1. Flux calculation (-0.921 * mag)
 * 2. Size scaling logic
 * 3. Intensity attenuation
 * This ensures accurate visual representation as seen by the human eye.
 */
import * as THREE from 'three';
import { config, PARSEC_TO_SCENE } from '../config';
import { ZODIAC_IDS } from '../data/zodiac';
import { Logger } from '../utils/logger';
import { Octree } from '../utils/Octree';

// VirtualOrigin import removed

// Chunk config matching generation script
const CHUNKS = [
  { id: 0, file: 'stars_data_0.bin', meta: 'stars_meta_0.json' },
  { id: 1, file: 'stars_data_1.bin', meta: 'stars_meta_1.json' },
  { id: 2, file: 'stars_data_2.bin', meta: 'stars_meta_2.json' },
];

// Hybrid texture: Solid Core + Soft Edge for high-quality point rendering
function createStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);

  // 0.0 - 0.15: Solid Core (100%) - Defines the "hard" point
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.15, 'rgba(255, 255, 255, 1.0)');

  // 0.15 - 0.4: Falloff (Anti-aliasing/Soft Edge)
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)');

  // 0.4+: Transparent
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

import type { StarData } from '../types';

class StarManager {
  scene: THREE.Object3D;
  starsGroup: THREE.Group;
  chunks: Map<number, { points: THREE.Points; octree: Octree; data: StarData[] }>;
  texture: THREE.CanvasTexture;
  allStarData: StarData[];
  brightness: number;
  currentBrightness: number;
  currentLimit: number;
  saturation: number;
  saturationUniform: { value: number };
  loadingChunks: Set<number>;

  constructor(scene: THREE.Object3D) {
    this.scene = scene;
    this.starsGroup = new THREE.Group();
    this.starsGroup.name = 'StarsGroup';
    this.starsGroup.renderOrder = -1;
    this.scene.add(this.starsGroup);

    this.chunks = new Map(); // id -> { points, octree, data }
    this.texture = createStarTexture();

    // Expose a flat data array for easy access by other systems (search etc)
    // This will be rebuilt when chunks load
    this.allStarData = [];
    this.starsGroup.userData = {
      starData: this.allStarData, // Reference to the array
      manager: this,
    };

    // Default brightness from config
    this.brightness = config.starBrightness;
    this.currentBrightness = this.brightness;
    this.currentLimit = 6.0; // Default limit
    this.saturation = config.starSaturation !== undefined ? config.starSaturation : 1.0;
    // Shared uniform object to ensure all shaders share the same live value
    this.saturationUniform = { value: this.saturation };

    this.loadingChunks = new Set();
  }

  async loadChunk(chunkId: number): Promise<void> {
    if (this.chunks.has(chunkId)) return; // Already loaded
    if (this.loadingChunks.has(chunkId)) return; // Already loading

    this.loadingChunks.add(chunkId);

    const chunkConfig = CHUNKS[chunkId];
    if (!chunkConfig) {
      this.loadingChunks.delete(chunkId);
      return;
    }

    try {
      const timestamp = Date.now(); // Cache busting
      Logger.log(`Loading star chunk ${chunkId} (v=${timestamp})...`);
      const [metaRes, binRes] = await Promise.all([
        fetch(`${import.meta.env.BASE_URL}assets/${chunkConfig.meta}?v=${timestamp}`),
        fetch(`${import.meta.env.BASE_URL}assets/${chunkConfig.file}?v=${timestamp}`),
      ]);

      const metaData = await metaRes.json();
      const arrayBuffer = await binRes.arrayBuffer();
      const dataView = new Float32Array(arrayBuffer);
      const STRIDE = 11;

      const positions: number[] = [];
      const colors: number[] = [];
      const sizes: number[] = [];
      const chunkData: StarData[] = [];

      // [x, y, z, r, g, b, lum, rad, mass, temp, mag]
      // Use PARSEC_TO_SCENE for realistic stellar distances

      for (let i = 0; i < metaData.length; i++) {
        const offset = i * STRIDE;

        const xRaw = dataView[offset + 0];
        const yRaw = dataView[offset + 1];
        const zRaw = dataView[offset + 2];
        const r = dataView[offset + 3];
        const g = dataView[offset + 4];
        const b = dataView[offset + 5];
        const lum = dataView[offset + 6];
        const rad = dataView[offset + 7];
        const mass = dataView[offset + 8];
        const temp = dataView[offset + 9];
        const mag = dataView[offset + 10];

        // Recalculate distance from raw parsec coordinates
        const distV = Math.sqrt(xRaw * xRaw + yRaw * yRaw + zRaw * zRaw);
        const dist = Math.max(distV, 0.1);

        // FIX: Use Visual Magnitude (mag) for visual apparent brightness/size
        // Previous use of 'lum' (likely Bolometric) caused cool stars (Red Dwarfs)
        // to appear way too bright/large relative to their visual magnitude.
        // logFlux ~ -0.921 * mag (Natural log scaling of magnitude)
        const logFlux = -0.921 * mag;

        // Tuned Size Curve for Gaia Sky look (Round 3):
        let size = 1.0;

        // Magnitude-based intensity attenuation
        // Stars brighter than mag 2.0 = 1.0 intensity
        // Stars dimmer than mag 2.0 = dimmer
        // Mag 6.0 ~ 0.6
        // Mag 10.0 ~ 0.2
        let intensity = 1.0;
        if (mag > 2.0) {
          intensity = Math.max(0.1, 1.0 - (mag - 2.0) * 0.1);
        }

        // Fainter stars (logFlux < -6.0) -> Keep small but visible
        // Mag 6.5 => logFlux ~ -6.0
        if (logFlux < -6.0) {
          // Linear scaling for faint stars
          // Mag 13 (logFlux -12) -> size ~ 0.4
          // Mag 6.5 (logFlux -6) -> size ~ 1.0
          // Slope: (1.0 - 0.4) / 6 = 0.1
          size = 1.0 + (logFlux + 6.0) * 0.1;
          if (size < 0.3) size = 0.3; // Hard floor
        } else {
          // Brighter stars (Mag < 6.5)
          // Mag 2 => logFlux -1.8. t = 4.2. Size 1 + 4.2^1.4 * 0.3 = 1 + 7.4 * 0.3 = 3.2
          // Mag -1.5 => logFlux 1.4. t = 7.4. Size 1 + 16 * 0.3 = 5.8
          const t = logFlux + 6.0;
          size = 1.0 + t ** 1.4 * 0.3;
        }

        // Strict Cap to prevent "blobs"
        size = Math.min(size, 8.0);
        sizes.push(size);

        const [id, name, bayer, flam, hip, hd, spect, con] = metaData[i];

        // Coordinate align: x->x, y->z, z->-y to match Planets (Y-up is North)
        const x = xRaw * PARSEC_TO_SCENE;
        const y = zRaw * PARSEC_TO_SCENE;
        const z = -yRaw * PARSEC_TO_SCENE;

        positions.push(x, y, z);

        // Apply intensity to vertex colors
        colors.push(r * intensity, g * intensity, b * intensity);

        chunkData.push({
          id,
          name,
          bayer,
          flamsteed: flam,
          hip,
          hd,
          spectralType: spect || 'Unknown',
          constellation: con, // Added
          luminosity: lum,
          radius: rad,
          mass: mass,
          temperature: temp,
          mag: mag,
          distance: dist, // Parsecs
          x: xRaw,
          y: yRaw,
          z: zRaw,
        });
      }

      // Geometry
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('starSize', new THREE.Float32BufferAttribute(sizes, 1));

      // Material
      const material = new THREE.PointsMaterial({
        size: 1.0,
        map: this.texture,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: false, // Fix: Prevent distance from shrinking stars to <1px
        dithering: true,
      });

      material.onBeforeCompile = (shader) => {
        // console.log(`[Shader] Compiling star material for Chunk ${chunkId}`);

        // TODO: Camera-relative positioning disabled - see MaterialFactory.js

        shader.vertexShader = `
                    attribute float starSize;
                    ${shader.vertexShader}
                `;
        shader.vertexShader = shader.vertexShader.replace(
          'gl_PointSize = size;',
          'gl_PointSize = starSize * size;'
        );

        // Inject Saturation Uniform (Shared Reference)
        shader.uniforms.saturation = this.saturationUniform;

        // Inject Saturation Logic in Fragment Shader
        // We inject at the start of main to define uniforms if needed,
        // but standard material shader structure means we usually append to top or replace chunks.
        // Easiest: Prepend uniform to fragmentShader
        shader.fragmentShader = `
          uniform float saturation;
          ${shader.fragmentShader}
        `;

        // Apply saturation control before output
        // gl_FragColor is set at end of main. We hook in right before the closing brace?
        // Or replace a chunk. '#include <dithering_fragment>' is usually last.
        // Apply saturation control.
        // We hook into <fog_fragment> which is near the end of the main function in PointsMaterial.
        // Apply saturation control.
        // We hook into <fog_fragment> which is near the end of the main function in PointsMaterial.
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <fog_fragment>',
          `
          #include <fog_fragment>
          
          // Saturation Boost "Bimodal Separation" Algorithm
          // Goal: Create distinct Red/Blue stars (Sci-Fi aesthetic) removing "muddy" middle ground.
          vec3 col = gl_FragColor.rgb;
          
          if (saturation > 0.1) {
             // 1. Analyze Spectral Bias (Red vs Blue channel dominance)
             // Green is usually the "luminance" anchor, so we pivot around it.
             float bias = col.r - col.b; // + is Warm (Red), - is Cool (Blue)
             
             // 2. Apply Divergence (Push colors apart)
             // As saturation increases, we force stars to "pick a side".
             float strength = saturation * 0.5; // Tunable power
             
             if (bias > 0.0) {
                 // WARN STAR -> Push Red/Gold
                 col.r *= (1.0 + strength * 0.6); 
                 col.g *= (1.0 + strength * 0.1); // Keep some gold
                 col.b *= (1.0 - strength * 0.8); // Kill Blue
             } else {
                 // COOL STAR -> Push Blue/Cyan
                 col.b *= (1.0 + strength * 1.2); // Blue needs more help to be visible
                 col.r *= (1.0 - strength * 0.8); // Kill Red
                 col.g *= (1.0 - strength * 0.2);
             }
             
             // 3. Global Saturation (Clean up grayness)
             // Standard vibrance pass to finish
             float lum = dot(col, vec3(0.299, 0.587, 0.114));
             col = mix(vec3(lum), col, 1.0 + saturation * 0.3);
             
             // 4. Energy Conservation (Prevent Darkening)
             // If we killed a channel, we lost brightness. Add it back.
             // We just enforce a floor based on original max intensity.
             float oldMax = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));
             float newMax = max(col.r, max(col.g, col.b));
             if (newMax > 0.001) {
                col *= (oldMax / newMax);
             }
             
             // 5. Final Boost (Make colors pop)
             col *= 1.1; 
             
             gl_FragColor.rgb = col;
          }
          `
        );

        // Save reference to shader to update uniforms later
        material.userData.shader = shader;
      };

      const points = new THREE.Points(geometry, material);

      // Apply brightness relative to config/current state
      this.updateMaterial(points, this.currentBrightness);

      this.starsGroup.add(points);

      // Octree
      const octree = this.buildOctree(chunkData);

      this.chunks.set(chunkId, { points, octree, data: chunkData });
      this.updateAllStarData();

      // Apply current magnitude limit to the new chunk
      if (config.magnitudeLimit !== undefined) {
        this.setMagnitudeLimit(config.magnitudeLimit);
      }
    } catch (err) {
      Logger.error(`Failed to load chunk ${chunkId}`, err);
    } finally {
      this.loadingChunks.delete(chunkId);
    }
  }

  // New method to unload chunks for memory management if needed
  unloadChunk(chunkId: number): void {
    if (!this.chunks.has(chunkId)) return;

    const chunk = this.chunks.get(chunkId);
    if (chunk) {
      this.starsGroup.remove(chunk.points);
      chunk.points.geometry.dispose();
      if (Array.isArray(chunk.points.material)) {
        chunk.points.material.forEach((m) => {
          m.dispose();
        });
      } else {
        chunk.points.material.dispose();
      }
    }

    this.chunks.delete(chunkId);
    this.updateAllStarData();
  }

  buildOctree(data: StarData[]): Octree {
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    // Use PARSEC_TO_SCENE for realistic stellar distances

    data.forEach((star) => {
      const x = (star.x ?? 0) * PARSEC_TO_SCENE;
      const y = (star.z ?? 0) * PARSEC_TO_SCENE;
      const z = -(star.y ?? 0) * PARSEC_TO_SCENE;
      min.min(new THREE.Vector3(x, y, z));
      max.max(new THREE.Vector3(x, y, z));
    });

    min.subScalar(100);
    max.addScalar(100);

    const octree = new Octree(new THREE.Box3(min, max), 64);
    data.forEach((star, i) => {
      const x = (star.x ?? 0) * PARSEC_TO_SCENE;
      const y = (star.z ?? 0) * PARSEC_TO_SCENE;
      const z = -(star.y ?? 0) * PARSEC_TO_SCENE;
      octree.insert({ position: new THREE.Vector3(x, y, z), data: star, index: i });
    });
    return octree;
  }

  updateAllStarData(): void {
    // Rebuild flat array
    this.allStarData.length = 0;
    this.chunks.forEach((chunk) => {
      this.allStarData.push(...chunk.data);
    });
    // Update userData reference just in case
    this.starsGroup.userData.starData = this.allStarData;
  }

  getOctrees(): Octree[] {
    const trees: Octree[] = [];
    this.chunks.forEach((c) => {
      trees.push(c.octree);
    });
    return trees;
  }

  visibleCount: number = 0;

  setMagnitudeLimit(limit: number): void {
    this.currentLimit = limit;

    // Determine which chunks we need
    if (limit > 6.5) this.loadChunk(1);
    if (limit > 8.0) this.loadChunk(2);

    let totalVisible = 0;

    this.chunks.forEach((chunk, _id) => {
      const data = chunk.data;
      if (!data || data.length === 0) return;

      // Find visible count using binary search.
      let count = 0;
      // Optimization: Check boundaries
      if (data[0].mag > limit) {
        count = 0;
      } else if (data[data.length - 1].mag < limit) {
        count = data.length;
      } else {
        // Binary search for visible count
        let low = 0,
          high = data.length - 1;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          if (data[mid].mag < limit) {
            count = mid + 1; // logical count
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
      }

      totalVisible += count;

      if (chunk.points?.geometry) {
        chunk.points.geometry.setDrawRange(0, count);
      }
    });

    this.visibleCount = totalVisible;
  }

  getCounts(): { total: number; visible: number } {
    return {
      total: this.allStarData.length,
      visible: this.visibleCount,
    };
  }

  setBrightness(val: number): void {
    this.brightness = val;
    this.applyBrightness(val);
  }

  applyBrightness(val: number): void {
    this.currentBrightness = val;
    this.chunks.forEach((chunk) => {
      this.updateMaterial(chunk.points, val);
    });
  }

  updateMaterial(points: THREE.Points | null, val: number): void {
    if (!points || !points.material) return;

    // Safety check
    if (val === undefined || val === null) val = 0.5;

    let intensity = 0.0;
    let opacity = 0.0;
    let size = 1.0;

    // Three-tier brightness curve:
    // Tier 1: 0.0-0.5 (Low brightness)
    // Tier 2: 0.5-1.0 (High brightness / Bloom mode)
    // Tier 3: 1.0-1.43 (Super-bright mode - extended range)

    if (val <= 0.5) {
      // Range 0.0 -> 0.5
      // Opacity: 0.6 -> 0.85
      // Intensity: 0.6 -> 1.2
      const t = val / 0.5;
      opacity = 0.6 + t * 0.25;
      intensity = 0.6 + t * 0.6;
      size = 1.0;
    } else if (val <= 1.0) {
      // Range 0.5 -> 1.0 (Bloom/HDR mode)
      // Opacity: 0.85 -> 1.0
      // Intensity: 1.2 -> 5.0
      const t = (val - 0.5) / 0.5;
      opacity = 0.85 + t * 0.15;
      intensity = 1.2 + t * 3.8;
      size = 1.0 + t * 0.5; // Max 1.5x at 100%
    } else {
      // Range 1.0 -> 1.43 (Super-bright mode)
      // Opacity: 1.0 (maxed)
      // Intensity: 5.0 -> 8.0 (continued boost)
      // Size: 1.5 -> 2.0 (continued scaling)
      const t = (val - 1.0) / 0.43;
      opacity = 1.0;
      intensity = 5.0 + t * 3.0; // Max 8.0
      size = 1.5 + t * 0.5; // Max 2.0x
    }

    const mat = points.material as THREE.PointsMaterial;
    mat.opacity = opacity;
    mat.color.setScalar(intensity);
    mat.size = size;
  }

  setSaturation(val: number): void {
    this.saturation = val;
    this.saturationUniform.value = val;
  }
}

export async function createStarfield(scene: THREE.Object3D): Promise<{
  stars: THREE.Group;
  rawData: StarData[];
  manager: StarManager;
}> {
  const manager = new StarManager(scene);

  // Initial Load: Chunk 0 (Visible + Constellations)
  await manager.loadChunk(0);

  return {
    stars: manager.starsGroup,
    rawData: manager.allStarData, // Note: This will grow if more chunks load
    manager: manager,
  };
}

export async function createAsterisms(
  zodiacGroup: THREE.Group,
  asterismsGroup: THREE.Group,
  starsData: StarData[]
): Promise<void> {
  // Note: starsData might only be Chunk 0 at start.
  // Asterism lines rely on stars being present in provided starsData.
  // Our chunking logic FORCED all asterism stars into Chunk 0, so this is safe.

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}assets/asterisms_lines_all.json`);
    const allAsterisms = await response.json();

    // Map ID -> Position
    // Use PARSEC_TO_SCENE for realistic stellar distances
    const starPositionMap = new Map<number, THREE.Vector3>();

    // Loop through whatever data we have (Chunk 0 usually)
    starsData.forEach((star: StarData) => {
      const x = (star.x ?? 0) * PARSEC_TO_SCENE;
      const y = (star.z ?? 0) * PARSEC_TO_SCENE;
      const z = -(star.y ?? 0) * PARSEC_TO_SCENE;
      starPositionMap.set(star.id, new THREE.Vector3(x, y, z));
    });

    // Materials with subtle halo effect:
    // - Brighter colors for glow
    // - Lower opacity for ethereal/subtle appearance
    // - Additive blending creates the halo where lines overlap with stars
    const zodiacMaterial = new THREE.LineBasicMaterial({
      color: 0x77aaee, // Brighter blue for visible halo
      transparent: true,
      opacity: 0.45, // Lower opacity for subtle ethereal look
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starMaterial = new THREE.LineBasicMaterial({
      color: 0xbbccee, // Brighter blue-grey for visible halo
      transparent: true,
      opacity: 0.35, // Lower opacity for subtle ethereal look
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    let zodiacCount = 0;
    let otherCount = 0;

    for (const [asterismId, lineStrips] of Object.entries(allAsterisms) as [string, number[][]][]) {
      const isZodiac = ZODIAC_IDS.includes(asterismId);
      const targetGroup = isZodiac ? zodiacGroup : asterismsGroup;
      const material = isZodiac ? zodiacMaterial : starMaterial;

      for (const starIds of lineStrips) {
        const points: THREE.Vector3[] = [];
        let missing = false;
        for (const id of starIds) {
          const pos = starPositionMap.get(id);
          if (pos) points.push(pos);
          else missing = true;
        }

        if (!missing && points.length >= 2) {
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, material);
          line.userData = { type: 'asterism', id: asterismId };
          targetGroup.add(line);
        }
      }
      if (isZodiac) zodiacCount++;
      else otherCount++;
    }
    Logger.log(`Created ${zodiacCount} zodiacs and ${otherCount} other asterisms.`);
  } catch (err) {
    Logger.error('Error creating asterisms', err);
  }
}

export async function createConstellations(group: THREE.Group): Promise<void> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}assets/constellations.bounds.geojson`);
    if (!response.ok) throw new Error('Failed to fetch constellation boundaries');

    const json = await response.json();

    const material = new THREE.LineBasicMaterial({
      color: 0x556677, // Subtle slate blue/grey with slight glow
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // Don't block stars
    });

    // Match zodiac sign distance: 100 parsecs
    const RADIUS = PARSEC_TO_SCENE * 100;

    // Local types for constrained GeoJSON
    type Coordinate = [number, number];
    type Ring = Coordinate[];
    type Polygon = Ring[];
    type MultiPolygon = Polygon[];

    interface Geometry {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: Polygon | MultiPolygon;
    }

    interface Feature {
      geometry: Geometry;
      id?: string;
      properties?: { name?: string; [key: string]: unknown };
    }

    // Process constellations
    (json.features as Feature[]).forEach((feature) => {
      if (!feature.geometry) return;

      const type = feature.geometry.type;
      const allRings: Ring[] = [];

      if (type === 'Polygon') {
        // [ [ [ra, dec], ... ] ]
        // Cast is necessary because union type access needs narrowing
        allRings.push(...(feature.geometry.coordinates as Polygon));
      } else if (type === 'MultiPolygon') {
        // [ [ [ [ra, dec], ... ] ], ... ]
        (feature.geometry.coordinates as MultiPolygon).forEach((polygon) => {
          allRings.push(...polygon);
        });
      }

      allRings.forEach((ring) => {
        const points: THREE.Vector3[] = [];
        ring.forEach(([ra, dec]: [number, number]) => {
          // RA is usually 0-360 or 0-24h (GeoJSON usually decimal degrees 0-360 or -180 to 180)
          // Dec is -90 to 90

          // GeoJSON use [long, lat] -> [RA, Dec]
          // Ideally RA increases Eastward.
          // 3D conversion:
          const raRad = THREE.MathUtils.degToRad(ra);
          const decRad = THREE.MathUtils.degToRad(dec);

          // Standard Celestial (Z=North, X=Vernal)
          // x = r * cos(dec) * cos(ra)
          // y = r * cos(dec) * sin(ra)
          // z = r * sin(dec)
          const xRaw = RADIUS * Math.cos(decRad) * Math.cos(raRad);
          const yRaw = RADIUS * Math.cos(decRad) * Math.sin(raRad);
          const zRaw = RADIUS * Math.sin(decRad);

          // Swizzle to Scene (Y=North, X=Vernal, Z=-RA 6h)
          // Scene X = xRaw
          // Scene Y = zRaw
          // Scene Z = -yRaw
          points.push(new THREE.Vector3(xRaw, zRaw, -yRaw));
        });

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        line.userData = { type: 'constellation', id: feature.id || feature.properties?.id };
        group.add(line);
      });
    });

    Logger.log('Created constellation boundaries from GeoJSON');
  } catch (err) {
    Logger.error('Failed to load constellations', err);
  }
}
