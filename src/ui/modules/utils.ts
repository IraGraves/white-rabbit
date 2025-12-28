import type { Controller } from 'lil-gui';

/**
 * Helper to add custom value display next to slider
 * @param {Controller} controller - The lil-gui controller
 * @param {Function} formatFn - Function to format the value
 * @returns {Object} Object containing update function
 */
export function addValueDisplay(controller: Controller, formatFn: (val: unknown) => string) {
  const display = document.createElement('div');
  display.className = 'custom-value';
  const widget = controller.domElement.querySelector('.widget');
  if (widget) widget.appendChild(display);

  const update = () => {
    display.textContent = formatFn(controller.getValue());
  };

  // Hook into onChange to update display immediately

  const originalOnChange = (controller as unknown as Record<string, unknown>)._onChange as
    | ((val: unknown) => void)
    | undefined;
  controller.onChange((val: unknown) => {
    update();
    if (originalOnChange) originalOnChange(val);
  });

  update(); // Initial update
  return { update }; // Return interface to force update
}
