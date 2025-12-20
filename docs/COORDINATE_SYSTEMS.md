# Coordinate Systems & Transformations

This document details the coordinate systems used in the White Rabbit solar system simulation, including data sources, scene orientation, and reference plane transformations.

## 1. Scene Coordinate System
The Three.js scene uses a **Right-Handed, Y-Up** coordinate system:
- **X-Axis**: Points towards the **Vernal Equinox** (0h Right Ascension).
- **Y-Axis**: Points towards the **North Celestial Pole** (90° Declination).
- **Z-Axis**: Points towards **-East** (or West), completing the right-handed set.

## 2. Data Mappings

### Planetary Positions (`astronomy-engine`)
The `astronomy-engine` library returns **Heliocentric Equatorial Coordinates (J2000)**:
- `vec.x`: Vernal Equinox
- `vec.y`: 90° East in Celestial Equator
- `vec.z`: North Celestial Pole

**Mapping to Scene:**
To align with our Y-Up scene:
```javascript
Scene X = vec.x
Scene Y = vec.z  (North Pole becomes Up)
Scene Z = -vec.y (East becomes -Z)
```

### Star Data (`stars_3d.json`)
The star data JSON contains pre-calculated 3D coordinates, but they are permuted relative to standard Equatorial definitions.
**Mapping Found:**
```javascript
Scene X = star.z  (Corresponds to Vernal Equinox)
Scene Y = star.x  (Corresponds to North Pole)
Scene Z = star.y  (Corresponds to -East)
```

## 3. Reference Planes

The simulation supports toggling between two reference planes. This is achieved by rotating the entire `UniverseGroup` (which contains planets, stars, zodiacs, etc.).

### Equatorial Plane (Default)
- **Orientation**: The "Ground" (Grid) aligns with the **Celestial Equator**.
- **Rotation**: `0` degrees.
- **Visual**: The Solar System (Ecliptic) appears tilted by ~23.4°.

