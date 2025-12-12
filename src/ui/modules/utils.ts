import { Controller } from 'lil-gui';

/**
 * Helper to add custom value display next to slider
 * @param {Controller} controller - The lil-gui controller
 * @param {Function} formatFn - Function to format the value
 * @returns {Object} Object containing update function
 */
export function addValueDisplay(controller: Controller, formatFn: (val: any) => string) {
  const display = document.createElement('div');
  display.className = 'custom-value';
  const widget = controller.domElement.querySelector('.widget');
  if (widget) widget.appendChild(display);

  const update = () => {
    display.textContent = formatFn(controller.getValue());
  };

  // Hook into onChange to update display immediately
  const originalOnChange = (controller as any)._onChange;
  controller.onChange((val: any) => {
    update();
    if (originalOnChange) originalOnChange(val);
  });

  update(); // Initial update
  return { update }; // Return interface to force update
}
