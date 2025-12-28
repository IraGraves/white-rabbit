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
    linewidth: params.linewidth || 3,
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
  material.uniforms.uTrailLength = { value: 0.5 }; // Visual length of the trail
  material.uniforms.uMode = { value: 0.0 }; // 0 = Loop (Helio), 1 = Sliding (Geo)
  material.uniforms.uDistanceOffset = { value: 0.0 }; // Offset for multi-segment lines

  material.onBeforeCompile = (shader) => {
    // Link material uniforms to shader uniforms
    shader.uniforms.uTotalLength = material.uniforms.uTotalLength;
    shader.uniforms.uCenterDistance = material.uniforms.uCenterDistance;
    shader.uniforms.uTrailLength = material.uniforms.uTrailLength;
    shader.uniforms.uMode = material.uniforms.uMode;
    shader.uniforms.uDistanceOffset = material.uniforms.uDistanceOffset;

    // Expose shader for external uniform updates (e.g., material.userData.shader.uniforms.uDistanceOffset.value)
    material.userData.shader = shader;

    // Inject uniform declarations into vertex shader
    shader.vertexShader = `
      uniform float uTotalLength;
      uniform float uCenterDistance;
      uniform float uTrailLength;
      uniform float uMode;
      uniform float uDistanceOffset; // Declare new uniform
      ${shader.vertexShader}
    `;

    // Inject uniform declarations into fragment shader
    shader.fragmentShader = `
      uniform float uTotalLength;
      uniform float uCenterDistance;
      uniform float uTrailLength;
      uniform float uMode;
      ${shader.fragmentShader}
    `;

    // Modify vLineDistance assignment in vertex shader to include offset
    // Use Regex to match the full assignment line (ending in ;) and append our offset addition after it.
    // This avoids operator precedence issues (float + bool) with the existing ternary operator.
    shader.vertexShader = shader.vertexShader.replace(
      /vLineDistance\s*=\s*[^;]+;/g,
      '$&\n vLineDistance += uDistanceOffset;'
    );

    // Custom Alpha Logic
    const customLogic = `
      #ifdef USE_DASH
      // --- CUSTOM ORBIT LOGIC ---
      
      // Calculate signed distance from "current" position
      // negative = past, positive = future
      float dist = vLineDistance - uCenterDistance;
      
      float alphaFade = 0.0;
      float glow = 0.0;
      
      if (uMode < 0.5) { 
          // --- MODE 0: LOOP (Heliocentric) ---
          
          // Wrapping logic
          if (dist > 0.0) dist -= uTotalLength;
          if (dist < -uTotalLength) dist += uTotalLength;
          
          // Debug / Safety
          if (dist > 0.0) {
              alphaFade = 0.0;
          } else {
              // Standard fade
              float pastProg = 1.0 - (abs(dist) / (uTotalLength * 0.95));
              alphaFade = pow(max(0.0, pastProg), 0.4);
          }
          
          if (dist <= 0.0) {
              float decay = 10.0 / (uTotalLength + 0.0001) + 0.05;
              glow = exp(-abs(dist) * decay);
          }
          
      } else {
          // --- MODE 1: SLIDING WINDOW (Geocentric) ---
          
          // Strict cut-off for future (no wrapping)
          if (dist > 0.0) {
              alphaFade = 0.0;
              glow = 0.0;
          } else {
              float pastDist = abs(dist);
              
              // Linear fade over the trail length
              // If uTrailLength is huge (full history), we might want a different curve?
              // Standard linear fade:
              float fadeMetric = 1.0 - (pastDist / (uTrailLength + 0.001));
              alphaFade = clamp(fadeMetric, 0.0, 1.0);
              
              // Glow Effect at the Head
              // Dynamic decay based on trail length (Proportional Glow)
              // Longer orbits get longer glows, similar to Heliocentric mode.
              float glowDecay = 40.0 / (uTrailLength + 1.0) + 0.02;
              glow = exp(-pastDist * glowDecay);
          }
      }
       
      glow = max(0.0, glow);

      // Apply base opacity
      alpha *= alphaFade;
      
      // Mix glow
      if (alphaFade > 0.0 || glow > 0.0) {
         diffuseColor.rgb += vec3(0.5) * glow; 
         alpha += glow * 0.5;
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
