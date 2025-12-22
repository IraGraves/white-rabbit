import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

/**
 * Creates a custom LineMaterial for mission trajectories.
 * Features:
 * - Transparency Gradient via direct alpha modification at output
 * - Screen-Space Stipple Future
 */
interface MissionLineParams {
  color: THREE.Color | number | string;
  linewidth?: number;
  resolution?: THREE.Vector2;
}

export function createMissionLineMaterial(params: MissionLineParams) {
  const material = new LineMaterial({
    color: params.color,
    linewidth: params.linewidth || 1.5, // Standard width
    dashed: false, // SOLID WIDTH

    // Transparency Settings
    transparent: true,
    depthWrite: false,
    depthTest: true,

    worldUnits: false,
    resolution: params.resolution || new THREE.Vector2(window.innerWidth, window.innerHeight),
  });

  // Explicitly ensure transparency is set
  material.transparent = true;
  material.depthWrite = true;

  // Custom Uniform for High-Precision View Matrix
  material.uniforms.uViewRotationMatrix = { value: new THREE.Matrix4() };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uViewRotationMatrix = material.uniforms.uViewRotationMatrix;

    // --- Vertex Shader Patching (Precise View Transformation) ---
    // We override the View Matrix to use our high-precision uniform,
    // avoiding the ModelViewMatrix multiplication on CPU or standard GPU path.
    // This requires the Mesh to be at (0,0,0) and matrixAutoUpdate=false.

    shader.vertexShader = `
      uniform mat4 uViewRotationMatrix;
      ${shader.vertexShader}
    `;

    // Replace start/end position calculations
    // Buffer contains Camera-Relative positions (Pre-Rebased on CPU).
    // We only apply the View Rotation (not translation).
    shader.vertexShader = shader.vertexShader.replace(
      'vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );',
      'vec4 start = uViewRotationMatrix * vec4( instanceStart, 1.0 );'
    );
    shader.vertexShader = shader.vertexShader.replace(
      'vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );',
      'vec4 end = uViewRotationMatrix * vec4( instanceEnd, 1.0 );'
    );

    // NO custom fragment shader logic.
    // We rely on standard LineMaterial fragment shader which outputs the color.
  };

  return material;
}
