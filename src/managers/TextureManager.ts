import * as THREE from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { Logger } from '../utils/logger';

interface TextureQueueItem {
  originalPath: string;
  material: THREE.Material;
  stage: number;
  priority: number;
  mapType: string;
  onLoad?: () => void;
}

interface RegistryItem {
  originalPath: string;
  material: THREE.Material;
  priority: number;
  mapType: string;
  onLoad?: () => void;
}

export class TextureManager {
  queue: TextureQueueItem[];
  textureLoader: THREE.TextureLoader;
  ktx2Loader: KTX2Loader;
  maxConcurrent: number;
  activeRequests: number;
  priorityBodies: string[];
  registry: Record<string, RegistryItem>;
  manifest: Set<string> | null;
  manifestLoading: boolean;
  ktx2Cache: Map<string, THREE.Texture>;

  constructor() {
    this.queue = [];
    this.textureLoader = new THREE.TextureLoader();

    // Initialize KTX2Loader
    this.ktx2Loader = new KTX2Loader();
    this.ktx2Loader.setTranscoderPath('basis/');

    // Detect renderer to initialize KTX2Loader properly
    // We need a renderer to init the KTX2Loader, but we might not have it yet.
    // It's often better to pass the renderer in an init method or access it globally if possible.
    // However, KTX2Loader *can* work without a renderer for pure transcoding if configured,
    // but usually needs detectSupport(renderer).
    // For now, we'll try to lazily initialize or assume standard support.
    // Ideally, we should call this.ktx2Loader.detectSupport(renderer) once we have the renderer.
    // We will add a Setup method to be called from Simulation.ts or similar.

    this.maxConcurrent = 6; // Browser limit is usually 6 per domain
    this.activeRequests = 0;

    // Priority 0 bodies (Highest)
    this.priorityBodies = ['Sun', 'Jupiter', 'Saturn', 'Neptune', 'Earth'];

    // Registry to store texture info for on-demand loading
    this.registry = {};

    // Manifest for texture existence check
    this.manifest = null;
    this.manifestLoading = false;

    // KTX2 Cache (Simple path key)
    this.ktx2Cache = new Map();

    this.loadManifest();
  }

  /**
   * Initialize KTX2Loader with the renderer.
   * Must be called after the WebGLRenderer is created.
   */
  setupKTX2(renderer: THREE.WebGLRenderer) {
    this.ktx2Loader.detectSupport(renderer);
    Logger.log('TextureManager: KTX2Loader initialized with renderer support');
  }

  async loadManifest() {
    if (this.manifestLoading) return;
    this.manifestLoading = true;

    try {
      const response = await fetch('assets/textures.json');
      if (!response.ok) throw new Error('Manifest not found');
      const files = await response.json();
      this.manifest = new Set(files);
      Logger.log(`TextureManager: Loaded manifest with ${this.manifest.size} files`);
    } catch (err) {
      Logger.warn(
        'TextureManager: Failed to load texture manifest, falling back to trial-and-error',
        err
      );
      this.manifest = null; // Null means "don't filter"
    } finally {
      this.manifestLoading = false;
      this.processQueue();
    }
  }

  /**
   * Queue texture loading for a body
   * @param {string} originalPath - The original path to the texture (e.g. assets/textures/earth.jpg)
   * @param {THREE.Material} material - The material to apply the texture to
   * @param {string} bodyName - Name of the body for priority
   * @param {boolean} isMoon - Whether it's a moon
   * @param {string} moonCategory - Category of the moon (largest, major, small)
   * @param {string} mapType - The material property to assign the texture to (default: 'map')
   */
  loadTexture(
    originalPath: string,
    material: THREE.Material,
    bodyName: string,
    isMoon: boolean = false,
    moonCategory: string | null = null,
    mapType: string = 'map',
    onLoad?: () => void
  ) {
    // Check if it's a KTX2 file directly
    if (originalPath.toLowerCase().endsWith('.ktx2')) {
      this.loadKTX2Direct(originalPath, material, mapType, onLoad);
      return;
    }

    // Determine priority score (Lower is better)
    let priority = 100; // Default (Other planets/moons)

    const priorityIndex = this.priorityBodies.indexOf(bodyName);
    if (priorityIndex !== -1) {
      priority = priorityIndex; // 0 to 4 for Sun...Earth
    } else if (isMoon && moonCategory === 'largest') {
      priority = 10;
    }

    // Store in registry for on-demand highres loading
    this.registry[bodyName] = {
      originalPath,
      material,
      priority,
      mapType,
      onLoad,
    };

    // Add stages to queue
    // Stage 0: Lowres
    // Stage 0.5: Original (Fallback/Base) - SKIPPED (Files moved to subfolders)
    // Stage 1: Midres
    // Stage 2: Highres (DEFERRED - Loaded via loadHighRes)

    this.addToQueue(originalPath, material, 0, priority, mapType, onLoad);
    // this.addToQueue(originalPath, material, 0.5, priority, mapType); // Skip original path as files are in subfolders
    this.addToQueue(originalPath, material, 1, priority, mapType, onLoad);
    // this.addToQueue(originalPath, material, 2, priority, mapType); // Defer highres

    this.processQueue();
  }

