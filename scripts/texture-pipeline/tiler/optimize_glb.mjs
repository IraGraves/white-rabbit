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
  encode: async (content, _mimeType, options) => {
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

        const args = ['--t2'];

        if (options.mode === 'uastc') {
          args.push('--encode', 'uastc');
          args.push('--uastc_quality', String(options.uastc_quality || 2));
          if (options.zstd > 0) {
            args.push('--zstd', String(options.zstd));
          }
        } else {
          // Default: ETC1S
          args.push('--encode', 'etc1s');
          args.push('--clevel', String(Math.max(0, Math.min(5, options.effort || 1))));
          args.push('--qlevel', String(Math.max(1, Math.min(255, options.quality || 128))));
        }

        args.push(tempOutput, tempInput);

        console.log(`toktx args: ${args.join(' ')}`);
        const child = spawn(KTX_PATH, args);

        child.on('error', (err) => {
          cleanup();
          reject(err);
        });

        const stderr = [];
        child.stderr.on('data', (data) => {
          stderr.push(data);
        });

        child.on('close', (code) => {
          if (code !== 0) {
            cleanup();
            const errOutput = Buffer.concat(stderr).toString();
            console.error(`toktx error output: ${errOutput}`);
            reject(new Error(`toktx failed with code ${code}: ${errOutput}`));
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

// Args: input_file output_file ktx_quality ktx_effort draco_speed quant_pos ktx_mode ktx_uastc_q ktx_zstd
const args = process.argv.slice(2);
if (args.length < 6) {
  console.error(
    'Usage: node optimize_glb.mjs input output ktx_q ktx_eff draco_spd quant_pos ktx_mode ktx_uastc_q ktx_zstd'
  );
  process.exit(1);
}

const inputPath = args[0];
const outputPath = args[1];
const ktxQuality = parseInt(args[2]);
const ktxEffort = parseInt(args[3]);
const dracoSpeed = parseInt(args[4]);
const quantPos = parseInt(args[5]);

const ktxMode = args[6] || 'etc1s';
const uastcQuality = parseInt(args[7] || '2');
const zstdLevel = parseInt(args[8] || '0');

async function optimize() {
  try {
    const io = new NodeIO()
      .registerExtensions([KHRDracoMeshCompression, KHRMeshQuantization, KHRTextureBasisu])
      .registerDependencies({
        'draco3d.decoder': await draco3d.createDecoderModule(),
        'draco3d.encoder': await draco3d.createEncoderModule(),
      });

    const doc = await io.read(inputPath);

    const materials = doc.getRoot().listMaterials();
    const texturesToCompress = new Set();

    // 1. KTX2 Compression (Using Custom V4 Encoder)
    if (fs.existsSync(KTX_PATH) && ktxMode !== 'none') {
      console.log(`Applying KTX2 compression (${ktxMode})...`);

      // Collect textures and decide per-texture if we skip KTX2
      for (const mat of materials) {
        const extras = mat.getExtras() || {};
        const isHeightmapMat = extras.proprietary_format === 's2_heightmap_v1';

        const baseColorTex = mat.getBaseColorTexture();
        if (baseColorTex) texturesToCompress.add(baseColorTex);

        // Standard normal maps are skipped by this script's collector logic if not explicitly added
        // const normalTex = mat.getNormalTexture();

        const emissiveTex = mat.getEmissiveTexture();
        if (emissiveTex) {
          if (isHeightmapMat) {
            console.log(
              `Skipping KTX2 for heightmap texture: ${emissiveTex.getName() || 'emissive'}`
            );
          } else {
            texturesToCompress.add(emissiveTex);
          }
        }

        if (mat.getMetallicRoughnessTexture())
          texturesToCompress.add(mat.getMetallicRoughnessTexture());
        if (mat.getOcclusionTexture()) texturesToCompress.add(mat.getOcclusionTexture());
      }

      for (const texture of texturesToCompress) {
        const content = texture.getImage();
        const mimeType = texture.getMimeType();

        if (toktxEncoder.test(mimeType)) {
          try {
            console.log(`Compressing ${texture.getName() || 'texture'} (${ktxMode})...`);
            const compressed = await toktxEncoder.encode(content, mimeType, {
              mode: ktxMode,
              quality: ktxQuality,
              effort: ktxEffort,
              uastc_quality: uastcQuality,
              zstd: zstdLevel,
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

    // 2. Draco Compression (Skip if speed < 0)
    if (dracoSpeed >= 0) {
      console.log(`Applying Draco compression (speed: ${dracoSpeed})...`);
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
    } else {
      console.log('Skipping Draco compression (requested).');
    }

    // 3. KTX2 Extension
    if (fs.existsSync(KTX_PATH)) {
      doc.createExtension(KHRTextureBasisu).setRequired(true);
    }

    await io.write(outputPath, doc);

    // Detailed Summary for Python to capture
    const compressedList = Array.from(texturesToCompress)
      .map((t) => t.getName() || 'Unknown')
      .join(', ');
    const skippedList = materials
      .filter((m) => (m.getExtras() || {}).proprietary_format === 's2_heightmap_v1')
      .map((m) => 'Heightmap')
      .join(', ');

    console.log(`[OPT_SUMMARY] KTX2: [${compressedList}] | Skipped: [${skippedList}]`);
  } catch (e) {
    console.error('Optimization failed:', e);
    process.exit(1);
  }
}

optimize();
