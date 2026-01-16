import * as THREE from 'three';
import { S2Tile } from './S2Tile';

export class TileFrame extends THREE.Group {
  constructor(tile: S2Tile, color: number = 0xffff00) {
    super();

    // UPDATED: Use OBB instead of AABB
    const obb = tile.obb;

    // 1. OBB Wireframe
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: color });
    const wireframe = new THREE.LineSegments(edges, material);

    // Apply OBB transform to the wireframe mesh/lines
    wireframe.position.copy(obb.center);
    const rotMatrix = new THREE.Matrix4().setFromMatrix3(obb.rotation);
    wireframe.setRotationFromMatrix(rotMatrix);
    wireframe.scale.set(obb.halfSize.x * 2, obb.halfSize.y * 2, obb.halfSize.z * 2);

    this.add(wireframe);

    // 2. Occlusion Point (Red Sphere)
    if (tile.occPoint) {
      const sphereGeo = new THREE.SphereGeometry(obb.halfSize.x * 0.1, 8, 8); // Relative size
      // Fixed size might be better?
      // Let's use a fixed visual size in screen space ideally, but world space is easier.
      // Use a reasonable size like 1% of the moon radius? No, 1/10th of tile size.
      // We can just use a fixed large number like 10km for visibility
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);

      sphere.position.copy(tile.occPoint);
      // Note: TileFrame itself has Identity transform (it's a Group at 0,0,0)
      // So sphere.position in World Space is correct.

      this.add(sphere);
    }

    this.userData.tileId = tile.id;
  }
}
