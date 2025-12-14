import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

/**
 * Creates a custom LineMaterial for orbit trails.
 * Features:
 * - Fading Alpha: Fades out from the current position (center) to the tail.
 * - Dim Future: The future path is rendered with reduced opacity.
 * - Glow Effect: Boosts brightness near the current position.
 */
interface OrbitLineParams {
  color: THREE.Color | number | string;
  linewidth?: number;
  resolution?: THREE.Vector2;
  opacity?: number;
}

export function createOrbitLineMaterial(params: OrbitLineParams) {
  const material = new LineMaterial({
    color: params.color,
    linewidth: params.linewidth || 4, // Slightly thicker than missions to be visible
    dashed: true, // REQUIRED for vLineDistance to be passed to shader

    // Transparency Settings
    transparent: true,
    depthWrite: false, // Important for overlapping orbits
    depthTest: true,

    worldUnits: false, // scalable width in screen space
    resolution: params.resolution || new THREE.Vector2(window.innerWidth, window.innerHeight),
    opacity: params.opacity ?? 0.8,
  });

  // Explicitly ensure transparency is set
  material.transparent = true;
  material.depthWrite = false;
  material.dashSize = 1e10; // Disable visual dashes (prevent discard)
  material.gapSize = 0;

  // Custom uniforms
  material.uniforms.uTotalLength = { value: 1.0 };
  material.uniforms.uCenterDistance = { value: 0.5 }; // Distance to the "current" point

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTotalLength = material.uniforms.uTotalLength;
    shader.uniforms.uCenterDistance = material.uniforms.uCenterDistance;

    shader.fragmentShader = `
      uniform float uTotalLength;
      uniform float uCenterDistance;
      ${shader.fragmentShader}
    `;

    // Custom Alpha Logic
    const customLogic = `
      #ifdef USE_DASH
      // --- CUSTOM ORBIT LOGIC ---
      
      // Calculate signed distance from "current" position
      // negative = past, positive = future
      float dist = vLineDistance - uCenterDistance;
      
      float alphaFade = 0.0;
      
      if (dist > 0.0) {
          // Future Path
          // User requested NO glow/visibility in front.
          // Strictly cut off.
          alphaFade = 0.0;
      } else {
          // Past Trail
          // Fade from 1.0 at center to 0.0 at tail start
          float pastProg = 1.0 - (abs(dist) / uCenterDistance);
          // Very slow fade (root curve) to keep trail visible almost to the end
          alphaFade = pow(max(0.0, pastProg), 0.4); 
      }
      
      // Asymmetric Glow
      // Only diffuse into the past to create a comet-like head
      float glow = 0.0;
      
      if (dist <= 0.0) {
           // Back glow: smooth
           glow = exp(-abs(dist) * 5.0); 
      }
      glow = max(0.0, glow);

      // Apply base opacity
      alpha *= alphaFade;
      
      // Mix glow
      // Additive boost
      if (alphaFade > 0.0 || glow > 0.0) {
         // Boost color at the head
         diffuseColor.rgb += vec3(0.5) * glow; 
         alpha += glow * 0.8;
      }
      
      // Max alpha clamp
      alpha = min(alpha, 1.0);
      #endif
      
      // Final Output
      gl_FragColor = vec4( diffuseColor.rgb, alpha );
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      'gl_FragColor = vec4( diffuseColor.rgb, alpha );',
      customLogic
    );
  };

  return material;
}
