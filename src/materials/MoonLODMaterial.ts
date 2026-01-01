import * as THREE from 'three';
import { ORIGIN_OFFSET_GLSL } from './MaterialFactory';

/**
 * Custom ShaderMaterial for Moon LOD rendering.
 * It decodes packed data from uTileTexture and combines it with uGlobalTexture.
 *
 * Data Packing:
 * - uGlobalTexture: Base Color (Low frequency)
 * - uTileTexture:
 *   - R: Detail Albedo (Grayscale) -> Multiplies Global Color
 *   - G: Height High Byte
 *   - B: Height Low Byte
 *   - A: Roughness
 */
export class MoonLODMaterial extends THREE.ShaderMaterial {
  constructor(parameters?: THREE.ShaderMaterialParameters) {
    super({
      lights: true, // Enable lighting
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.lights,
        THREE.UniformsLib.common, // For map, uv, etc.
        THREE.UniformsLib.fog, // For fog support
        {
          uGlobalTexture: {
            value: new THREE.DataTexture(
              new Uint8Array([255, 255, 255, 255]),
              1,
              1,
              THREE.RGBAFormat
            ),
          },
          uTileTexture: {
            value: new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat),
          },
          uDisplacementScale: { value: 2.0 }, // Maximum displacement height
          uRoughnessBase: { value: 0.8 },
          uSunDirection: { value: new THREE.Vector3(1, 0, 0) }, // Deprecated
          uSunPosition: { value: new THREE.Vector3(0, 0, 0) }, // Default to 0,0,0 (Heliocentric)
          uCameraWorldPosition: { value: new THREE.Vector3() }, // For origin compensation
          uUVOffset: { value: new THREE.Vector2(0, 0) },
          uUVScale: { value: new THREE.Vector2(1, 1) },
          uTileUVScale: { value: new THREE.Vector2(1, 1) }, // Scale factor for partial tiles
        },
      ]),
      vertexShader: `
        #include <common>
        ${ORIGIN_OFFSET_GLSL}
        #include <uv_pars_vertex>
        #include <color_pars_vertex>
        #include <normal_pars_vertex>
        #include <logdepthbuf_pars_vertex>

        uniform sampler2D uTileTexture;
        uniform float uDisplacementScale;
        
        // Define vGlobalUV if we aren't using the standard vUv for it
        varying vec2 vGlobalUV; 
        
        // Lighting Logic
        // vNormal is defined by normal_pars_vertex if included
        varying vec3 vWorldPosition;

        uniform vec2 uUVOffset;
        uniform vec2 uUVScale;
        
        void main() {
          #include <uv_vertex>
          #include <color_vertex>
          
          // Calculate Global UVs for the global texture sampling
          vGlobalUV = uUVOffset + uv * uUVScale;

          // -- Displacement Logic --
          // Sample packed height data
          // G = High Byte, B = Low Byte
          vec4 tileData = texture2D(uTileTexture, uv);
          float height = tileData.g + (tileData.b / 256.0);
          
          // Apply displacement along normal
          // Use normalize(position) to ensure strictly radial displacement for sphere
          vec3 displacedNormal = normalize(position); 
          vec3 displacedPosition = position + displacedNormal * height * uDisplacementScale;
          
          // -- World Position & Normal --
          // Calculate world position for lighting
          vec4 worldPos = modelMatrix * vec4(displacedPosition, 1.0);
          vWorldPosition = worldPos.xyz;
          
          // Calculate world normal
          // vNormal = normalize(mat3(modelMatrix) * displacedNormal);
          // Recalculate normal based on sphere curvature at displaced position? 
          // For now, keep original normal direction but transformed
          vNormal = normalize(mat3(modelMatrix) * normal);
          
          // -- Origin Compensation --
          vec3 offsetPosition = displacedPosition - uCameraWorldPosition;

          // Standard Three.js transformations
          vec4 mvPosition = modelViewMatrix * vec4(offsetPosition, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          #include <logdepthbuf_vertex>
        }
      `,
      fragmentShader: `
        #include <common>
        #include <uv_pars_fragment>
        #include <color_pars_fragment>
        #include <logdepthbuf_pars_fragment>
        #include <lights_pars_begin> // Needed for ambientLightColor

        uniform sampler2D uGlobalTexture;
        uniform sampler2D uTileTexture;
        uniform float uRoughnessBase;
        uniform vec3 uSunDirection; // CPU-calculated Light Direction
        uniform vec2 uUVOffset;     // Global UV min (u, v) for this tile
        uniform vec2 uUVScale;      // Global UV range (du, dv) for this tile
        uniform vec2 uTileUVScale;  // Scale factor for partial tiles
        
        varying vec2 vGlobalUV;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          #include <logdepthbuf_fragment>

          // Sample Global Texture (Base Color) using Global UVs
          // vec4 globalColor = texture2D(uGlobalTexture, vGlobalUV);
          vec4 globalColor = vec4(1.0, 1.0, 1.0, 1.0);
          
          // Calculate Tile UVs (0..1) for the specific Quadtree Tile
          // tileUV = ((GlobalUV - Offset) / Scale) * TileScale
          vec2 tileUV = ((vGlobalUV - uUVOffset) / uUVScale) * uTileUVScale;
          
          // Sample Tile Texture (Detail + Height)
          vec4 tileData = texture2D(uTileTexture, tileUV);


          // -- Decode Data --
          float detailAlbedo = tileData.r; // Grayscale detail
          float roughness = tileData.a;    // Roughness from Alpha

          // Combine Global Color with Detail
          vec3 baseColor = globalColor.rgb * detailAlbedo;
          // vec3 baseColor = globalColor.rgb; // DEBUG: Ignore tile detail to fix blackout if tiles fail

          // -- Lighting Calculations --
          
          // Normal
          vec3 N = normalize(vNormal);
          
          // Light Direction
          // Use CPU-calculated direction for stability and precision
          vec3 L = normalize(uSunDirection);
          
          // Diffuse Term (Lambert)
          float diffuse = max(dot(N, L), 0.0);
          
          // Ambient Term (from scene's AmbientLight)
          // ambientLightColor is a uniform provided by Three.js when lights: true
          vec3 ambient = ambientLightColor;
          
          // Boost ONLY the lit areas to match Earth
          float diffuseBoost = 1.5; 
          vec3 finalColor = baseColor * ((diffuse * diffuseBoost) + ambient);
          
          // DEBUG: Verify global texture is loading
          // gl_FragColor = vec4(globalColor.rgb, 1.0); 
          
          gl_FragColor = vec4(finalColor, 1.0); 

          #include <tonemapping_fragment>

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    });

    this.setValues(parameters);
  }
}