  /**
   * Loads a KTX2 texture directly without the multi-stage system
   */
  loadKTX2Direct(path: string, material: THREE.Material, mapType: string, onLoad?: () => void) {
    // Check Cache
    if (this.ktx2Cache.has(path)) {
      const texture = this.ktx2Cache.get(path)!;
      // Re-assign handling
      this.assignTextureToMaterial(texture, material, mapType);

      Logger.log(`TextureManager: [CACHE HIT] Reusing KTX2 ${path}`);
      if (onLoad) onLoad();
      return;
    }

    Logger.log(`TextureManager: [START] Loading KTX2 Direct: ${path}`);
    this.ktx2Loader.load(
      path,
      (texture) => {
        Logger.log(
          `TextureManager: [SUCCESS] Loaded KTX2 ${path} (${texture.image.width}x${texture.image.height})`
        );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Add to Cache
        this.ktx2Cache.set(path, texture);

        this.assignTextureToMaterial(texture, material, mapType);

        material.needsUpdate = true;
        if (onLoad) onLoad();
      },
      undefined,
      (err) => {
        Logger.error(`TextureManager: Failed to load KTX2 ${path}`, err);
        console.error(`TextureManager: Failed to load KTX2 ${path}`, err);
      }
    );
  }

  private assignTextureToMaterial(
    texture: THREE.Texture,
    material: THREE.Material,
    mapType: string
  ) {
    // Handle custom shaders or standard materials
    if ('uniforms' in material && (material as THREE.ShaderMaterial).uniforms[mapType]) {
      // Logger.log(`TextureManager: Assigning to material.uniforms.${mapType}`);
      (material as THREE.ShaderMaterial).uniforms[mapType].value = texture;
    } else {
      // Logger.log(`TextureManager: Assigning to material['${mapType}']`);
      (material as unknown as Record<string, unknown>)[mapType] = texture;
    }
    material.needsUpdate = true;
  }

  /**
   * Triggers loading of the high-resolution texture for a specific body
   * @param {string} bodyName - Name of the body to load highres for
   */
  loadHighRes(bodyName: string) {
    const item = this.registry[bodyName];
    if (!item) return;

    // Check if already loaded or queued (optimization)
    // For now, just add to queue, TextureManager handles duplicates/updates logic
    this.addToQueue(item.originalPath, item.material, 2, item.priority, item.mapType, item.onLoad);
    this.processQueue();
  }

  addToQueue(
    originalPath: string,
    material: THREE.Material,
    stage: number,
    priority: number,
    mapType: string = 'map',
    onLoad?: () => void
  ) {
    this.queue.push({
      originalPath,
      material,
      stage,
      priority,
      mapType,
      onLoad,
    });

    // Sort queue:
    // 1. Highres (Stage 2) - User initiated, highest priority
    // 2. Stage (Low -> Original -> Mid)
    // 3. Priority (Sun -> Jupiter -> ... -> Others)
    this.queue.sort((a, b) => {
      // Prioritize Stage 2 (Highres)
      if (a.stage === 2 && b.stage !== 2) return -1;
      if (b.stage === 2 && a.stage !== 2) return 1;

      if (a.stage !== b.stage) return a.stage - b.stage;
      return a.priority - b.priority;
    });
  }

