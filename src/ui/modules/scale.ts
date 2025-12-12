/**
 * @file scale.ts
 * @deprecated Scale controls have been moved to systemTab.ts
 */
export function setupScaleFolder(): { setScalePreset: () => void } {
  console.warn('setupScaleFolder is deprecated. Use setupSystemTab instead.');
  return { setScalePreset: () => {} };
}
