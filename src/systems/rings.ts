/**
 * @file rings.ts
 * @description Planetary ring geometry creation with procedural Saturn ring texture.
 *
 * This file creates ring meshes for planets (currently Saturn) using Three.js RingGeometry.
 * It includes a high-quality procedural texture generator that accurately represents Saturn's
 * ring structure including the C, B, and A rings, Cassini Division, and Encke Gap.
 *
 * Key features:
 * - RingGeometry: 128 radial segments for smooth appearance
 * - Custom UV mapping: Maps radius to texture V-coordinate for proper gradient application
 * - Procedural Saturn texture: 1024px canvas with gradient stops matching real ring structure
 * - Ring divisions: C Ring (faint), B Ring (bright), Cassini Division (dark gap), A Ring (moderate), Encke Gap
 * - Double-sided rendering: Rings visible from both above and below
 * - Texture fallback: Supports loading external ring textures for other planets
 * - Orientation: Automatically rotated to lie flat in planet's equatorial plane
 *
 * The procedural texture uses carefully calibrated color stops based on Cassini imagery to create
 * a visually accurate representation of Saturn's complex ring system.
 */
import * as THREE from 'three';
import { textureManager } from '../managers/TextureManager';

/**
 * Creates a ring mesh for a planet
 * @param {Object} data - Planet data object containing ring specifications
 * @param {THREE.Mesh} mesh - The planet mesh to attach the ring to
 */
import type { CelestialBodyData } from '../types';

export function createRing(data: CelestialBodyData, mesh: THREE.Mesh): void {
  if (!data.ring) return;

  const ringGeo = new THREE.RingGeometry(data.ring.inner, data.ring.outer, 128); // Increased segments for smoothness

  // Adjust UV mapping for ring geometry to work with linear gradient texture
  const pos = ringGeo.attributes.position;
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    // Map radius to V coordinate (0 to 1)
    const radius = v3.length();
    // Normalize radius between inner and outer
    const v = (radius - data.ring.inner) / (data.ring.outer - data.ring.inner);
    ringGeo.attributes.uv.setXY(i, v, 0);
  }

  let ringMat: THREE.Material;
  if (data.name === 'Saturn') {
    // Procedural texture for Saturn
    const ringTexture = createSaturnRingTexture();
    ringMat = new THREE.MeshStandardMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      roughness: 0.8,
      metalness: 0.2,
    });
  } else if (data.ring.texture) {
    ringMat = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
    });
    textureManager.loadTexture(data.ring.texture, ringMat, data.name);
  } else {
    ringMat = new THREE.MeshStandardMaterial({
      color: data.ring.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
  }
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  mesh.add(ring);
}

/**
 * Generates a high-quality procedural texture for Saturn's rings
 * @returns {THREE.CanvasTexture} The generated texture
 */
function createSaturnRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  const gradient = context.createLinearGradient(0, 0, 1024, 0);

  // Color stops based on Saturn's ring structure (C, B, A rings)
  // 0.0 is inner edge, 1.0 is outer edge

  // C Ring (faint, transparent)
  gradient.addColorStop(0.0, 'rgba(30, 30, 30, 0.0)');
  gradient.addColorStop(0.1, 'rgba(30, 30, 30, 0.1)');
  gradient.addColorStop(0.15, 'rgba(40, 40, 40, 0.2)');

  // B Ring (bright, dense)
  gradient.addColorStop(0.25, 'rgba(180, 170, 150, 0.8)');
  gradient.addColorStop(0.35, 'rgba(200, 190, 170, 0.9)');
  gradient.addColorStop(0.4, 'rgba(210, 200, 180, 1.0)');
  gradient.addColorStop(0.45, 'rgba(190, 180, 160, 0.9)');
  gradient.addColorStop(0.5, 'rgba(170, 160, 140, 0.8)');

  // Cassini Division (dark gap)
  gradient.addColorStop(0.55, 'rgba(20, 20, 20, 0.1)');
  gradient.addColorStop(0.58, 'rgba(20, 20, 20, 0.1)');

  // A Ring (moderate brightness)
  gradient.addColorStop(0.6, 'rgba(160, 150, 130, 0.7)');
  gradient.addColorStop(0.7, 'rgba(170, 160, 140, 0.8)');
  gradient.addColorStop(0.8, 'rgba(160, 150, 130, 0.7)');

  // Encke Gap (small gap)
  gradient.addColorStop(0.85, 'rgba(20, 20, 20, 0.2)');
  gradient.addColorStop(0.86, 'rgba(20, 20, 20, 0.2)');

  // Outer A Ring
  gradient.addColorStop(0.88, 'rgba(150, 140, 120, 0.6)');
  gradient.addColorStop(1.0, 'rgba(140, 130, 110, 0.0)'); // Fade out

  context.fillStyle = gradient;
  context.fillRect(0, 0, 1024, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
