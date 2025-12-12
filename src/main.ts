/**
 * @file main.ts
 * @description Main entry point for the White Rabbit solar system simulator.
 *
 * This file instantiates the Simulation class which orchestrates the application.
 */

import { Simulation } from './core/Simulation';
import './ui/styles/ui.css'; // Import UI styles

// --- Init ---
window.onerror = (
  message: string | Event,
  source?: string,
  lineno?: number,
  _colno?: number,
  _error?: Error
) => {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.textContent = `Error: ${message} at ${source}:${lineno}`;
    loading.style.color = 'red';
  }
};
(async () => {
  const sim = new Simulation();
  await sim.init();
})();
