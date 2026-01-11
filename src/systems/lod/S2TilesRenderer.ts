import { TilesRenderer } from '3d-tiles-renderer';
import { Box3, Sphere } from 'three';
import { S2Geometry } from '../../utils/S2Geometry';

export class S2TilesRenderer extends TilesRenderer {
  public ellipsoidRadii: number[] = [1737400, 1737400, 1737400];

  constructor(url: string, moonRadius: number = 1737400) {
    super(url);
    this.ellipsoidRadii = [moonRadius, moonRadius, moonRadius];
  }

  // Override preprocessNode to inject S2 Bounding Volume logic
  // @ts-ignore
  public preprocessNode(tile: any, tileJson: any, parentTile: any) {
    super.preprocessNode(tile, tileJson, parentTile);

    let s2Face = -1;
    let s2X = 0;
    let s2Y = 0;
    let s2Zoom = 0;
    let minH = -10000;
    let maxH = 10000;

    let isS2 = false;

    // 1. Explicit S2 Extension (Root Face Nodes or explicit children)
    if (tileJson && tileJson.extensions && tileJson.extensions['3DTILES_bounding_volume_S2']) {
      const s2Data = tileJson.extensions['3DTILES_bounding_volume_S2'];
      console.log('S2TilesRenderer: Found S2 Extension in Root', s2Data);
      const token = s2Data.token;
      const firstChar = token[0];
      switch (firstChar) {
        case '1':
          s2Face = 0;
          break;
        case '3':
          s2Face = 1;
          break;
        case '5':
          s2Face = 2;
          break;
        case '7':
          s2Face = 3;
          break;
        case '9':
          s2Face = 4;
          break;
        case 'b':
          s2Face = 5;
          break;
      }
      s2Zoom = 0;
      s2X = 0;
      s2Y = 0;
      minH = s2Data.minimumHeight;
      maxH = s2Data.maximumHeight;
      isS2 = true;
    } else if (
      tileJson &&
      tileJson.boundingVolume &&
      tileJson.boundingVolume.extensions &&
      tileJson.boundingVolume.extensions['3DTILES_bounding_volume_S2']
    ) {
      const s2Data = tileJson.boundingVolume.extensions['3DTILES_bounding_volume_S2'];
      console.log('S2TilesRenderer: Found S2 Extension in BoundingVolume', s2Data);
      const token = s2Data.token;
      const firstChar = token[0];
      switch (firstChar) {
        case '1':
          s2Face = 0;
          break;
        case '3':
          s2Face = 1;
          break;
        case '5':
          s2Face = 2;
          break;
        case '7':
          s2Face = 3;
          break;
        case '9':
          s2Face = 4;
          break;
        case 'b':
          s2Face = 5;
          break;
      }
      s2Zoom = 0;
      s2X = 0;
      s2Y = 0;
      minH = s2Data.minimumHeight;
      maxH = s2Data.maximumHeight;
      isS2 = true;
    }

    // 2. Implicit / URI-based detection for Children
    if (!isS2 && tile.content && tile.content.uri) {
      const resolvedMatch = tile.content.uri.match(/content\/(\d+)\/(\d+)_(\d+)_(\d+)\.glb/);
      const templateMatch = tile.content.uri.match(
        /content\/(\d+)\/.*(?:\{level\}|%7Blevel%7D).*\.glb/
      );

      if (resolvedMatch) {
        s2Face = parseInt(resolvedMatch[1]);
        s2Zoom = parseInt(resolvedMatch[2]);
        s2X = parseInt(resolvedMatch[3]);
        s2Y = parseInt(resolvedMatch[4]);

        if (parentTile && parentTile.userData && parentTile.userData.s2MinH !== undefined) {
          minH = parentTile.userData.s2MinH;
          maxH = parentTile.userData.s2MaxH;
        }
        isS2 = true;
      } else if (templateMatch) {
        console.log('S2TilesRenderer: Detected Template URI for S2 Tile');
        s2Face = parseInt(templateMatch[1]);
        s2Zoom = 0;
        s2X = 0;
        s2Y = 0;
        if (parentTile && parentTile.userData && parentTile.userData.s2MinH !== undefined) {
          minH = parentTile.userData.s2MinH;
          maxH = parentTile.userData.s2MaxH;
        }
        isS2 = true;
      }
    }

    if (isS2 && s2Face >= 0) {
      console.log(
        `S2TilesRenderer: Processing S2 Tile Face:${s2Face} Zoom:${s2Zoom} X:${s2X} Y:${s2Y}`
      );

      // Use the full radii vector for precise triaxial bounding boxes
      const box = S2Geometry.getTileBounds(
        s2Face,
        s2X,
        s2Y,
        s2Zoom,
        minH,
        maxH,
        this.ellipsoidRadii
      );

      if (!tile.cached) tile.cached = {};
      tile.cached.box = box;
      tile.cached.sphere = new Box3()
        .copy(box)
        .getBoundingSphere(tile.cached.sphere || new Sphere());

      tile.boundingVolume = tile.cached.box;

      if (!tile.userData) tile.userData = {};

      tile.userData.s2Face = s2Face;
      tile.userData.s2Zoom = s2Zoom;
      tile.userData.s2X = s2X;
      tile.userData.s2Y = s2Y;
      tile.userData.s2MinH = minH;
      tile.userData.s2MaxH = maxH;

      // FIX: 3d-tiles-renderer might not replace URI templates for explicit root tiles
      if (tile.content && tile.content.uri && typeof tile.content.uri === 'string') {
        let uri = tile.content.uri;
        console.log('S2TilesRenderer: Checking URI for templates:', uri);
        if (uri.includes('{level}') || uri.includes('%7Blevel%7D')) {
          console.log('S2TilesRenderer: Replacing templates in URI');
          tile.content.uri = uri
            .replace(/\{level\}/g, s2Zoom.toString())
            .replace(/\{x\}/g, s2X.toString())
            .replace(/\{y\}/g, s2Y.toString())
            .replace(/%7Blevel%7D/g, s2Zoom.toString())
            .replace(/%7Bx%7D/g, s2X.toString())
            .replace(/%7By%7D/g, s2Y.toString());
          console.log('S2TilesRenderer: New URI:', tile.content.uri);
        }
      }
    }
  }
}