  processQueue() {
    if (this.manifestLoading) return; // Wait for manifest
    if (this.activeRequests >= this.maxConcurrent || this.queue.length === 0) return;

    const item = this.queue.shift();
    if (!item) return;

    this.activeRequests++;

    // Determine candidate paths
    const candidatePaths = [];

    if (item.stage === 0) {
      // Lowres: Try .webp first, then original extension
      candidatePaths.push(this.getPathForStage(item.originalPath, 'lowres', 'webp'));
      candidatePaths.push(this.getPathForStage(item.originalPath, 'lowres'));
    } else if (item.stage === 1) {
      // Midres: Try .webp first, then original extension
      candidatePaths.push(this.getPathForStage(item.originalPath, 'midres', 'webp'));
      candidatePaths.push(this.getPathForStage(item.originalPath, 'midres'));
    } else if (item.stage === 2) {
      // Highres: Try .webp first, then original extension
      candidatePaths.push(this.getPathForStage(item.originalPath, 'highres', 'webp'));
      candidatePaths.push(this.getPathForStage(item.originalPath, 'highres'));
    } else {
      // Stage 0.5: Original path
      candidatePaths.push(item.originalPath);
    }

    this.tryLoadTexture(candidatePaths, item);

    // Trigger next immediately to maximize throughput
    this.processQueue();
  }

  tryLoadTexture(paths: string[], item: TextureQueueItem) {
    // Filter paths using manifest if available
    let validPaths = paths;
    if (this.manifest) {
      const manifest = this.manifest;
      validPaths = paths.filter((p) => {
        // TextureManager paths are like "assets/textures/lowres/earth.webp"
        // Manifest paths are also relative to public, e.g. "assets/textures/lowres/earth.webp"
        // We need to ensure format matches.
        // Remove leading slash if present for comparison
        const normalizedPath = p.startsWith('/') ? p.slice(1) : p;
        return manifest.has(normalizedPath);
      });

      if (validPaths.length === 0 && paths.length > 0) {
        // Logger.log(
        //   `TextureManager: Skipped ${item.originalPath} (Stage ${item.stage}) - No valid files in manifest`
        // );
        // If all filtered out, treat as failure for this stage
        // But we shouldn't just drop it if it's the only stage?
        // If validPaths is empty, tryLoadTexture will handle it below (paths.length === 0 check)
      }
    }

    if (validPaths.length === 0) {
      // Logger.warn(
      //   `TextureManager: All candidates failed for ${item.originalPath} (Stage ${item.stage})`
      // );
      // All attempts failed (or filtered out)
      this.activeRequests--;
      this.processQueue();
      return;
    }

    const currentPath = validPaths.shift();
    if (!currentPath) return;

    this.textureLoader.load(
      currentPath,
      (texture) => {
        Logger.log(`TextureManager: Loaded ${currentPath} successfully`);
        // Success
        if (
          !item.material.userData.currentStage ||
          item.stage >= item.material.userData.currentStage
        ) {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;

          // Apply texture to the specified property (map, alphaMap, etc.)

          (item.material as unknown as Record<string, unknown>)[item.mapType] = texture;

          // Reset color to white so texture shows
          const mat = item.material as THREE.MeshStandardMaterial; // or MeshBasic, both have color
          if (mat.color?.setHex) mat.color.setHex(0xffffff);

          item.material.needsUpdate = true;
          item.material.userData.currentStage = item.stage;
          Logger.log(`TextureManager: Applied ${currentPath} to material`);

          if (item.onLoad) {
            item.onLoad();
          }
        } else {
          Logger.log(
            `TextureManager: Skipped applying ${currentPath} (current stage ${item.material.userData.currentStage} >= ${item.stage})`
          );
        }

        this.activeRequests--;
        this.processQueue();
      },
      undefined,
      (err) => {
        Logger.warn(`TextureManager: Failed to load ${currentPath}`, err);
        // Error - try next path
        this.tryLoadTexture(paths, item);
      }
    );
  }

  getPathForStage(path: string, subfolderName: string, newExtension: string | null = null) {
    // path is like ".../assets/textures/earth.jpg"
    // We want to insert subfolderName before the filename
    // And optionally change the extension

    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex === -1) return path;

    const directory = path.substring(0, lastSlashIndex);
    let filename = path.substring(lastSlashIndex + 1);

    if (newExtension) {
      const lastDotIndex = filename.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        filename = `${filename.substring(0, lastDotIndex)}.${newExtension}`;
      }
    }

    return `${directory}/${subfolderName}/${filename}`;
  }
}

export const textureManager = new TextureManager();
