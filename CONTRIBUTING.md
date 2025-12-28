# Contributing to White Rabbit

Thank you for your interest in contributing to the White Rabbit solar system simulator! This guide will help you understand how to contribute effectively.

## Table of Contents

- [Getting Started](#getting-started)
- [Code Style Guidelines](#code-style-guidelines)
- [Project Structure](#project-structure)
- [How to Add New Features](#how-to-add-new-features)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Git

### Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/white-rabbit.git
   cd white-rabbit
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** to `http://localhost:5173`

---

## Code Style Guidelines

### General Principles

- **Clarity over cleverness**: Write code that is easy to understand
- **Document complex logic**: Add inline comments for non-obvious calculations
- **Use meaningful names**: Variables and functions should be self-documenting
- **Follow existing patterns**: Match the style of surrounding code

### TypeScript Conventions

```typescript
// ✅ Good: Descriptive function names with type annotations
/**
 * Calculates moon orbital distance with compound scaling
 */
function calculateMoonDistance(baseDistance: number, planetScale: number): number {
    // Compound scaling: AU → scene units → artistic factor
    return baseDistance * AU_TO_SCENE * planetScale * REAL_PLANET_SCALE_FACTOR;
}

// ❌ Bad: Unclear names, no types, no documentation
function calcDist(d: any, s: any) {
    return d * 50 * s * 500;
}
```

### File Organization

- **Imports at the top**: Group by external libraries, then internal modules
- **Constants after imports**: Define constants before functions
- **Export functions explicitly**: Use `export function` or `export const`
- **One responsibility per file**: Each file should have a clear, single purpose

### Documentation Standards

#### TypeScript Types and JSDoc Comments

Use TypeScript type annotations for all parameters and return values. Add JSDoc comments for documentation:

```typescript
/**
 * Brief description of what the function does
 * 
 * Longer explanation if needed, can span multiple lines
 */
export function functionName(
    paramName: ParamType,
    optionalParam?: OptionalType
): ReturnType {
    // Implementation
}
```

#### Inline Comments

Add inline comments for:
- **Complex calculations**: Explain the math
- **Non-obvious logic**: Why, not just what
- **Performance considerations**: Note any optimizations
- **Coordinate transformations**: Three.js uses different axes

Example:
```typescript
// J2000 epoch: Standard astronomical reference point (Jan 1, 2000, 12:00 UTC)
const J2000: number = new Date('2000-01-01T12:00:00Z').getTime();

// Calculate rotation: (elapsed hours / period) × full rotation (2π radians)
const rotationAngle: number = (hoursSinceJ2000 / rotationPeriod) * 2 * Math.PI;
```

---

## Project Structure

Understanding the architecture will help you contribute effectively. The project uses **TypeScript** for type safety.

```
src/
├── main.ts                 # Application entry point
├── config.ts               # Global configuration and constants
├── types.ts                # Shared TypeScript interfaces and types
├── api/                    # External API interfaces
│   └── SimulationControl.ts # Simulation control API
├── controls/               # User input handling
│   ├── CameraControls.ts   # Camera movement and zoom
│   └── InputHandler.ts     # Keyboard/mouse input
├── core/                   # Core rendering logic
│   ├── Simulation.ts       # Main simulation loop
│   ├── VirtualOrigin.ts    # Large-scale coordinate handling
│   ├── planets.ts          # Planet creation and updates
│   ├── scene.ts           # Three.js scene setup
│   └── stars.ts           # Starfield and constellation rendering
├── data/                   # Static data definitions
│   ├── bodies.ts          # Planet orbital/physical properties
│   ├── constellationNames.ts # Constellation identifiers
│   ├── missions.ts        # Space mission trajectory data
│   ├── moonData.ts        # Moon orbital parameters
│   ├── sun.ts             # Solar parameters
│   └── zodiac.ts          # Zodiac constellation data
├── features/               # Application features
│   ├── events.ts          # Event handling utilities
│   ├── focusMode.ts       # Camera tracking and focus
│   └── missions/          # Space mission visualization
│       ├── index.ts       # Barrel exports
│       ├── geometry.ts    # Trajectory geometry calculations
│       ├── interaction.ts # Mission click/hover handling
│       ├── probes.ts      # Probe 3D models
│       ├── state.ts       # Mission state management
│       ├── trajectory.ts  # Trajectory line rendering
│       └── updates.ts     # Real-time mission updates
├── managers/               # Resource and state managers
│   └── TextureManager.ts  # Texture loading and caching
├── materials/              # Custom Three.js materials
│   ├── MaterialFactory.ts # Material creation utilities
│   ├── MissionLineMaterial.ts # Mission trajectory shader
│   ├── OrbitLineMaterial.ts # Orbit line shader
│   ├── OrbitMaterial.ts   # Orbit path rendering
│   └── SunMaterial.ts     # Solar corona shader
├── physics/                # Pure physics calculations
│   └── orbits.ts          # Keplerian orbit math
├── services/               # External service integrations
│   └── MusicService.ts    # Background music handling
├── systems/                # Visual subsystems
│   ├── coordinates.ts     # Coordinate system helpers
│   ├── habitableZone.ts   # Habitable zone visualization
│   ├── magneticFields.ts  # Planetary magnetic field rendering
│   ├── moons.ts           # Moon management
│   ├── music.ts           # Music playback system
│   ├── orbits.ts          # Orbit line visualization
│   ├── rabbit.ts          # Intro animation
│   ├── relativeOrbits.ts  # Relative orbit calculations
│   ├── rings.ts           # Planetary ring rendering
│   ├── tooltips/          # Hover tooltip subsystem
│   └── zodiacSigns.ts     # Zodiac constellation markers
├── ui/                     # User interface
│   ├── gui.ts             # Main GUI orchestrator
│   ├── MenuDock.ts        # Dockable menu system
│   ├── WindowManager.ts   # Floating window management
│   ├── components/        # Reusable UI components
│   ├── modules/           # UI feature modules
│   │   ├── TabbedWindow.ts # Tabbed panel component
│   │   ├── about.ts       # About dialog
│   │   ├── credit.ts      # Credits display
│   │   ├── events.ts      # Astronomical events panel
│   │   ├── find.ts        # Search/find functionality
│   │   ├── miniOrreryTab.ts # Mini solar system view
│   │   ├── missionsTab.ts # Mission browser panel
│   │   ├── navigation.ts  # Navigation controls
│   │   ├── sound.ts       # Sound/music controls
│   │   ├── starsTab.ts    # Star visibility options
│   │   ├── stats.ts       # Performance statistics
│   │   ├── system.ts      # System settings
│   │   ├── systemTab.ts   # Solar system object list
│   │   ├── time.ts        # Time controls
│   │   └── visual/        # Visual settings modules
│   └── styles/            # UI-specific CSS
└── utils/                  # Utility functions
    ├── Octree.ts          # Spatial partitioning for stars
    ├── formatting.ts      # Number/text formatting
    ├── logger.ts          # Debug logging utilities
    ├── screenSpace.ts     # Screen coordinate utilities
    ├── utils.ts           # General utilities
    └── vectorUtils.ts     # 3D vector math helpers
```

### Key Design Principles

1. **Separation of Concerns**
   - `physics/`: Pure math, no Three.js dependencies
   - `core/`: Three.js rendering logic
   - `data/`: Static definitions
   - `materials/`: Custom shaders and materials
   - `ui/`: User interface

2. **Single Source of Truth**
   - `config.ts`: All global state
   - `config.date`: Current simulation time

3. **Modular UI**
   - Each module in `ui/modules/` is self-contained
   - Imported and orchestrated by `gui.ts`

4. **Type Safety**
   - All code is TypeScript
   - Shared types defined in `types.ts`

### Coordinate Systems
    
The simulation uses the **Equatorial Coordinate System (J2000 epoch)** as its primary reference frame. This is standard in astronomy and matches the data provided by `astronomy-engine`.

- **X-Axis**: Points towards the Vernal Equinox (First Point of Aries).
- **Y-Axis**: Points towards the North Celestial Pole (parallel to Earth's rotation axis).
- **Z-Axis**: Perpendicular to X and Y (Right-handed system).

**Important Note on the Ecliptic Plane**:
The planets orbit in the **Ecliptic Plane**, which is tilted relative to the Equatorial plane by Earth's axial tilt (obliquity), approximately **23.4 degrees**.
- When adding features that align with planetary orbits (like the Habitable Zone), you must apply this tilt.
- Rotation: `rotation.x = 23.4 * (Math.PI / 180)` (if starting from XZ plane).

---

## How to Add New Features

### Adding a New Planet or Moon

1. **Edit `src/data/bodies.ts`** or `src/data/moonData.ts`:

```typescript
// In planetData array
{
    name: "NewPlanet",
    body: "Body",                    // Astronomy Engine identifier
    radius: 1.5,                     // Relative to Earth
    period: 687,                     // Orbital period in days
    rotationPeriod: 24.6,           // Rotation in hours
    axialTilt: 25.2,                // Degrees
    texture: `${import.meta.env.BASE_URL}assets/textures/newplanet.jpg`,
    details: {
        mass: "...",
        // ... other details
    }
}
```

2. **Add texture** to `public/assets/textures/`
3. **Test** by running `npm run dev`

### Adding a New UI Control

1. **Create a new module** in `src/ui/modules/`:

```typescript
// src/ui/modules/myfeature.ts
import type GUI from 'lil-gui';
import type { Config } from '../../config';

export function setupMyFeatureFolder(gui: GUI, config: Config): GUI {
    const folder = gui.addFolder('My Feature');
    
    folder.add(config, 'myOption').name('My Option');
    
    folder.close(); // Closed by default
    
    return folder;
}
```

2. **Import and use** in `src/ui/gui.ts`:

```typescript
import { setupMyFeatureFolder } from './modules/myfeature';

// In setupGUI function:
setupMyFeatureFolder(gui, config);
```

### Adding Physics Calculations

1. **Add to `src/physics/orbits.ts`** for pure math
2. **Keep it framework-agnostic** (no Three.js)
3. **Document the math** with comments and type annotations
4. **Use consistent units**: AU for distances, days for time

Example:
```typescript
/**
 * Calculates orbital velocity using vis-viva equation
 */
export function calculateOrbitalVelocity(a: number, r: number): number {
    const GM = 0.0002959122; // Gravitational parameter (AU³/day²)
    return Math.sqrt(GM * ((2 / r) - (1 / a)));
}
```

---

## Code Quality

### Linting and Formatting

This project uses **Biome** for code linting and formatting. Always run these commands before committing:

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Run both linting and formatting
npm run check
```

**Best Practices**:
- Run `npm run check` before committing to catch issues early
- Fix all linting errors before submitting a pull request
- Biome will automatically format your code to match project style

### File Placement Guidelines

**When to create a new file in `systems/` vs `features/`:**
- **`systems/`**: Self-contained visual or physics systems (orbits, rings, moons, stars, magnetic fields)
- **`features/`**: User-facing application features (focus mode, missions, interactions)

**When to add to `core/` vs create a new module:**
- **`core/`**: Fundamental rendering logic directly tied to the main scene graph (planets, stars, scene setup)
- **New module**: Specialized functionality that can be independently managed

---

## Testing

### Manual Testing Checklist

Before submitting changes, verify:

- [ ] **Development server runs** without errors (`npm run dev`)
- [ ] **Production build succeeds** (`npm run build`)
- [ ] **No console errors** in browser DevTools
- [ ] **Feature works** as expected across different:
  - Time speeds (paused, real-time, fast-forward)
  - Scale settings (realistic, artistic, custom)
  - Planet/moon visibility toggles
- [ ] **UI remains responsive** (no performance issues)
- [ ] **Tooltips display correctly**
- [ ] **Focus mode works** (double-click objects)

### Testing Your Changes

```bash
# Run development server
npm run dev

# Build for production (tests build process)
npm run build

# Preview production build
npm run preview
```

### Browser Testing

Test in at least:
- **Chrome/Edge** (Chromium)
- **Firefox**
- **Safari** (if on macOS)

---

## Submitting Changes

### Commit Messages

Use clear, descriptive commit messages:

```bash
# ✅ Good
git commit -m "Add Jupiter's Europa moon with tidal locking"
git commit -m "Fix: Correct Mars rotation period to 24.6 hours"
git commit -m "Docs: Add JSDoc to calculateKeplerianPosition"

# ❌ Bad
git commit -m "fixed stuff"
git commit -m "update"
```

### Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly** (see [Testing](#testing))

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: Description of changes"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```

6. **Create a Pull Request** on GitHub:
   - Provide a clear title
   - Describe what changed and why
   - Include screenshots/videos for UI changes
   - Reference any related issues

### Pull Request Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Changes Made
- Change 1
- Change 2

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots or GIFs showing the changes
```

---

## Additional Resources

- **README.md**: Project overview and architecture
- **Three.js Docs**: https://threejs.org/docs/
- **Astronomy Engine**: https://github.com/cosinekitty/astronomy
- **lil-gui**: https://lil-gui.georgealways.com/

---

## Questions?

If you have questions about contributing:
- Open an issue on GitHub
- Check existing issues for similar questions
- Review the README.md for architecture details

---

## Code of Conduct

- **Be respectful** and constructive
- **Help others** learn and grow
- **Keep discussions** focused and productive
- **Credit contributors** for their work

Thank you for contributing to White Rabbit! 🐇✨
