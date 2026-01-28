const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'public/assets/textures/LOD/moon/tileset.json');

// SIMPLIFIED SINGLE TILE TILESET
// Points directly to one b3dm file at root to verify rendering capability.
const content = {
  asset: {
    version: '1.0',
    extras: {
      ion: {
        georeferenced: true,
        movable: true,
      },
    },
  },
  geometricError: 100000.0, // High error to force render
  root: {
    boundingVolume: {
      box: [
        0,
        0,
        0, // Center
        1.5,
        0,
        0, // X Extent (Slightly larger than 1.0)
        0,
        1.5,
        0, // Y Extent
        0,
        0,
        1.5, // Z Extent
      ],
    },
    // Point to a known file (assumed 0material0_0.b3dm exists based on typical structure)
    // If this fails 404, we'll know the file name is wrong.
    content: {
      uri: '0material0_0.b3dm',
    },
    geometricError: 10000.0, // High error on root (previously 0) to force load
    refine: 'REPLACE',
    children: [],
  },
};

console.log('Writing SINGLE TILE debug tileset.json...');
fs.writeFileSync(targetPath, JSON.stringify(content, null, 2), { encoding: 'utf8' });
console.log('Done. Size:', fs.statSync(targetPath).size);
