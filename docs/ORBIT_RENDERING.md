# Orbit Rendering System

This document describes the orbit rendering system, including the Hermite spline interpolation approach used for smooth, accurate orbit trail visualization.

## Overview

Orbit trails are rendered as `Line2` geometries with custom shaders that create a fading gradient effect from the celestial body's current position. The system uses **Hermite cubic splines** for smooth interpolation between sparse control points sampled from ephemeris data.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Astronomy Engine APIs                         │
│  HelioState() │ JupiterMoons() │ Keplerian Solver                │
└───────┬───────────────┬────────────────────┬────────────────────┘
        │               │                    │
        ▼               ▼                    ▼
┌───────────────────────────────────────────────────────────────────┐
│           Control Point Sampling (8 points per orbit)             │
│   Position (x, y, z) in AU  +  Velocity (vx, vy, vz) in AU/day    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│              Hermite Spline Interpolation                          │
│   Generates 360 dense output points with C1 continuity            │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                   Line2 Geometry + Shader                          │
│   uCenterDistance uniform controls gradient fade position          │
└───────────────────────────────────────────────────────────────────┘
```

## Data Sources by Body Type

| Body Type | Position API | Velocity API | Frame |
|-----------|-------------|--------------|-------|
| **Major Planets** (Mercury–Neptune) | `Astronomy.HelioState(body, date)` | Direct `.vx`, `.vy`, `.vz` | Heliocentric J2000 |
| **Pluto** | `Astronomy.HelioState(Body.Pluto, date)` | Direct `.vx`, `.vy`, `.vz` | Heliocentric J2000 |
| **Jovian Moons** (Io, Europa, Ganymede, Callisto) | `Astronomy.JupiterMoons(date)` | Direct `.vx`, `.vy`, `.vz` | Jovicentric J2000 |
| **Earth's Moon** | `HelioState(Moon) - HelioState(Earth)` | Subtraction of velocities | Geocentric J2000 |
| **Other Dwarf Planets** (Ceres, Haumea, Makemake, Eris) | `calculateKeplerianPosition(elements, date)` | 1-minute finite difference | Heliocentric J2000 |
| **Tesla Roadster** | `calculateKeplerianPosition(elements, date)` | 1-minute finite difference | Heliocentric J2000 |

## Hermite Spline Algorithm

### Cubic Hermite Basis Functions

For a parameter `t ∈ [0, 1]`:

```
h₀₀(t) = 2t³ - 3t² + 1     (position at start)
h₁₀(t) = t³ - 2t² + t      (tangent at start)
h₀₁(t) = -2t³ + 3t²        (position at end)
h₁₁(t) = t³ - t²           (tangent at end)
```

### Interpolation Formula

```
P(t) = h₀₀·P₀ + h₁₀·V₀ + h₀₁·P₁ + h₁₁·V₁
```

Where:
- `P₀`, `P₁` = Start/end positions
- `V₀`, `V₁` = Start/end velocities (scaled by time interval)

### Velocity Scaling

Velocities must be scaled by the time interval between control points:

```typescript
const dtDays = period / numControlPoints;
const scaledVel = rawVelocity.multiplyScalar(dtDays);
```

## Arc Length Calculation

The shader uses `uCenterDistance` to position the gradient fade. This requires calculating the arc length along the orbit.

### Gaussian Quadrature

Arc length is computed using 5-point Gaussian quadrature:

```
L(t) = ∫₀ᵗ |P'(u)| du ≈ (t/2) × Σᵢ wᵢ × |P'((t/2)(xᵢ+1))|
```

**Weights and abscissae:**
```typescript
const GAUSS_WEIGHTS = [0.2369269, 0.4786287, 0.5688889, 0.4786287, 0.2369269];
const GAUSS_ABSCISSAE = [0.0469101, 0.2307653, 0.5, 0.7692347, 0.9530899];
```

### Time-Based Distance Calculation

Each frame, the current arc length is calculated from time:

```typescript
const tNorm = (config.date - orbitStartMs) / periodMs;  // 0 to 1
const segmentIndex = Math.floor(tNorm * numSegments);
const localT = (tNorm * numSegments) - segmentIndex;

// Sum completed segment arc lengths
let distance = 0;
for (let i = 0; i < segmentIndex; i++) {
  distance += segmentArcLengths[i];
}

// Add partial arc length of current segment
distance += hermiteArcLength(cp[i], cp[i+1], localT);

// Update shader
material.uniforms.uCenterDistance.value = distance;
```

## Update Strategy

### Regeneration on Orbit Wrap

Orbits are regenerated when `tNorm >= 1.0` (the body has completed one orbit since generation):

```typescript
if (tNorm >= 1.0 || tNorm < 0) {
  generateMoonOrbitGeometry(moonData);  // Regenerate control points
  return;  // Use fresh data next frame
}
```

### Performance Characteristics

| Operation | Frequency | Astronomy Calls |
|-----------|-----------|-----------------|
| Orbit generation | Once per period | 9 calls (8+1 control points) |
| Per-frame update | Every frame | 0 calls (pure math) |
| Arc length calculation | Every frame | ~40 floating point ops |

## Coordinate Transformations

### Astronomy Engine to Scene Coordinates

All positions and velocities are transformed consistently:

```typescript
// Astronomy Engine: X=toward vernal equinox, Y=90° in ecliptic, Z=north ecliptic pole
// Scene: X=right, Y=up, Z=toward camera

sceneX = astroX * AU_TO_SCENE;
sceneY = astroZ * AU_TO_SCENE;    // Astronomy Z → Scene Y (up)
sceneZ = -astroY * AU_TO_SCENE;   // Astronomy Y → Scene -Z
```

### AU_TO_SCENE Constant

```typescript
const AU_TO_SCENE = 100;  // 1 AU = 100 scene units
```

## Files

| File | Purpose |
|------|---------|
| `src/systems/orbits.ts` | Planet orbit generation and updates |
| `src/systems/moons.ts` | Moon orbit generation and updates |
| `src/physics/orbits.ts` | Keplerian orbit solver |
| `src/materials/OrbitLineMaterial.ts` | Shader for gradient fade effect |

## Troubleshooting

### Orbit tail jumps at wrap-around

**Cause:** `tNorm` exceeds 1.0 but regeneration doesn't trigger properly.

**Solution:** Check that `orbitStartMs` is correctly updated during regeneration.

### Orbit tail stepping/stuttering

**Cause:** Using discrete point lookup instead of Hermite arc length.

**Solution:** Ensure `hermiteControlPoints` and `segmentArcLengths` are stored in userData.

### Orbit shape incorrect

**Cause:** Velocity scaling factor is wrong.

**Solution:** Verify `dtDays = period / numControlPoints` and velocity is multiplied by this value.

### Mismatch between orbit and body position

**Cause:** Coordinate transformation inconsistency between position and orbit generation.

**Solution:** Both must use the same `(x, z, -y)` transformation.
