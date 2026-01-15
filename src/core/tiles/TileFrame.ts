import * as THREE from 'three';
import { S2Tile } from './S2Tile';

export class TileFrame extends THREE.LineSegments {
  constructor(tile: S2Tile, color: number = 0xffff00) {
    const box = tile.boundingBox;

    // Create geometry from Box3
    const geometry = new THREE.BufferGeometry();
    const indices: number[] = [];
    const vertices: number[] = [];

    const min = box.min;
    const max = box.max;

    // 8 corners
    // 0: min.x, min.y, min.z
    // 1: max.x, min.y, min.z
    // 2: max.x, max.y, min.z
    // 3: min.x, max.y, min.z
    // 4: min.x, min.y, max.z
    // 5: max.x, min.y, max.z
    // 6: max.x, max.y, max.z
    // 7: min.x, max.y, max.z

    vertices.push(
      min.x,
      min.y,
      min.z, // 0
      max.x,
      min.y,
      min.z, // 1
      max.x,
      max.y,
      min.z, // 2
      min.x,
      max.y,
      min.z, // 3
      min.x,
      min.y,
      max.z, // 4
      max.x,
      min.y,
      max.z, // 5
      max.x,
      max.y,
      max.z, // 6
      min.x,
      max.y,
      max.z // 7
    );

    // 12 edges (pairs of indices)
    indices.push(
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      0, // Bottom ring
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      4, // Top ring
      0,
      4,
      1,
      5,
      2,
      6,
      3,
      7 // Vertical connection
    );

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    const material = new THREE.LineBasicMaterial({ color: color });

    super(geometry, material);

    this.userData.tileId = tile.id;
  }
}
