import type { PlanetWrapper } from '../../types';
import { MiniOrrery } from '../components/MiniOrrery';

// Interface for controls that provide virtual position and target
interface VirtualPositionProvider {
  getVirtualPosition(): { x: number; y: number; z: number };
  getVirtualTarget(): { x: number; y: number; z: number };
}

export function setupMiniOrreryTab(
  container: HTMLElement,
  planets: PlanetWrapper[],
  controls: VirtualPositionProvider
): { update: () => void } {
  // 1. Container Styles
  container.classList.add('mini-orrery-container');
  container.style.position = 'relative';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.height = '100%';
  container.style.minHeight = '300px';
  container.style.background = '#000'; // Black background for radar
  container.style.overflow = 'hidden';

  // 2. MiniOrrery Instance
  const miniOrrery = new MiniOrrery();
  miniOrrery.init(container);

  // 3. UI Overlays (Scale Indicator)
  const scaleIndicator = document.createElement('div');
  scaleIndicator.className = 'mini-orrery-scale';
  scaleIndicator.textContent = 'Planetary System';

  // Style the indicator (Holographic look)
  scaleIndicator.style.position = 'absolute';
  scaleIndicator.style.top = '10px';
  scaleIndicator.style.left = '10px';
  scaleIndicator.style.color = '#00ffff';
  scaleIndicator.style.fontFamily = "'Courier New', monospace";
  scaleIndicator.style.fontSize = '12px';
  scaleIndicator.style.textShadow = '0 0 5px #00ffff';
  scaleIndicator.style.pointerEvents = 'none'; // Click-through
  scaleIndicator.style.opacity = '0.8';

  container.appendChild(scaleIndicator);

  // 4. Set up scale change callback to update label
  miniOrrery.setOnScaleChange((scale) => {
    if (scale === 'planetary') {
      scaleIndicator.textContent = 'Planetary System';
    } else if (scale === 'solar') {
      scaleIndicator.textContent = 'Inner Solar System';
    } else {
      scaleIndicator.textContent = 'Outer Solar System';
    }
  });

  // Return update hook
  return {
    update: () => {
      miniOrrery.update(planets, controls);
    },
  };
}
