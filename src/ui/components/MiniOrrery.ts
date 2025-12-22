import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { PlanetWrapper } from '../../types';
import { AU_TO_SCENE } from '../../config';

/**
 * MiniOrrery
 * A 3D radar-style visualization of the solar system using logarithmic scaling.
 */
export class MiniOrrery {
  private container: HTMLElement | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  private planetsMap: Map<string, THREE.Mesh> = new Map();
  private orbitsGroup: THREE.Group;
  private sunMesh: THREE.Mesh;
  private sunCorona: THREE.Mesh | null = null;
  private sunLight: THREE.PointLight | null = null;

  // Holographic effect elements
  private hologramCylinder: THREE.Mesh | null = null;
  private gridHelper: THREE.PolarGridHelper | null = null;

  // Ship indicator
  private shipMesh: THREE.Mesh | null = null;
  private shipStalk: THREE.Line | null = null;

  // Multi-scale support: planetary (0-40 AU), solar (40-3000 AU), interstellar (3000+ AU)
  private currentScale: 'planetary' | 'solar' | 'interstellar' = 'planetary';
  private heliosphereGroup: THREE.Group | null = null;
  private heliosphereBoundaries: Array<{
    circle: THREE.Line;
    radius: number;
    name: string;
    description: string;
  }> = [];
  private helioPlanetsMap: Map<string, THREE.Mesh> = new Map();
  private innerOortCloudTorus: THREE.Object3D | null = null; // Only visible in inner solar system view
  private extendedOortCloudRing: THREE.Object3D | null = null; // Only visible in outer solar system view
  private onScaleChange: ((scale: 'planetary' | 'solar' | 'interstellar') => void) | null = null;
  private gridLabels: HTMLElement[] = [];
  private labelContainer: HTMLElement | null = null;

  // Heliosphere distances in AU
  private readonly HELIO_DISTANCES = {
    terminationShock: 94,
    heliopause: 120,
    hydrogenWall: 200,
    bowWave: 230,
    innerOortCloud: 2000,
    outerOortCloud: 2500, // Part of 50x scale: 50 -> 2500 -> 125,000 AU
  };

  // Scale settings
  // Scale settings (Unified Logarithmic Model)
  // Formula: R = log10( (AU / Zoom) * LOG_K + 1 ) * LOG_S
  // Anchors: Ring 1 (8u) = 1 AU @ Zoom 1 | Ring 4 (32u) = 50 AU @ Zoom 1
  private readonly LOG_K = 2.2719;
  private readonly LOG_S = 15.54;

  constructor() {
    this.scene = new THREE.Scene();

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this.camera.position.set(0, 45, 50); // Higher and further back
    this.camera.lookAt(0, 18.75, 0); // Look at cylinder center

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0); // Transparent background

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = false;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 100;
    this.controls.target.set(0, 18.75, 0); // Orbit around cylinder center

    // Groups
    this.orbitsGroup = new THREE.Group();
    // System Group for floating elements
    this.systemGroup = new THREE.Group();
    this.systemGroup.position.y = 25; // Lift higher into upper portion of cylinder
    this.scene.add(this.systemGroup);

    this.systemGroup.add(this.orbitsGroup);

