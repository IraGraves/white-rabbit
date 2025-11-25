import * as THREE from 'three';
import { config } from './src/config.js';
import { createScene } from './src/core/scene.js';
import { createStarfield, createConstellations } from './src/core/stars.js';
import { createPlanets, updatePlanets } from './src/core/planets.js';
import { setupGUI, updateUI } from './src/ui/gui.js';
import { setupTooltipSystem } from './interactions.js';
import { setupFocusMode, updateFocusMode } from './src/features/focusMode.js';
import { initializeMissions, updateMissions } from './src/features/missions.js';

// --- Init ---
(async () => {
    try {
        const loading = document.getElementById('loading');
        loading.textContent = 'Initializing... (Base: ' + import.meta.env.BASE_URL + ')';

        // 1. Setup Scene
        loading.textContent = 'Creating Scene...';
        const { scene, camera, renderer, controls, orbitGroup, zodiacGroup } = createScene();
        zodiacGroup.visible = config.showZodiacs;

        // 2. Create Stars & Constellations
        loading.textContent = 'Loading Stars...';
        const stars = await createStarfield(scene);
        if (!stars) throw new Error("Failed to load stars (check console)");

        loading.textContent = 'Loading Constellations...';
        await createConstellations(zodiacGroup);

        // 3. Create Planets & Sun
        loading.textContent = 'Loading Planets...';
        const { planets, sun } = createPlanets(scene, orbitGroup);

        // 4. Setup GUI
        loading.textContent = 'Setting up GUI...';
        const uiControls = setupGUI(planets, sun, orbitGroup, zodiacGroup, stars, renderer);

        // 5. Setup interactive tooltip system
        setupTooltipSystem(camera, planets, sun, stars);

        // 6. Setup focus mode (double-click to zoom)
        setupFocusMode(camera, controls, planets, sun);

        // 7. Initialize mission trajectories
        initializeMissions(scene);
        window.updateMissions = updateMissions; // Make available to UI

        // 7. Remove Loading Screen
        loading.style.opacity = 0;

        // 8. Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();

            if (!config.stop) {
                const secondsToAdd = config.simulationSpeed * delta;
                config.date.setTime(config.date.getTime() + secondsToAdd * 1000);
            }

            updateUI(uiControls.uiState, uiControls);
            updatePlanets(planets, sun);

            // Update focus mode (handles camera following)
            updateFocusMode(camera, controls);

            controls.update();
            renderer.render(scene, camera);
        }

        animate();

    } catch (error) {
        console.error('Initialization error:', error);
        document.getElementById('loading').textContent = 'Error loading simulation: ' + error.message;
        document.getElementById('loading').style.color = 'red';
    }
})();
