import * as THREE from 'three';

export interface S2HeightmapMaterialUniforms {
  uHeightMap: { value: THREE.Texture | null };
  uColorMap: { value: THREE.Texture | null };
  uMinHeight: { value: number };
  uMaxHeight: { value: number };
  uRadii: { value: THREE.Vector3 };
  uTileParams: { value: THREE.Vector4 }; // [face, zoom, x, y]
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

        varying vec2 vUv;
        varying vec3 vNormal;
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
          float v = ty * tileUVSize + uv.y * tileUVSize;
          
          // Heightmap Padding Calculation (N=256, Verts=257, Padded=259)
          // valid region is indices 1..257 within 0..258
          float rawN = 256.0;
          float paddedDim = 259.0;
          vec2 heightUv = (vUv * rawN + 1.0) / paddedDim;
          
          float hRaw = texture2D(uHeightMap, heightUv).r;
          float h = uMinHeight + hRaw * (uMaxHeight - uMinHeight);
          
          // Displace
          vec3 displacedPos = spherePos * (uRadii + h);
          
          vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
          vViewPosition = -mvPosition.xyz;
          
          gl_Position = projectionMatrix * mvPosition;
          
          // Initial Normal (Sphere Normal)
          vNormal = normalize(normalMatrix * spherePos);
        }
      `,
      fragmentShader: `
        uniform sampler2D uHeightMap;
        uniform sampler2D uColorMap;
        uniform float uMinHeight;
        uniform float uMaxHeight;
        uniform vec3 uRadii;
        uniform float uOpacity;

        varying vec2 vUv;
        varying vec3 vNormal; // Approximate sphere normal
        varying vec3 vViewPosition;

        void main() {
          // Heightmap Sampling with Padding Calculation
          float rawN = 256.0;
          float paddedDim = 259.0;
          vec2 heightUv = (vUv * rawN + 1.0) / paddedDim;
          float texelSize = 1.0 / paddedDim; 
          
          float hM = texture2D(uHeightMap, heightUv).r;
          
          // Center height in world units
          float height = uMinHeight + hM * (uMaxHeight - uMinHeight);
          
          // Scharr neighbors
          float h00 = texture2D(uHeightMap, heightUv + vec2(-texelSize, -texelSize)).r;
          float h10 = texture2D(uHeightMap, heightUv + vec2(0.0,        -texelSize)).r;
          float h20 = texture2D(uHeightMap, heightUv + vec2( texelSize, -texelSize)).r;
          float h01 = texture2D(uHeightMap, heightUv + vec2(-texelSize,  0.0)).r;
          float h21 = texture2D(uHeightMap, heightUv + vec2( texelSize,  0.0)).r;
          float h02 = texture2D(uHeightMap, heightUv + vec2(-texelSize,  texelSize)).r;
          float h12 = texture2D(uHeightMap, heightUv + vec2(0.0,         texelSize)).r;
          float h22 = texture2D(uHeightMap, heightUv + vec2( texelSize,  texelSize)).r;

          float hRange = uMaxHeight - uMinHeight;
          
          // Scharr X
          float dx = (3.0*h00 + 10.0*h01 + 3.0*h02) - (3.0*h20 + 10.0*h21 + 3.0*h22);
          dx *= hRange;
          
          // Scharr Y
          float dy = (3.0*h00 + 10.0*h10 + 3.0*h20) - (3.0*h02 + 10.0*h12 + 3.0*h22);
          dy *= hRange;
          
          // TANGENT SPACE RECONSTRUCTION
          // This is a simplification: assuming local flat grid.
          // For global S2, we should ideally use the dX/dY from faceUvToXyz.
          // But with high-tessellation displacement, local tangent basis is usually enough.
          
          // Compute a better normal by perturbing the sphere normal
          // Scale factor depends on tile size in meters
          float metersPerUnit = 1000.0; // Placeholder
          vec3 normal = normalize(vec3(dx, dy, metersPerUnit));
          
          // Final Color
          vec4 color = texture2D(uColorMap, vUv);
          
          // Simple Lighting
          vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
          float diffuse = max(dot(vNormal, lightDir), 0.2); // Simple sphere light for now
          
          gl_FragColor = vec4(color.rgb * diffuse, uOpacity);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
    });
  }
}