    // Sun (Center) - with smaller base radius (0.5) to allow precise scaling
    const sunGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const sunMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xffdd00) },
        color2: { value: new THREE.Color(0xff6600) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vNormal;
        varying vec2 vUv;
        void main() {
          // Fresnel for edge glow
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.5);
          // Animated color mix
          float pulse = sin(time * 2.0) * 0.5 + 0.5;
          vec3 color = mix(color1, color2, pulse * 0.3 + fresnel * 0.3);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.systemGroup.add(this.sunMesh);

    // Sun corona (outer glow)
    const coronaGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const coronaMat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffaa00) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec3 vNormal;
        void main() {
          // Reverse fresnel for inner fade
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(color, intensity * 0.5);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    this.systemGroup.add(this.sunCorona);

    // Add sun glow light (visual only)
    this.sunLight = new THREE.PointLight(0xffaa00, 3, 15);
    this.systemGroup.add(this.sunLight);

    this.createHologramEffect();
    this.createHeliosphereView();
  }

  private systemGroup: THREE.Group;

  public init(container: HTMLElement) {
    this.container = container;

    // Scale container handling - use full container dimensions
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // CSS Styling
    this.renderer.domElement.style.borderRadius = '8px';

    // Attach
    container.appendChild(this.renderer.domElement);

    // Create labels after container is attached
    this.createGridLabels();

    // Add Resize Observer - dynamically fill container
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          const w = entry.contentRect.width;
          const h = entry.contentRect.height;
          this.renderer.setSize(w, h);
          this.camera.aspect = w / h;
          this.camera.updateProjectionMatrix();
        }
      }
    });
    resizeObserver.observe(container);

    // Raycaster for local hover detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Create/get tooltip element
    let tooltip = document.getElementById('mini-orrery-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'mini-orrery-tooltip';
      tooltip.style.position = 'fixed';
      tooltip.style.background = 'rgba(0, 20, 30, 0.9)';
      tooltip.style.color = '#00ffff';
      tooltip.style.padding = '8px 12px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.fontSize = '12px';
      tooltip.style.fontFamily = "'Courier New', monospace";
      tooltip.style.pointerEvents = 'none';
      tooltip.style.zIndex = '10000';
      tooltip.style.display = 'none';
      tooltip.style.border = '1px solid #00ffff40';
      tooltip.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
      document.body.appendChild(tooltip);
    }

    // Mousemove handler for radar hover
    this.renderer.domElement.addEventListener('mousemove', (event) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);

      // Get all interactable objects: sun + planets + ship + heliosphere
      const interactables: THREE.Object3D[] = [this.sunMesh];
      for (const mesh of this.planetsMap.values()) {
        interactables.push(mesh);
      }
      if (this.shipMesh) interactables.push(this.shipMesh);

      // Add heliosphere objects when in solar or interstellar scale
      if (
        (this.currentScale === 'solar' || this.currentScale === 'interstellar') &&
        this.heliosphereGroup
      ) {
        for (const child of this.heliosphereGroup.children) {
          interactables.push(child);
        }
        // Also add extended Oort cloud which is directly in the scene
        if (this.currentScale === 'interstellar' && this.extendedOortCloudRing) {
          interactables.push(this.extendedOortCloudRing);
        }
      }

      const intersects = raycaster.intersectObjects(interactables, true);

      if (intersects.length > 0 && tooltip) {
        const hit = intersects[0].object;
        let name = 'Unknown';
        let description = '';

        // Check for heliosphere object with userData
        if (hit.userData && hit.userData.type === 'heliosphere') {
          name = hit.userData.name;
          description = hit.userData.description || '';
          // Check if hit is ship
        } else if (this.shipMesh && (hit === this.shipMesh || hit.parent === this.shipMesh)) {
          name = 'Your Ship';
          // Check if hit is sun
        } else if (hit === this.sunMesh || hit.parent === this.sunMesh) {
          name =
            this.currentScale === 'solar' || this.currentScale === 'interstellar'
              ? 'Planetary System'
              : 'Sun';
        } else {
          // Find which planet was hit
          for (const [planetName, mesh] of this.planetsMap) {
            if (hit === mesh || hit.parent === mesh) {
              name = planetName;
              break;
            }
          }
        }

        tooltip.innerHTML = description
          ? `<strong>${name}</strong><br><span style="opacity:0.7">${description}</span>`
          : name;
        tooltip.style.display = 'block';
        tooltip.style.left = `${event.clientX + 15}px`;
        tooltip.style.top = `${event.clientY + 15}px`;
        this.renderer.domElement.style.cursor = 'pointer';
      } else if (tooltip) {
        tooltip.style.display = 'none';
        this.renderer.domElement.style.cursor = 'default';
      }
    });

    // Hide tooltip when leaving canvas
    this.renderer.domElement.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.style.display = 'none';
    });

    // Prevent window dragging when interacting with the radar
    this.renderer.domElement.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
  }

  private createHologramEffect() {
    // 1. Base Grid (Radial) - softened and glowy. 4 rings @ 8, 16, 24, 32
    this.gridHelper = new THREE.PolarGridHelper(32, 16, 4, 64, 0x003333, 0x008888);
    const gridMat = this.gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.15;
    gridMat.blending = THREE.AdditiveBlending;
    gridMat.depthWrite = false;
    this.scene.add(this.gridHelper);

    // 2. Holographic Cylinder
    const geometry = new THREE.CylinderGeometry(35, 35, 37.5, 64, 1, true);

    // Custom Shader Material for "Force Field" scanline effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00ffff) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          // Constant homogenous alpha
          float alpha = 0.05;
          
          // Fade edges at top/bottom
          float edgeFade = 1.0 - pow(abs(vUv.y - 0.5) * 2.0, 4.0);
          
          gl_FragColor = vec4(color, alpha * edgeFade);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.hologramCylinder = new THREE.Mesh(geometry, material);
    this.hologramCylinder.position.y = 18.75; // Center vertically (37.5 / 2)
    this.scene.add(this.hologramCylinder);

    // 3. Top Lid
    const topGeo = new THREE.CircleGeometry(35, 64);
    topGeo.rotateX(-Math.PI / 2); // Lay flat
    const topMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
      depthWrite: false, // Prevent z-fighting with other transparent elements
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 37.5; // Top of cylinder
    this.scene.add(topMesh);

    // 4. Top Ring Line
    const ringGeo = new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, 35, 35, 0, 2 * Math.PI, false, 0).getPoints(64)
    );
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x008888,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ringMesh = new THREE.LineLoop(ringGeo, ringMat);
    ringMesh.position.y = 37.5;
    this.scene.add(ringMesh);
  }

  private createGridLabels() {
    if (!this.container) return;

    // Create a container for the labels
    this.labelContainer = document.createElement('div');
    this.labelContainer.style.position = 'absolute';
    this.labelContainer.style.top = '0';
    this.labelContainer.style.left = '0';
    this.labelContainer.style.width = '100%';
    this.labelContainer.style.height = '100%';
    this.labelContainer.style.pointerEvents = 'none';
    this.labelContainer.style.overflow = 'hidden';
    this.labelContainer.style.zIndex = '10'; // Above canvas
    this.container.appendChild(this.labelContainer);

    // Rings are at 8, 16, 24, 32 visual units
    const rings = [8, 16, 24, 32];
    for (let i = 0; i < rings.length; i++) {
      const label = document.createElement('div');
      label.style.position = 'absolute';
      label.style.color = '#00ffff';
      label.style.fontSize = '9px';
      label.style.fontFamily = 'monospace';
      label.style.opacity = '0.6';
      label.style.textShadow = '0 0 4px #00ffff';
      label.style.pointerEvents = 'none';
      label.style.whiteSpace = 'nowrap';
      label.style.userSelect = 'none';
      label.style.transform = 'translate(-105%, -110%)'; // Shift inside the ring
      label.id = `grid-label-${i}`;

      this.labelContainer.appendChild(label);
      this.gridLabels.push(label);
    }
  }

  /**
   * Creates the heliosphere visualization for solar system scale
   */
  private createHeliosphereView() {
    this.heliosphereGroup = new THREE.Group();
    this.heliosphereGroup.position.y = 25; // Same height as systemGroup
    this.heliosphereGroup.visible = false; // Hidden by default
    this.scene.add(this.heliosphereGroup);

    const getSolarRadius = (au: number) => {
      // Use unified getLogPosition with Zoom 50
      return this.getLogPosition(au * AU_TO_SCENE, 0, 50).x;
    };

    // Sun indicator at center (yellow dot)
    const sunDotGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const sunDotMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
    const sunDot = new THREE.Mesh(sunDotGeo, sunDotMat);
    sunDot.userData = {
      type: 'heliosphere',
      name: 'Sun',
      description: 'Center of the Solar System',
    };
    this.heliosphereGroup.add(sunDot);

    // Planets with circular orbit lines
    const planetDefs = [
      { name: 'Mercury', au: 0.39, color: 0x8c8c8c },
      { name: 'Venus', au: 0.72, color: 0xe6c35c },
      { name: 'Earth', au: 1.0, color: 0x4a90d9 },
      { name: 'Mars', au: 1.52, color: 0xd9534f },
      { name: 'Jupiter', au: 5.2, color: 0xd4a574 },
      { name: 'Saturn', au: 9.5, color: 0xf0e68c },
      { name: 'Uranus', au: 19.2, color: 0x87ceeb },
      { name: 'Neptune', au: 30.0, color: 0x4169e1 },
    ];

    for (const planet of planetDefs) {
      // Orbit circle
      const orbitRadius = getSolarRadius(planet.au);
      const orbitCurve = new THREE.EllipseCurve(
        0,
        0,
        orbitRadius,
        orbitRadius,
        0,
        2 * Math.PI,
        false,
        0
      );
      const orbitPoints = orbitCurve.getPoints(64);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      orbitGeo.rotateX(-Math.PI / 2);
      const orbitMat = new THREE.LineBasicMaterial({
        color: planet.color,
        transparent: true,
        opacity: 0.4,
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      orbitLine.userData = {
        type: 'heliosphere',
        name: `${planet.name} Orbit`,
        description: `${planet.au} AU`,
      };
      this.heliosphereGroup.add(orbitLine);

      // Planet dot
      const planetGeo = new THREE.SphereGeometry(0.25, 8, 8);
      const planetMat = new THREE.MeshBasicMaterial({ color: planet.color });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      // Start at orbit position (will be updated with real positions)
      planetMesh.position.set(orbitRadius, 0, 0);
      planetMesh.userData = {
        type: 'heliosphere',
        name: planet.name,
        description: `${planet.au} AU - Orbital Distance`,
      };
      this.heliosphereGroup.add(planetMesh);
      this.helioPlanetsMap.set(planet.name, planetMesh);
    }

    // Heliosphere boundaries as circles
    const boundaries = [
      {
        name: 'Termination Shock',
        au: this.HELIO_DISTANCES.terminationShock,
        color: 0x4488ff,
        dashed: true,
        description: '~94 AU - Solar wind slows to subsonic',
      },
      {
        name: 'Heliopause',
        au: this.HELIO_DISTANCES.heliopause,
        color: 0x44aaff,
        dashed: false,
        description: '~120 AU - Edge of heliosphere',
      },
      {
        name: 'Hydrogen Wall',
        au: this.HELIO_DISTANCES.hydrogenWall,
        color: 0x88ccff,
        dashed: true,
        description: '~200 AU - Neutral hydrogen accumulation',
      },
      {
        name: 'Bow Wave',
        au: this.HELIO_DISTANCES.bowWave,
        color: 0xaaddff,
        dashed: true,
        description: "~230 AU - Sun's bow wave (theoretical)",
      },
    ];

    // Store boundary meshes for tooltip detection
    this.heliosphereBoundaries = [];

    for (const boundary of boundaries) {
      const radius = getSolarRadius(boundary.au);
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(64);
      const circleGeo = new THREE.BufferGeometry().setFromPoints(points);
      circleGeo.rotateX(-Math.PI / 2);

      let material: THREE.Material;
      if (boundary.dashed) {
        material = new THREE.LineDashedMaterial({
          color: boundary.color,
          transparent: true,
          opacity: 0.5,
          dashSize: 1,
          gapSize: 0.5,
        });
      } else {
        material = new THREE.LineBasicMaterial({
          color: boundary.color,
          transparent: true,
          opacity: 0.5,
        });
      }

      const circle = new THREE.Line(circleGeo, material);
      circle.userData = {
        type: 'heliosphere',
        name: boundary.name,
        description: boundary.description,
      };
      if (boundary.dashed) {
        circle.computeLineDistances();
      }
      this.heliosphereGroup.add(circle);
      this.heliosphereBoundaries.push({
        circle,
        radius,
        name: boundary.name,
        description: boundary.description,
      });
    }

    // Volumetric Cloud Shader for Particles
    const cloudShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x6666cc) },
        uBaseOpacity: { value: 0.15 },
        uSize: { value: 2.0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        varying vec3 vPosition;

        void main() {
          vPosition = position;
          
          // Subtle organic drift
          vec3 pos = position;
          pos.x += sin(uTime * 0.1 + position.z * 0.5) * 0.2;
          pos.y += cos(uTime * 0.15 + position.x * 0.5) * 0.1;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size attenuation (standard for points)
          gl_PointSize = uSize * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uBaseOpacity;
        uniform float uTime;
        varying vec3 vPosition;

        // Simple noise function for sparkle/density
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.123))) * 43758.5453);
        }

        void main() {
          // Circular point shape
          vec2 uv = gl_PointCoord - 0.5;
          float dist = length(uv);
          if (dist > 0.5) discard;
          
          // Sparkling/Hazy noise
          float n = noise(vPosition + uTime * 0.05);
          float alpha = (1.0 - dist * 2.0) * uBaseOpacity * (0.5 + 0.5 * n);
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Inner Oort Cloud (Solar View)
    // Helper to create volumetric points in a torus
    const createTorusPoints = (
      midRadius: number,
      tubeRadius: number,
      count: number,
      innerOnly = false
    ) => {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2; // Loop around ring

        // Loop around tube
        // If innerOnly, we restrict phi to [PI/2, 3PI/2] so particles only stay inside the cylinder
        const phi = innerOnly ? Math.PI / 2 + Math.random() * Math.PI : Math.random() * Math.PI * 2;

        const r = Math.sqrt(Math.random()) * tubeRadius; // Random radius in tube

        positions[i * 3] = (midRadius + r * Math.cos(phi)) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi);
        positions[i * 3 + 2] = (midRadius + r * Math.cos(phi)) * Math.sin(theta);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      return geo;
    };

    // Inner Oort Cloud (Solar View)
    // Anchored at the cylinder edge (35u) and extending inwards to the start of the Oort Cloud
    const innerThresholdRadius = getSolarRadius(this.HELIO_DISTANCES.innerOortCloud);
    const cylinderEdge = 35;

    // We center the torus on the cylinder edge and make it thick enough to reach the threshold
    const midR1 = cylinderEdge;
    const tubeR1 = cylinderEdge - innerThresholdRadius;

    const innerPointsGeo = createTorusPoints(midR1, tubeR1, 15000, true);
    const innerPointsMat = cloudShaderMat.clone();
    innerPointsMat.uniforms.uColor.value.setHex(0x5555cc); // Denim blue
    innerPointsMat.uniforms.uBaseOpacity.value = 0.45;
    innerPointsMat.uniforms.uSize.value = 1.7;

    this.innerOortCloudTorus = new THREE.Points(innerPointsGeo, innerPointsMat);
    this.innerOortCloudTorus.userData = {
      type: 'heliosphere',
      name: 'Oort Cloud Start',
      description: 'Beginning of the Oort Cloud reservoir (~2,000 AU)',
    };
    this.heliosphereGroup.add(this.innerOortCloudTorus);

    // Extended Oort Cloud (Outer View)
    // Consistently starts at 2,000 AU (radius ~7) and extends to 125,000 AU (radius 32)
    const outerPointsGeo = createTorusPoints(19.5, 12.5, 35000);
    const outerPointsMat = cloudShaderMat.clone();
    outerPointsMat.uniforms.uColor.value.setHex(0x5555cc); // Denim blue
    outerPointsMat.uniforms.uBaseOpacity.value = 0.45;
    outerPointsMat.uniforms.uSize.value = 1.7;

    this.extendedOortCloudRing = new THREE.Points(outerPointsGeo, outerPointsMat);
    this.extendedOortCloudRing.userData = {
      type: 'heliosphere',
      name: 'Outer Oort Cloud',
      description: '2,000 - 125,000 AU - Outermost reach (Hill Sphere)',
    };
    this.extendedOortCloudRing.position.y = 25;
    this.extendedOortCloudRing.visible = false; // Only visible in outer solar system view
    this.scene.add(this.extendedOortCloudRing); // Add to scene, not heliosphereGroup (so it doesn't scale)
  }

  private getLogPosition(x: number, z: number, zoom = 1): { x: number; z: number } {
    const dist = Math.sqrt(x * x + z * z);
    const distAU = dist / AU_TO_SCENE; // Normalize to AU
    if (distAU < 0.0001) return { x: 0, z: 0 };

    // Unified formula: r = log10( (au / Zoom) * K + 1 ) * S
    const logDist = Math.log10((distAU / zoom) * this.LOG_K + 1) * this.LOG_S;

    // Normalize and scale
    const angle = Math.atan2(z, x);
    return {
      x: Math.cos(angle) * logDist,
      z: Math.sin(angle) * logDist,
    };
  }

  /**
   * Set callback for scale change events
   */
  public setOnScaleChange(callback: (scale: 'planetary' | 'solar' | 'interstellar') => void) {
    this.onScaleChange = callback;
  }

  // Interface for virtual position provider
  public update(
    planets: PlanetWrapper[],
    controls?: {
      getVirtualPosition(): { x: number; y: number; z: number };
      getVirtualTarget(): { x: number; y: number; z: number };
    }
  ) {
    if (!this.container) return;

    const time = performance.now() / 1000;

    // Update Oort Cloud shader time
    if (this.innerOortCloudTorus instanceof THREE.Points) {
      const mat = this.innerOortCloudTorus.material;
      if (mat instanceof THREE.ShaderMaterial) {
        mat.uniforms.uTime.value = time;
      }
    }
    if (this.extendedOortCloudRing instanceof THREE.Points) {
      const mat = this.extendedOortCloudRing.material;
      if (mat instanceof THREE.ShaderMaterial) {
        mat.uniforms.uTime.value = time;
      }
    }

    // Update Grid Labels
    this.updateGridLabels();

    // Update Ship position (from virtual camera position via controls)
    if (controls) {
      if (!this.shipMesh) {
        // Create ship indicator - cone pointing in +Z direction (horizontal)
        const shipGeo = new THREE.ConeGeometry(1.0, 2.0, 8);
        // Rotate so tip points in +Z (forward direction, into camera look)
        shipGeo.rotateX(Math.PI / 2);
        const shipMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.shipMesh = new THREE.Mesh(shipGeo, shipMat);
        this.shipMesh.position.y = 0; // On the orbital plane
        this.systemGroup.add(this.shipMesh);

        // Ship stalk - add to systemGroup directly, not as child of rotating mesh
        const stalkGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, -25, 0),
        ]);
        const stalkMat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.5,
        });
        this.shipStalk = new THREE.Line(stalkGeo, stalkMat);
        this.systemGroup.add(this.shipStalk);
      }

      // Update ship position from virtual camera position
      const camPos = controls.getVirtualPosition();
      const targetPos = controls.getVirtualTarget();
      const viewPos = this.getLogPosition(camPos.x, camPos.z);
      this.shipMesh.position.set(viewPos.x, 0, viewPos.z);

      // Compute horizontal look direction (from camera to target, ignore Y)
      const lookDirX = targetPos.x - camPos.x;
      const lookDirZ = targetPos.z - camPos.z;
      const angle = Math.atan2(lookDirX, lookDirZ); // Angle in XZ plane
      this.shipMesh.rotation.y = angle;

      // Update stalk position to match ship (but at Y=0)
      if (this.shipStalk) {
        this.shipStalk.position.set(viewPos.x, 0, viewPos.z);
      }

      // Check for scale switch based on ship distance from origin
      // Distance is already in scene units (AU * 50). Neptune is ~30 AU = 1500 units
      const shipDistFromSun = Math.sqrt(camPos.x * camPos.x + camPos.z * camPos.z);
      const distAU = shipDistFromSun / AU_TO_SCENE; // Normalize to AU

      const PLANETARY_THRESHOLD = 50; // AU (beyond solar system)
      const SOLAR_THRESHOLD = 2500; // AU (edge of solar system view)

      // Determine target scale based on distance
      let targetScale: 'planetary' | 'solar' | 'interstellar';
      if (distAU <= PLANETARY_THRESHOLD) {
        targetScale = 'planetary';
      } else if (distAU <= SOLAR_THRESHOLD) {
        targetScale = 'solar';
      } else {
        targetScale = 'interstellar';
      }

      // Update Sun scaling logic (ensure it's always applied, not just on transition)
      // Base R=1.0. sunScale=1.2 => visual R=1.2 units.
      // In Solar/Interstellar, shrink significantly to avoid burying Mercury (at 0.118u)
      const sunScale = targetScale === 'planetary' ? 1.2 : 0.1;
      this.sunMesh.scale.setScalar(sunScale);
      if (this.sunCorona) this.sunCorona.scale.setScalar(sunScale);
      if (this.sunLight) {
        this.sunLight.intensity = targetScale === 'planetary' ? 3 : 1;
        this.sunLight.distance = targetScale === 'planetary' ? 15 : 5;
      }

      // Handle scale transitions
      if (targetScale !== this.currentScale) {
        this.currentScale = targetScale;

        // Show/hide groups based on scale
        this.systemGroup.visible = targetScale === 'planetary';
        if (this.heliosphereGroup) {
          this.heliosphereGroup.visible = targetScale === 'solar' || targetScale === 'interstellar';
          // With unified math, we no longer need complex scale ratios!
          // Solar mode (Zoom 50) and Interstellar (Zoom 2500) are handled by the zoom multiplier.
          // However, the heliosphereGroup itself was built for Zoom 50.
          // To show it in Interstellar (Zoom 2500), we compress it by 1/50 = 0.02?
          // Wait, Ring 4 (2500 AU) in Solar becomes Ring 1 (50 AU) in Interstellar.
          // R_solar(2500) = 32. R_inter(2500) = 8.
          // Ratio = R_inter(50 AU at Zoom 2500) / R_solar(50 AU at Zoom 50)
          // R_inter(50) = log10( (50/2500)*K + 1 ) * S = log10(1.045)*15.54 = 0.29
          // R_solar(50) = log10( (50/50)*K + 1 ) * S = log10(3.27)*15.54 = 8.0
          // Ratio = 0.29 / 8.0 = 0.0366
          const heliosphereScale = targetScale === 'interstellar' ? 0.0366 : 1.0;
          this.heliosphereGroup.scale.setScalar(heliosphereScale);
        }

        // Show extended Oort Cloud only in outer solar system view, hide inner one
        if (this.extendedOortCloudRing) {
          this.extendedOortCloudRing.visible = targetScale === 'interstellar';
        }
        if (this.innerOortCloudTorus) {
          this.innerOortCloudTorus.visible = targetScale !== 'interstellar';
        }

        if (this.onScaleChange) this.onScaleChange(targetScale);
      }

      // Update ship position in heliosphere view when in solar or interstellar scale
      if (
        (this.currentScale === 'solar' || this.currentScale === 'interstellar') &&
        this.heliosphereGroup
      ) {
        // Unified Scale Factors
        // Solar Zoom: 50 | Interstellar Zoom: 2500
        const zoom = this.currentScale === 'solar' ? 50 : 2500;
        const viewPos = this.getLogPosition(camPos.x, camPos.z, zoom);

        // In solar mode: add ship to heliosphereGroup
        // In interstellar mode: add ship to scene directly
        const targetParent = this.currentScale === 'solar' ? this.heliosphereGroup : this.scene;

        if (this.shipMesh && this.shipMesh.parent !== targetParent) {
          // Remove from previous parent
          if (this.shipMesh.parent) this.shipMesh.parent.remove(this.shipMesh);
          targetParent.add(this.shipMesh);
          if (this.shipStalk) {
            if (this.shipStalk.parent) this.shipStalk.parent.remove(this.shipStalk);
            targetParent.add(this.shipStalk);
          }
        }

        const viewX = viewPos.x;
        const viewZ = viewPos.z;
        // In interstellar mode, position at Y=25 (same as heliosphereGroup)
        const viewY = this.currentScale === 'interstellar' ? 25 : 0;
        this.shipMesh.position.set(viewX, viewY, viewZ);
        if (this.shipStalk) {
          this.shipStalk.position.set(viewX, viewY, viewZ);
        }
      } else if (this.currentScale === 'planetary' && this.systemGroup && this.shipMesh) {
        // Move ship back to systemGroup when in planetary scale
        if (this.shipMesh.parent !== this.systemGroup) {
          if (this.heliosphereGroup) this.heliosphereGroup.remove(this.shipMesh);
          this.systemGroup.add(this.shipMesh);
          if (this.shipStalk && this.heliosphereGroup) {
            this.heliosphereGroup.remove(this.shipStalk);
            this.systemGroup.add(this.shipStalk);
          }
        }
      }
    }

    // Update Hologram Shader
    if (this.hologramCylinder && this.hologramCylinder.material instanceof THREE.ShaderMaterial) {
      this.hologramCylinder.material.uniforms.time.value = time;
    }

    // Update Sun Shader
    if (this.sunMesh && this.sunMesh.material instanceof THREE.ShaderMaterial) {
      this.sunMesh.material.uniforms.time.value = time;
    }

    // Update heliosphere planets when in solar or interstellar scale
    if (
      (this.currentScale === 'solar' || this.currentScale === 'interstellar') &&
      this.helioPlanetsMap.size > 0
    ) {
      for (const p of planets) {
        if (p.data.type === 'dwarf') continue;
        const helioMesh = this.helioPlanetsMap.get(p.data.name);
        if (helioMesh && p.mesh) {
          // Use unified math with Zoom 50
          const viewPos = this.getLogPosition(p.mesh.position.x, p.mesh.position.z, 50);
          helioMesh.position.set(viewPos.x, 0, viewPos.z);
        }
      }
    }

    // Update Controls
    this.controls.update();

    // Reconcile Planets
    planets.forEach((p) => {
      const name = p.data.name;
      if (name === 'Sun') return; // Handled separately
      if (p.data.type === 'dwarf') return; // Skip dwarf planets as requested

      let mesh = this.planetsMap.get(name);

      if (!mesh) {
        // Create new planet representation with logarithmic size scaling
        // p.data.radius is relative to Earth (Earth = 1.0)
        // Mercury ~0.38, Jupiter ~11
        const relativeRadius = p.data.radius || 1;
        // Log scale: log10(radius + 1) gives range ~0.14 (Mercury) to ~1.08 (Jupiter)
        // Map to visual range 0.8 to 2.5
        const logRadius = Math.log10(relativeRadius + 1);
        const visualRadius = 0.5 + logRadius * 1.2;

        const geometry = new THREE.SphereGeometry(Math.max(0.5, visualRadius), 16, 16);
        const color = new THREE.Color(p.data.color || 0xffffff);

        // Planet with fresnel edge glow
        const material = new THREE.ShaderMaterial({
          uniforms: {
            baseColor: { value: color },
          },
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 baseColor;
            varying vec3 vNormal;
            void main() {
              float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
              vec3 glowColor = baseColor + vec3(0.3) * fresnel;
              gl_FragColor = vec4(glowColor, 1.0);
            }
          `,
        });
        mesh = new THREE.Mesh(geometry, material);

        // Glow halo
        const haloGeo = new THREE.SphereGeometry(Math.max(0.5, visualRadius) * 1.2, 16, 16);
        const haloMat = new THREE.ShaderMaterial({
          uniforms: {
            glowColor: { value: color },
          },
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 glowColor;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(glowColor, intensity * 0.4);
            }
          `,
          transparent: true,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        mesh.add(halo);

        // Add rings for Saturn
        if (name === 'Saturn') {
          const innerRadius = Math.max(0.8, visualRadius) * 1.3;
          const outerRadius = Math.max(0.8, visualRadius) * 2.2;
          const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64);
          const ringMat = new THREE.MeshBasicMaterial({
            color: 0xc9a660,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = Math.PI / 2.5; // Slight tilt
          mesh.add(ring);
        }

        this.planetsMap.set(name, mesh);
        this.systemGroup.add(mesh);

        // Drop Line (Stalk)
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, -25, 0), // Drop 25 units down to floor
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.5,
        });
        const stalk = new THREE.Line(lineGeo, lineMat);
        mesh.add(stalk);

        // Add Orbit Trace (static approximation for visual context)
        // We calculate a ring based on current distance (approximate circular orbit)
        const currentPos = p.mesh.position;
        const pMod = this.getLogPosition(currentPos.x, currentPos.z);
        const radius = Math.sqrt(pMod.x * pMod.x + pMod.z * pMod.z);

        const curve = new THREE.EllipseCurve(
          0,
          0, // ax, aY
          radius,
          radius, // xRadius, yRadius
          0,
          2 * Math.PI, // aStartAngle, aEndAngle
          false, // aClockwise
          0 // aRotation
        );
        const points = curve.getPoints(64);
        const geometryLine = new THREE.BufferGeometry().setFromPoints(points);
        const materialLine = new THREE.LineBasicMaterial({
          color: 0x008888, // Match grid teal
          transparent: true,
          opacity: 0.3,
        });

        // Rotate loop to X-Z plane
        geometryLine.rotateX(-Math.PI / 2);

        const orbitLine = new THREE.LineLoop(geometryLine, materialLine);
        // Store reference in userData to update radius later
        mesh.userData.orbitLine = orbitLine;
        mesh.userData.baseRadius = radius;
        this.orbitsGroup.add(orbitLine);
      }

      // Update Position
      const realPos = p.mesh.position;
      const viewPos = this.getLogPosition(realPos.x, realPos.z);

      mesh.position.set(viewPos.x, 0, viewPos.z);

      // Update Orbit Radius (dynamic, as planets move eccentrically)
      if (mesh.userData.orbitLine) {
        const orbitLine = mesh.userData.orbitLine as THREE.LineLoop;
        const currentRadius = Math.sqrt(viewPos.x * viewPos.x + viewPos.z * viewPos.z);

        // The line was created with geometry of 'radius'.
        // We can update the scale to match currentRadius.
        // Note: Initial radius is stored in the geometry creation.
        const baseRadius = mesh.userData.baseRadius || 1;
        orbitLine.scale.setScalar(currentRadius / baseRadius);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  private updateGridLabels() {
    if (!this.labelContainer || this.gridLabels.length === 0) return;

    const rings = [8, 16, 24, 32];
    const zoom = this.currentScale === 'planetary' ? 1 : this.currentScale === 'solar' ? 50 : 2500;

    // Project points onto screen
    const widthHalf = this.renderer.domElement.clientWidth / 2;
    const heightHalf = this.renderer.domElement.clientHeight / 2;
    const tempVec = new THREE.Vector3();

    for (let i = 0; i < rings.length; i++) {
      const radius = rings[i];
      const label = this.gridLabels[i];

      // Calculate physical distance for this ring
      // AU = Zoom * (10^(R/S) - 1) / K
      let au = (zoom * (Math.pow(10, radius / this.LOG_S) - 1)) / this.LOG_K;

      // Rounding snap for anchors (1, 50, 2500, 125000)
      // If we are within 1% of a round power of 50, snap it
      const anchors = [1, 50, 2500, 125000];
      for (const anchor of anchors) {
        if (Math.abs(au - anchor) / anchor < 0.02) {
          au = anchor;
          break;
        }
      }

      // Formatting
      let text = '';
      if (au >= 1000) {
        text = `${Math.round(au).toLocaleString()} AU`;
      } else if (au >= 100) {
        text = `${Math.round(au)} AU`;
      } else {
        text = `${au.toFixed(au < 10 ? 1 : 0)} AU`;
      }
      label.innerText = text;

      // Position: Put labels on the grid at y=0, along the diagonal.
      // Offset slightly inside the radius.
      const labelRadius = radius - 0.2;
      tempVec.set(labelRadius * Math.SQRT1_2, 0, labelRadius * Math.SQRT1_2);
      tempVec.project(this.camera);

      const x = tempVec.x * widthHalf + widthHalf;
      const y = -(tempVec.y * heightHalf) + heightHalf;

      // Hide if behind camera
      if (tempVec.z > 1) {
        label.style.display = 'none';
      } else {
        label.style.display = 'block';
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
      }
    }
  }
}
