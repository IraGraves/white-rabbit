import { config, REAL_PLANET_SCALE_FACTOR, REAL_SUN_SCALE_FACTOR } from '../../config.js';
import { addValueDisplay } from './utils.js';

export function setupScaleFolder(gui, uiState, planets, sun) {
    const scaleFolder = gui.addFolder('Scale');

    // Flag to prevent switching to Custom when preset is being applied
    let isPresetChanging = false;

    const presetController = scaleFolder.add(uiState, 'scalePreset', ['Realistic', 'Artistic', 'Custom']).name('Scale Preset').onChange(val => {
        isPresetChanging = true;
        if (val === 'Realistic') {
            sunSlider.setValue(1 / REAL_SUN_SCALE_FACTOR);
            planetSlider.setValue(1 / REAL_PLANET_SCALE_FACTOR);
        } else if (val === 'Artistic') {
            sunSlider.setValue(1.0);
            planetSlider.setValue(1.0);
        }
        // Custom doesn't change values, just indicates manual adjustment
        isPresetChanging = false;
    });

    const minSunScale = 1 / REAL_SUN_SCALE_FACTOR;
    const sunSlider = scaleFolder.add(config, 'sunScale', minSunScale, 5).name('Sun Scale').onChange(val => {
        sun.scale.setScalar(val);
        uiState.sunScaleDisplay = (val * REAL_SUN_SCALE_FACTOR).toFixed(1) + 'x';
        // Switch to Custom if user manually adjusts
        if (!isPresetChanging && uiState.scalePreset !== 'Custom') {
            uiState.scalePreset = 'Custom';
            presetController.updateDisplay();
        }
    });
    sunSlider.domElement.classList.add('hide-value');
    const sunDisplay = addValueDisplay(sunSlider, val => (val * REAL_SUN_SCALE_FACTOR).toFixed(1) + 'x');

    const minPlanetScale = 1 / REAL_PLANET_SCALE_FACTOR;
    const planetSlider = scaleFolder.add(config, 'planetScale', minPlanetScale, 5).name('Planet Scale').onChange(val => {
        planets.forEach(p => {
            p.mesh.scale.setScalar(val);
            p.moons.forEach(m => m.mesh.scale.setScalar(val));
        });
        uiState.planetScaleDisplay = (val * REAL_PLANET_SCALE_FACTOR).toFixed(0) + 'x';
        // Switch to Custom if user manually adjusts
        if (!isPresetChanging && uiState.scalePreset !== 'Custom') {
            uiState.scalePreset = 'Custom';
            presetController.updateDisplay();
        }
    });
    planetSlider.domElement.classList.add('hide-value');
    const planetDisplay = addValueDisplay(planetSlider, val => (val * REAL_PLANET_SCALE_FACTOR).toFixed(0) + 'x');

    scaleFolder.add(config, 'capMoonOrbits')
        .name('Cap Moon Orbit Size')
        .onChange(() => {
            // Moon positions will be updated in the next animation frame
        });

    scaleFolder.close(); // Close Scale folder by default

    return { sunDisplay, planetDisplay };
}
