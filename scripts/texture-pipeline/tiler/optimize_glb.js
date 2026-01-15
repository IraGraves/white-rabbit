const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { draco, quantize } = require('@gltf-transform/extensions');
const { ktx } = require('@gltf-transform/functions');
const draco3d = require('draco3dgltf');

// Args: input_file output_file ktx_quality ktx_effort draco_speed quant_pos
const args = process.argv.slice(2);
if (args.length < 6) {
  console.error('Usage: optimize_tile.js input output ktx_q ktx_eff draco_spd quant_pos');
  process.exit(1);
}

const inputPath = args[0];
const outputPath = args[1];
const ktxQuality = parseInt(args[2]);
const ktxEffort = parseInt(args[3]); // unused by ktx() function usually, but kept for compat
const dracoSpeed = parseInt(args[4]); // 0-10, passed to both encode/decode usually
const quantPos = parseInt(args[5]);

async function optimize() {
  try {
    const io = new NodeIO().registerExtensions([draco, quantize]).registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    });

    const doc = await io.read(inputPath);

    // 1. KTX2 Compression (ETC1S)
    await doc.transform(
      ktx({
        quality: ktxQuality,
        effort: ktxEffort, // some versions use this
        transferQueue: true,
      })
    );

    // 2. Draco Compression
    // Note: extensions usually applied during write if configured,
    // but we can ensure extension is added.
    doc
      .createExtension(draco)
      .setRequired(true)
      .setEncoderOptions({
        method: 'edgebreaker',
        encodeSpeed: dracoSpeed,
        decodeSpeed: dracoSpeed,
        quantizationBits: {
          POSITION: quantPos,
          NORMAL: 10,
          TEX_COORD: 12,
          COLOR: 8,
          GENERIC: 12,
        },
      });

    await io.write(outputPath, doc);
  } catch (e) {
    console.error('Optimization failed:', e);
    process.exit(1);
  }
}

optimize();
