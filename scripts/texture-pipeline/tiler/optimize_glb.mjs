import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { NodeIO } from '@gltf-transform/core';
import {
  KHRDracoMeshCompression,
  KHRMeshQuantization,
  KHRTextureBasisu,
} from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

// KTX Tools Path (Hardcoded fallback or env)
const KTX_PATH = 'C:\\Program Files\\KTX-Software\\bin\\toktx.exe';

// Custom Encoder wrapper for gltf-transform v4
const toktxEncoder = {
  name: 'toktx',
  test: (mimeType) => mimeType === 'image/png' || mimeType === 'image/jpeg',
  encode: async (content, mimeType, options) => {
    // Only run if image is valid
    if (!content) return null;

    return new Promise((resolve, reject) => {
      const tempInput = path.join(
        process.cwd(),
        `temp_${Math.random().toString(36).substr(2, 9)}.png`
      );
      const tempOutput = tempInput.replace('.png', '.ktx2');

      try {
        fs.writeFileSync(tempInput, content);

        // toktx args: --t2 (KTX2) --genmipmap (optional) --bcmp (compression) level
        // Mapping quality/effort to toktx args roughly
        // For UASTC/ETC1S, we need specific flags.
        // v3 ktx() used ETC1S by default.

        const args = [
          '--t2',
          '--encode',
          'etc1s',
          '--clevel',
          String(Math.max(0, Math.min(5, options.effort || 1))), // compression level (0-5)
          '--qlevel',
          String(Math.max(1, Math.min(255, options.quality || 128))),
          tempOutput,
          tempInput,
        ];

        const child = spawn(KTX_PATH, args);

        child.on('error', (err) => {
          cleanup();
          reject(err);
        });

        child.on('close', (code) => {
          if (code !== 0) {
            cleanup();
            reject(new Error(`toktx failed with code ${code}`));
            return;
          }
          try {
            const compressed = fs.readFileSync(tempOutput);
            cleanup();
            resolve(compressed);
          } catch (e) {
            cleanup();
            reject(e);
          }
        });

        function cleanup() {
          if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
          if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
        }
      } catch (e) {
        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
        reject(e);
      }
    });
  },
};

// Args: input_file output_file ktx_quality ktx_effort draco_speed quant_pos
const args = process.argv.slice(2);
if (args.length < 6) {
  console.error('Usage: node optimize_glb.mjs input output ktx_q ktx_eff draco_spd quant_pos');
  process.exit(1);
}

const inputPath = args[0];
const outputPath = args[1];
const ktxQuality = parseInt(args[2]);
const ktxEffort = parseInt(args[3]);
const dracoSpeed = parseInt(args[4]);
const quantPos = parseInt(args[5]);

async function optimize() {
  try {
    const io = new NodeIO()
      .registerExtensions([KHRDracoMeshCompression, KHRMeshQuantization, KHRTextureBasisu])
      .registerDependencies({
        'draco3d.decoder': await draco3d.createDecoderModule(),
        'draco3d.encoder': await draco3d.createEncoderModule(),
      });

    const doc = await io.read(inputPath);

    // 1. KTX2 Compression (Using Custom V4 Encoder)
    if (fs.existsSync(KTX_PATH)) {
      console.log('Applying KTX2 compression...');
      const materials = doc.getRoot().listMaterials();
      const texturesToCompress = new Set();

      // Collect textures from non-normal slots
      for (const mat of materials) {
        if (mat.getBaseColorTexture()) texturesToCompress.add(mat.getBaseColorTexture());
        if (mat.getEmissiveTexture()) texturesToCompress.add(mat.getEmissiveTexture());
        if (mat.getMetallicRoughnessTexture())
          texturesToCompress.add(mat.getMetallicRoughnessTexture());
        if (mat.getOcclusionTexture()) texturesToCompress.add(mat.getOcclusionTexture());
        // Add other slots if needed (specular, transmission, etc.)
      }

      for (const texture of texturesToCompress) {
        const content = texture.getImage();
        const mimeType = texture.getMimeType();

        if (toktxEncoder.test(mimeType)) {
          try {
            console.log(`Compressing ${texture.getName() || 'texture'}...`);
            const compressed = await toktxEncoder.encode(content, mimeType, {
              quality: ktxQuality,
              effort: ktxEffort,
            });
            if (compressed) {
              texture.setImage(compressed);
              texture.setMimeType('image/ktx2');
              // Update URI extension if present
              const uri = texture.getURI();
              if (uri) {
                texture.setURI(uri.replace(/\.(png|jpg|jpeg)$/i, '.ktx2'));
              }
            }
          } catch (err) {
            console.error(`Failed to compress texture:`, err);
          }
        }
      }
    } else {
      console.warn('[WARN] toktx.exe not found, skipping KTX2 compression.');
    }

    // 2. Draco Compression
    doc
      .createExtension(KHRDracoMeshCompression)
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

    // 3. KTX2 Extension
    if (fs.existsSync(KTX_PATH)) {
      doc.createExtension(KHRTextureBasisu).setRequired(true);
    }

    await io.write(outputPath, doc);
  } catch (e) {
    console.error('Optimization failed:', e);
    process.exit(1);
  }
}

optimize();
