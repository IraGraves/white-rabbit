import * as THREE from 'three';

export interface S2HeightmapMaterialUniforms {
  uHeightMap: { value: THREE.Texture | null };
  uColorMap: { value: THREE.Texture | null };
  uAlbedoMap: { value: THREE.Texture | null };
  uHasAlbedo: { value: boolean };
  uMinHeight: { value: number };
  uMaxHeight: { value: number };
  uRadii: { value: THREE.Vector3 };
  uTileParams: { value: THREE.Vector4 }; // [face, zoom, x, y]
  uSunDirWorld: { value: THREE.Vector3 };
  uSunIntensity: { value: number };
  uAmbientIntensity: { value: number };
  uOpacity: { value: number };
  uDisableHeightmap: { value: boolean };
  uHeightEncoding: { value: number };
  uShowNormals: { value: boolean };
  uEnablePanSharpening: { value: boolean };
  uPolarUvMode: { value: number };
}

export class S2HeightmapMaterial extends THREE.ShaderMaterial {
  constructor(params: Partial<S2HeightmapMaterialUniforms> = {}) {
    const uniforms: S2HeightmapMaterialUniforms = {
      uHeightMap: { value: params.uHeightMap?.value ?? null },
      uColorMap: { value: params.uColorMap?.value ?? null },
      uAlbedoMap: { value: params.uAlbedoMap?.value ?? null },
      uHasAlbedo: { value: params.uHasAlbedo?.value ?? false },
      uMinHeight: { value: params.uMinHeight?.value ?? 0 },
      uMaxHeight: { value: params.uMaxHeight?.value ?? 0 },
      uRadii: { value: params.uRadii?.value ?? new THREE.Vector3(1737400, 1737400, 1737400) },
      uTileParams: { value: params.uTileParams?.value ?? new THREE.Vector4(0, 0, 0, 0) },
      uSunDirWorld: {
        value: params.uSunDirWorld?.value ?? new THREE.Vector3(1, 1, 1).normalize(),
      },
      uSunIntensity: { value: params.uSunIntensity?.value ?? 1.0 },
      uAmbientIntensity: { value: params.uAmbientIntensity?.value ?? 0.0 },
      uOpacity: { value: params.uOpacity?.value ?? 1.0 },
      uDisableHeightmap: { value: params.uDisableHeightmap?.value ?? false },
      uHeightEncoding: { value: params.uHeightEncoding?.value ?? 0 },
      uShowNormals: { value: params.uShowNormals?.value ?? false },
      uEnablePanSharpening: { value: params.uEnablePanSharpening?.value ?? true }, // Default to true
      uPolarUvMode: { value: params.uPolarUvMode?.value ?? 0 },
    };

    super({
      uniforms: uniforms as any,
      vertexShader: `
        precision highp float;
        uniform sampler2D uHeightMap;
        uniform vec4 uTileParams; // [face, zoom, tx, ty]
        uniform float uMinHeight;
        uniform float uMaxHeight;
        uniform vec3 uRadii;
        uniform vec3 uSunDirWorld;
        uniform bool uDisableHeightmap;
        uniform int uHeightEncoding; // 0=Legacy (8-bit), 1=RG16 (16-bit)

        varying vec2 vUv;
        varying vec3 vNormalWorld;
        varying vec3 vViewSunDir;
        varying vec3 vViewPosition;

        // Quadratic S2 Warping
        float s2StToUv(float s) {
          if (s >= 0.5) return (1.0 / 3.0) * (4.0 * s * s - 1.0);
          return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s));
        }

        vec3 faceUvToXyz(int face, float u, float v) {
          float su = s2StToUv(u);
          float sv = s2StToUv(v);
          
          vec3 xyz;
          if (face == 0)      { xyz = vec3(1.0, su, sv); }
          else if (face == 1) { xyz = vec3(-su, 1.0, sv); }
          else if (face == 2) { xyz = vec3(-su, -sv, 1.0); }
          else if (face == 3) { xyz = vec3(-1.0, -sv, -su); }
          else if (face == 4) { xyz = vec3(sv, -1.0, -su); }
          else if (face == 5) { xyz = vec3(sv, su, -1.0); }
          
          float r = length(xyz);
          return vec3(xyz.x / r, xyz.z / r, -xyz.y / r);
        }

        float unpackHeight(vec4 color) {
          if (uHeightEncoding == 1) {
            // RG16 Packing: R=High, G=Low
            // Value = (R * 255 * 256 + G * 255) / 65535
            // But texture normalized [0,1]:
            // R_byte = R * 255
            // Val = (R * 255 * 256 + G * 255)
            // Normalized = (R * 256 + G) * 255 / 65535 ??
            // Simpler: Val = R + G/256.0 -> 0..1 range approx?
            // Correct Formula for 16-bit spread across R (high) and G (low):
            // val = (color.r * 255.0 * 256.0 + color.g * 255.0) / 65535.0;
            return (color.r * 65280.0 + color.g * 255.0) / 65535.0;
          } else {
            // Legacy 8-bit grayscale (just Red channel)
            return color.r;
          }
        }

        void main() {
          vUv = uv;
          // SAFEGUARD: Add 0.5 to ensure correct rounding from float to int
          int face = int(uTileParams.x + 0.5); 
          float zoom = uTileParams.y;
          float tx = uTileParams.z;
          float ty = uTileParams.w;
          
          float tileUVSize = 1.0 / pow(2.0, zoom);
          float hRange = uMaxHeight - uMinHeight;
          
          // 1. DISPLACEMENT
          float u = tx * tileUVSize + uv.x * tileUVSize;
          float v = ty * tileUVSize + uv.y * tileUVSize; // REVERTED: Orientation was correct originally.
          vec3 spherePos = faceUvToXyz(face, u, v);

          float h = 0.0;
          if (!uDisableHeightmap) {
            // FLIP Y LOOKUP
            vec2 hUv = (vec2(vUv.x, 1.0 - vUv.y) * 256.0 + 1.5) / 259.0;
            vec4 hColor = texture2D(uHeightMap, hUv);
            h = uMinHeight + unpackHeight(hColor) * hRange;
          }
          
          // PRECISION FIX: Use viewMatrix directly with World Coordinates
          vec4 worldPos = vec4(spherePos * (uRadii + h), 1.0);
          vec4 vPosition = viewMatrix * worldPos;
          vViewPosition = -vPosition.xyz;
          gl_Position = projectionMatrix * vPosition;

          // 2. NORMALS: Robust Plane-based TBN
          vec3 baseNormal = normalize(normalMatrix * spherePos);
          
          if (uDisableHeightmap) {
            vNormalWorld = baseNormal;
          } else {
            float stStep = 1.0 / 256.0;
            
            // Sample neighbors
            vec2 hUv_u0 = (vec2(vUv.x - stStep, 1.0 - vUv.y) * 256.0 + 1.5) / 259.0;
            vec2 hUv_u2 = (vec2(vUv.x + stStep, 1.0 - vUv.y) * 256.0 + 1.5) / 259.0;
            vec2 hUv_v0 = (vec2(vUv.x, 1.0 - (vUv.y - stStep)) * 256.0 + 1.5) / 259.0;
            vec2 hUv_v2 = (vec2(vUv.x, 1.0 - (vUv.y + stStep)) * 256.0 + 1.5) / 259.0;

            float h_u0 = uMinHeight + unpackHeight(texture2D(uHeightMap, hUv_u0)) * hRange;
            float h_u2 = uMinHeight + unpackHeight(texture2D(uHeightMap, hUv_u2)) * hRange;
            float h_v0 = uMinHeight + unpackHeight(texture2D(uHeightMap, hUv_v0)) * hRange;
            float h_v2 = uMinHeight + unpackHeight(texture2D(uHeightMap, hUv_v2)) * hRange;

            float du = (h_u2 - h_u0) * 0.5; 
            float dv = (h_v2 - h_v0) * 0.5; 

            float eps = 0.001;
            vec3 T_ws = (faceUvToXyz(face, tx * tileUVSize + (vUv.x + eps) * tileUVSize, v) - spherePos);
            vec3 B_ws = (faceUvToXyz(face, u, ty * tileUVSize + (vUv.y + eps) * tileUVSize) - spherePos);
            
            float R_avg = (uRadii.x + uRadii.y + uRadii.z) / 3.0;
            float mptX = length(T_ws) * (stStep / eps) * R_avg; 
            float mptY = length(B_ws) * (stStep / eps) * R_avg;

            vec3 localNormal = normalize(vec3(du / mptX, -dv / mptY, 1.0));
            
            vec3 T = normalize(normalMatrix * T_ws);
            vec3 B = normalize(normalMatrix * B_ws);
            vNormalWorld = normalize(T * localNormal.x + B * localNormal.y + baseNormal * localNormal.z);
          }
          
          vViewSunDir = (viewMatrix * vec4(uSunDirWorld, 0.0)).xyz;
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uColorMap;
        uniform sampler2D uAlbedoMap;
        uniform bool uHasAlbedo;
        uniform vec4 uTileParams; // [face, zoom, tx, ty] - for face-specific UV handling
        uniform float uPolarUvMode; // 0-7: different UV transformations for polar faces
        uniform float uSunIntensity;
        uniform float uAmbientIntensity;
        uniform float uOpacity;
        uniform bool uShowNormals;
        uniform bool uEnablePanSharpening;
        varying vec3 vViewSunDir;
        varying vec2 vUv;
        varying vec3 vNormalWorld;
        varying vec3 vViewPosition;

        void main() {
          vec3 normal = normalize(vNormalWorld);
          
          // Show Normals Debug Mode: output normals as RGB colors
          if (uShowNormals) {
            gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
            return;
          }
          
          // Face-specific UV transformation for polar faces
          int face = int(uTileParams.x + 0.5);
          int polarMode = int(uPolarUvMode + 0.5);
          vec2 texUv = vec2(vUv.x, 1.0 - vUv.y); // Default V-flip for equatorial faces
          
          // Face 2 (North Pole) and Face 5 (South Pole) have different UV orientations
          // UV Debug showed:
          // Face 2: Red(U=1) bottom-right, Green(V=1) upper-left - standard orientation
          // Face 5: Red(U=1) bottom-left, Green(V=1) upper-right - U is horizontally flipped
          
          if (face == 2 || face == 5) {
            // Face 2 (North) and Face 5 (South)
            // Default Mode 0: Standard V-flip (matches equatorial)
            if (polarMode == 0) texUv = vec2(vUv.x, 1.0 - vUv.y);
            else if (polarMode == 1) texUv = vec2(vUv.x, vUv.y);        // No flip
            else if (polarMode == 2) texUv = vec2(1.0 - vUv.x, vUv.y);  // H-flip
            else if (polarMode == 3) texUv = vec2(1.0 - vUv.x, 1.0 - vUv.y); // 180
            else if (polarMode == 4) texUv = vec2(vUv.y, vUv.x);        // Transpose
            else if (polarMode == 5) texUv = vec2(1.0 - vUv.y, vUv.x);  // 90 CW
            else if (polarMode == 6) texUv = vec2(vUv.y, 1.0 - vUv.x);  // 90 CCW
            else if (polarMode == 7) texUv = vec2(1.0 - vUv.y, 1.0 - vUv.x);
            else if (polarMode == 8) {
               gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
               return;
            }
          }
          
          vec4 texColor = texture2D(uColorMap, texUv);
          vec3 finalColor = texColor.rgb;
          
          if (uHasAlbedo && uEnablePanSharpening) {
            vec4 albedo = texture2D(uAlbedoMap, texUv);
            
            // Luminance weights (Rec. 601)
            const vec3 W = vec3(0.299, 0.587, 0.114);
            float lumC = dot(finalColor, W);
            float lumA = dot(albedo.rgb, W);

            // 1. Gamma Boost for high-res detail. 
            // Most NAC imagery is linear and very dark; this brings out detail in midtones.
            float detailedLuma = pow(max(lumA, 0.0), 0.75);
            
            // 2. Pan-Sharpening Ratio
            // We want to adopt the detail from the albedo, but anchor it to the color map's brightness.
            float ratio = detailedLuma / max(lumC, 0.001);
            
            // 3. Stabilization Clamp
            // Prevents the moon from becoming a "black hole" if the albedo map is pure black.
            // Also prevents extreme blowouts.
            ratio = clamp(ratio, 0.4, 4.0);
            
            finalColor *= ratio;
          }
          vec4 color = vec4(finalColor, texColor.a);
          vec3 lightDir = normalize(vViewSunDir);
          
          float diffuse = max(dot(normal, lightDir), 0.0) * uSunIntensity;
          float ambient = uAmbientIntensity;
          
          vec3 viewDir = normalize(vViewPosition);
          vec3 reflectDir = reflect(-lightDir, normal);
          float spec = pow(max(dot(reflectDir, viewDir), 0.0), 16.0) * 0.1 * uSunIntensity;
          
          gl_FragColor = vec4(color.rgb * (diffuse + ambient) + spec, uOpacity);
        }
      `,
      // Revert to FrontSide to avoid z-fighting ("simmering")
      side: THREE.FrontSide,

      transparent: false,
      depthWrite: true,
      depthTest: true,
    });
  }
}
