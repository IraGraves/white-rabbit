const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/assets/textures/LOD/moon/0material0_0.b3dm');

console.log('Checking B3DM file:', filePath);

try {
  const buffer = fs.readFileSync(filePath);
  const magic = buffer.toString('utf8', 0, 4);
  const version = buffer.readUInt32LE(4);
  const byteLength = buffer.readUInt32LE(8);
  const featureTableJSONByteLength = buffer.readUInt32LE(12);
  const featureTableBinaryByteLength = buffer.readUInt32LE(16);
  const batchTableJSONByteLength = buffer.readUInt32LE(20);
  const batchTableBinaryByteLength = buffer.readUInt32LE(24);

  console.log('Size:', buffer.length);
  console.log('Magic:', magic);
  console.log('Version:', version);
  console.log('ByteLength (Header):', byteLength);
  console.log('FeatureTableJSON Length:', featureTableJSONByteLength);
  console.log('FeatureTableBinary Length:', featureTableBinaryByteLength);
  console.log('BatchTableJSON Length:', batchTableJSONByteLength);
  console.log('BatchTableBinary Length:', batchTableBinaryByteLength);

  if (magic !== 'b3dm') {
    console.error('ERROR: Invalid Magic! Not a b3dm file.');
  } else {
    console.log('SUCCESS: Valid B3DM Header.');
  }
} catch (e) {
  console.error('Error reading file:', e);
}
