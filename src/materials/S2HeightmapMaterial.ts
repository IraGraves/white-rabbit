import * as THREE from 'three';

export interface S2HeightmapMaterialUniforms {
  uHeightMap: { value: THREE.Texture | null };
  uColorMap: { value: THREE.Texture | null };
  uMinHeight: { value: number };
  uMaxHeight: { value: number };
  uRadii: { value: THREE.Vector3 };
  uTileParams: { value: THREE.Vector4 }; // [face, zoom, x, y]
  uSunDirWorld: { value: THREE.Vector3 };
  uSunIntensity: { value: number };
  uAmbientIntensity: { value: number };
  uOpacity: { value: number };
}

export class S2HeightmapMaterial extends THREE.ShaderMaterial {
  constructor(params: Partial<S2HeightmapMaterialUniforms> = {}) {
    const uniforms: S2HeightmapMaterialUniforms = {
      uHeightMap: { value: params.uHeightMap?.value ?? null },
      uColorMap: { value: params.uColorMap?.value ?? null },
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
    };

    super({
      uniforms: uniforms as any,
      vertexShader: `
        uniform sampler2D uHeightMap;
        uniform vec4 uTileParams; // [face, zoom, tx, ty]
        uniform float uMinHeight;
        uniform float uMaxHeight;
        uniform vec3 uRadii;
        uniform vec3 uSunDirWorld;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vTangent;
        varying vec3 vBitangent;
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
          // SWIZZLE: (x, y, z) -> (x, z, -y) to match mesh.py and S2Geometry.ts
          return vec3(xyz.x / r, xyz.z / r, -xyz.y / r);
        }

        void main() {
          vUv = uv;
          
          int face = int(uTileParams.x);
          float zoom = uTileParams.y;
          float tx = uTileParams.z;
          float ty = uTileParams.w;
          
          float tileUVSize = 1.0 / pow(2.0, zoom);
          float u = tx * tileUVSize + uv.x * tileUVSize;
          float v = ty * tileUVSize + (1.0 - uv.y) * tileUVSize;
          // Reverted Polar Fix: Texture orientation should be consistent across faces.
          // Geometric check confirms GLTF (Top-Down) vs PlaneGeo (Bottom-Up) requires flip for all.
          
          // spherePos was accidentally removed here
          vec3 spherePos = faceUvToXyz(face, u, v);

          // Heightmap Padding Calculation (N=256, Verts=257, Padded=259)
          // valid region is indices 1..257 within 0..258
          // We sample at texel centers: (uv * 256 + 1.5) / 259
          float rawN = 256.0;
          float paddedDim = 259.0;
          vec2 heightUv = (vUv * rawN + 1.5) / paddedDim;
          
          float hRaw = texture2D(uHeightMap, heightUv).r;
          float h = uMinHeight + hRaw * (uMaxHeight - uMinHeight);
          
          // Displace: h and uRadii are in meters
          vec3 displacedPos = spherePos * (uRadii + h);
          
          vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
          vViewPosition = -mvPosition.xyz;
          
          gl_Position = projectionMatrix * mvPosition;
          
          // Build TBN basis for this vertex
          vNormal = normalize(normalMatrix * spherePos);
          
          // Compute tangent/bitangent for S2 grid
          // Tangent is along +U (East-ish), Bitangent is along +V (North-ish)
          // We use a delta relative to the tile size for stability across zoom levels
          float delta = tileUVSize * 0.01;
          vec3 posU = faceUvToXyz(face, u + delta, v);
          vec3 posV = faceUvToXyz(face, u, v + delta);
          
          vTangent = normalize(normalMatrix * (posU - spherePos));
          vBitangent = normalize(normalMatrix * (posV - spherePos));

          vViewSunDir = (viewMatrix * vec4(uSunDirWorld, 0.0)).xyz;
        }
      `,
      fragmentShader: `
        uniform sampler2D uHeightMap;
        uniform sampler2D uColorMap;
        uniform float uMinHeight;
        uniform float uMaxHeight;
        uniform vec3 uRadii;
        uniform float uSunIntensity;
        uniform float uAmbientIntensity;
        uniform float uOpacity;
        varying vec3 vViewSunDir;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vTangent;
        varying vec3 vBitangent;
        varying vec3 vViewPosition;
        uniform vec4 uTileParams;

        void main() {
          // Heightmap Sampling with Padding Calculation (Texel Center)
          float rawN = 256.0;
          float paddedDim = 259.0;
          vec2 heightUv = (vUv * rawN + 1.5) / paddedDim;
          float texelSize = 1.0 / paddedDim; 
          
          // Scharr neighbors
          float h00 = texture2D(uHeightMap, heightUv + vec2(-texelSize, -texelSize)).r;
          float h10 = texture2D(uHeightMap, heightUv + vec2(0.0,        -texelSize)).r;
          float h20 = texture2D(uHeightMap, heightUv + vec2( texelSize, -texelSize)).r;
          float h01 = texture2D(uHeightMap, heightUv + vec2(-texelSize,  0.0)).r;
          float h21 = texture2D(uHeightMap, heightUv + vec2( texelSize,  0.0)).r;
          float h02 = texture2D(uHeightMap, heightUv + vec2(-texelSize,  texelSize)).r;
          float h12 = texture2D(uHeightMap, heightUv + vec2(0.0,         texelSize)).r;
          float h22 = texture2D(uHeightMap, heightUv + vec2( texelSize,  texelSize)).r;

          float hRange = (uMaxHeight - uMinHeight);
          
          // Scharr X (dU)
          float du = (3.0*h00 + 10.0*h01 + 3.0*h02) - (3.0*h20 + 10.0*h21 + 3.0*h22);
          du *= hRange / 32.0;
          
          // Scharr Y (dV)
          float dv = (3.0*h00 + 10.0*h10 + 3.0*h20) - (3.0*h02 + 10.0*h12 + 3.0*h22);
          dv *= hRange / 32.0;
          
          // Compute meters-per-texel for this zoom level
          float zoom = uTileParams.y;
          float R = uRadii.x; 
          float faceSizeMeters = R * 3.14159265 / 2.0;
          float tileSizeMeters = faceSizeMeters / pow(2.0, zoom);
          float metersPerTexel = tileSizeMeters / 256.0;

          // Normal perturbation in tangent space
          // normal = normalize(vec3(-gx, -gy, 1.0))
          // gx = -du/metersPerTexel, gy = -dv/metersPerTexel
          // Flipped signs to fix "inverted" relief (mountains becoming valleys)
          vec3 localNormal = normalize(vec3(-du / metersPerTexel, -dv / metersPerTexel, 1.0));
          
          // Transform to world space
          vec3 worldNormal = normalize(vTangent * localNormal.x + vBitangent * localNormal.y + vNormal * localNormal.z);
          
          // Final Color
          vec4 color = texture2D(uColorMap, vUv);
          
          // Lighting
          vec3 lightDir = normalize(vViewSunDir);
          float diffuse = max(dot(worldNormal, lightDir), 0.0) * uSunIntensity;
          float ambient = uAmbientIntensity;
          float spec = pow(max(dot(reflect(-lightDir, worldNormal), normalize(vViewPosition)), 0.0), 16.0) * 0.1 * uSunIntensity;
          
          gl_FragColor = vec4(color.rgb * (diffuse + ambient) + spec, uOpacity);
        }
      `,
      side: THREE.BackSide,
      transparent: false,
      depthWrite: true,
      depthTest: true,
    });
  }
}