### Ecliptic Plane
- **Orientation**: The "Ground" (Grid) aligns with the **Ecliptic** (the plane of Earth's orbit).
- **Transformation**:
  - The Ecliptic is tilted by the **Obliquity of the Ecliptic** (~23.44°) relative to the Equator.
  - To make the Ecliptic horizontal, we rotate the Universe **around the X-Axis** (Vernal Equinox).
  - **Rotation Angle**: `-Obliquity` (approx `-23.43928` degrees converted to radians).
  - **Note**: The negative sign is crucial because we are transforming *from* Equatorial *to* Ecliptic.

## 4. Zodiac Alignment
Zodiac constellations are defined by lines connecting specific stars.
- **Alignment**: The zodiac signs (sprites) are positioned at the centroid of their respective constellations.
- **Visual Check**: In **Ecliptic Mode**, the Zodiac constellations should align horizontally with the grid/ground plane.

## 5. Mission Trajectories

Space mission trajectories are visualized by calculating the positions of spacecraft at key dates.

### Waypoint Calculation
Instead of using static 3D coordinates, mission paths are defined by a series of **Waypoints**:
- **Date**: The specific date of the event (launch, flyby, orbit insertion).
- **Target Body**: The celestial body being visited (e.g., Earth, Jupiter).

For each waypoint:
1. The **Heliocentric Position** of the target body is calculated for the specific date using `astronomy-engine`.
2. This position is transformed into **Scene Coordinates** (see Section 2).
3. A smooth 3D curve (`CatmullRomCurve3`) is generated through these points.

### Deep Space & Exit Vectors
For missions leaving the solar system (Voyager, Pioneer, New Horizons), the final trajectory is determined by an **Exit Vector**:
- Defined by **Right Ascension (RA)** and **Declination (Dec)** of the spacecraft's asymptotic velocity vector.
- This vector is converted to Cartesian coordinates and scaled to the current distance of the spacecraft.

### Interpolation
For intermediate points without a major planetary body (e.g., asteroid flybys like Gaspra or Ida), the position is **interpolated** based on time between the previous and next known planetary positions, ensuring a smooth path that respects the orbital mechanics of the transfer orbit.

## 6. Scale & Precision

Scientific simulations involve vast distances that exceed the precision of standard 32-bit floating point numbers used by WebGL (approx 7 digits of precision), known as **Floating Point Jitter** or "Z-Fighting".

To solve this, White Rabbit employs a **Moving Universe / Proxy Camera** pattern via `OriginAwareArcballControls`:

1. **Virtual Space (High Precision)**:
   - The control system maintains a `_virtualCamera` that moves freely through the solar system using 64-bit coordinates (JavaScript `Number` doubles).

2. **Scene Space (Render Relative)**:
   - For rendering, the **Real Camera** is strictly locked to `(0, 0, 0)` at the origin.
   - The entire `UniverseGroup` (containing Sun, Planets, Stars) is shifted by the inverse of the virtual camera's position.
   - `UniversePosition = -VirtualCameraPosition`

**Result**:
- The camera is always locally at `0,0,0`.
- Objects near the camera have small coordinate values, maximizing floating-point precision where it matters most.
- This allows smooth, jitter-free rendering of detailed geometry (like spacecraft models) even when "billions of kilometers" away from the Sun.

## 7. Mission Trajectory Precision Architecture (Critical!)

> **⚠️ IMPORTANT**: This section documents an essential anti-jitter technique that took hours to discover. Do not modify without understanding the full implications.

### The Problem: Floating Point Jitter

Standard Three.js rendering fails at astronomical scales because the `modelViewMatrix` is processed in 32-bit float on the GPU. When world coordinates are large (e.g., 48 AU ≈ 7 billion km), the precision of a 32-bit matrix is insufficient to represent millimeter-level movements, resulting in visible "jitter" or "shaking" when the camera moves.

### The Solution: Manual View-Space Transformation

To maintain rock-solid stability, we bypass the standard Three.js transformation pipeline for mission trajectories:

#### 1. CPU-Side Rebasing (64-bit)

All trajectory points are rebased on the CPU using 64-bit floats (JavaScript `Number`) relative to the camera:

```javascript
// globalOffset ≈ -cameraLogicalPosition (set via universeGroup)
const globalOffset = new THREE.Vector3(0, 0, 0);
if (universeGroup) globalOffset.add(universeGroup.position);
if (missionGroup) globalOffset.add(missionGroup.position);

// Rebase each vertex
const rebasedPos = rawWorldPos + globalOffset;  // Result is near (0, 0, 0)
```

This ensures the values sent to the GPU are small (centered around the camera).

> **Note**: Do NOT subtract `camera.position` here - the floating origin system already handles camera offset via `universeGroup.position`.

#### 2. Identity Model Matrix

The trajectory mesh world position is kept at `(0,0,0)` with `matrixAutoUpdate = false`:

```javascript
line.matrixAutoUpdate = false;
line.position.set(0, 0, 0);
line.updateMatrix();
line.updateMatrixWorld(true);
```

This prevents the `modelMatrix` from introducing large offsets.

#### 3. Shader-Level Transformation

We bypass `modelViewMatrix` in the Vertex Shader and use a custom uniform `uViewRotationMatrix` (which contains only the camera's rotation, no translation):

```glsl
gl_Position = projectionMatrix * uViewRotationMatrix * vec4(rebasedPosition, 1.0);
```

### Constraints for Future Fixes

| Constraint | Reason |
|------------|--------|
| **Never use `modelViewMatrix` or `modelMatrix`** | Large coordinates cause 32-bit precision loss |
| **Never use `setPositions()` with Int32 or number[]** | Must use `Float32Array` for vertex data |
| **Maintain frame sync** | First vertex of trajectory must update in same frame as probe position |
| **Probe alignment** | 3D probe models must use same `globalOffset` and `matrixAutoUpdate=false` |

### Why This Works

| Component | Transform Behavior | Vertex Coords | World Position |
|-----------|-------------------|---------------|----------------|
| Line2 (trajectory) | matrixAutoUpdate=false | offset (~0) | ~0 |
| Probe (spacecraft) | matrixAutoUpdate=false | offset (~0) | ~0 |
| Regular Object3D | Normal hierarchy | heliocentric | transformed by parents |

Both lines and probes use the same `globalOffset` and have `matrixAutoUpdate=false`, so they:
1. Have vertices/positions near 0 (GPU precision preserved)
2. Don't get parent transforms (no double-offset)
3. Stay aligned with each other

### Common Mistakes to Avoid

1. **❌ Don't use raw heliocentric coords for Line2**: Causes GPU jitter at large distances
2. **❌ Don't apply globalOffset with matrixAutoUpdate=true**: Causes double-transform
3. **❌ Don't mix coordinate systems**: Lines and probes must use the SAME offset calculation
4. **❌ Don't subtract camera.position in globalOffset**: Already handled by universeGroup
5. **❌ Don't forget to call updateMatrix()**: Required after setting position with matrixAutoUpdate=false

### Files Involved

- `missionGeometry.ts`: Line2 creation with matrixAutoUpdate=false
- `missionUpdates.ts`: Green line and red line vertex generation with globalOffset
- `missionProbes.ts`: Probe positioning with globalOffset and matrixAutoUpdate=false
- `MissionLineMaterial.ts`: Custom shader with uViewRotationMatrix uniform
