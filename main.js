import * as THREE from 'three';
import { config } from './config.js';
import { createScene } from './scene.js';
import { createStarfield, createConstellations } from './stars.js';
import { createPlanets, updatePlanets } from './planets.js';
import { setupGUI, updateUI } from './ui.js';

// --- Init ---
(async () => {
    try {
        // 1. Setup Scene
        const { scene, camera, renderer, controls, orbitGroup, zodiacGroup } = createScene();
        zodiacGroup.visible = config.showZodiacs;

        // 2. Create Stars & Constellations
        const stars = await createStarfield(scene);
        await createConstellations(zodiacGroup);

        // 3. Create Planets & Sun
        const { planets, sun } = createPlanets(scene, orbitGroup);

        // 4. Setup GUI
        const uiControls = setupGUI(planets, sun, orbitGroup, zodiacGroup);

        // 5. Screen-space mouseover for stars, planets, moons, and sun
        const tooltip = document.getElementById('tooltip');
        const screenHitRadius = 10; // Pixels on screen for hit detection

        window.addEventListener('mousemove', (event) => {
            // Get mouse position in pixels
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // Update tooltip position
            tooltip.style.left = mouseX + 15 + 'px';
            tooltip.style.top = mouseY + 15 + 'px';

            let closestObject = null;
            let closestDistance = screenHitRadius;

            // Helper function to check an object
            const checkObject = (mesh, objectData, objectType) => {
                if (!mesh || !mesh.position) return;

                // Get world position
                const worldPos = new THREE.Vector3();
                mesh.getWorldPosition(worldPos);

                // Project to screen space
                const projected = worldPos.clone().project(camera);

                // Convert to pixel coordinates
                const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
                const screenY = (-(projected.y * 0.5) + 0.5) * window.innerHeight;

                // Calculate 2D pixel distance from mouse
                const dx = mouseX - screenX;
                const dy = mouseY - screenY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Check if this object is closer than the current closest
                if (distance < closestDistance) {
                    // Also check if object is in front of camera
                    if (projected.z < 1 && projected.z > -1) {
                        closestDistance = distance;
                        closestObject = { data: objectData, type: objectType, worldPos: worldPos };
                    }
                }
            };

            // Check the Sun
            checkObject(sun, { name: 'Sun', radius: 5 }, 'sun');

            // Check all planets
            planets.forEach(planet => {
                checkObject(planet.mesh, planet.data, 'planet');

                // Check all moons of this planet
                if (planet.moons) {
                    planet.moons.forEach(moon => {
                        checkObject(moon.mesh, moon.data, 'moon');
                    });
                }
            });

            // Check all stars
            if (stars) {
                const positions = stars.geometry.attributes.position.array;
                const starData = stars.userData.starData;

                for (let i = 0; i < starData.length; i++) {
                    const x = positions[i * 3];
                    const y = positions[i * 3 + 1];
                    const z = positions[i * 3 + 2];

                    const starPos = new THREE.Vector3(x, y, z);
                    const projected = starPos.clone().project(camera);

                    const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
                    const screenY = (-(projected.y * 0.5) + 0.5) * window.innerHeight;

                    const dx = mouseX - screenX;
                    const dy = mouseY - screenY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < closestDistance) {
                        if (projected.z < 1 && projected.z > -1) {
                            closestDistance = distance;
                            closestObject = { data: starData[i], type: 'star' };
                        }
                    }
                }
            }

            // Display tooltip based on object type
            if (closestObject) {
                let html = '';
                const data = closestObject.data;

                if (closestObject.type === 'sun') {
                    html = `
                        <strong>Name:</strong> Sun<br>
                        <strong>Type:</strong> G-type Main Sequence Star<br>
                        <strong>Radius:</strong> 696,000 km<br>
                    `;
                } else if (closestObject.type === 'planet') {
                    const distanceFromSun = closestObject.worldPos ?
                        (closestObject.worldPos.length() / 50).toFixed(2) : 'N/A';
                    html = `
                        <strong>Name:</strong> ${data.name}<br>
                        <strong>Type:</strong> Planet<br>
                        <strong>Orbital Period:</strong> ${data.period.toFixed(1)} days<br>
                        <strong>Distance from Sun:</strong> ${distanceFromSun} AU<br>
                    `;
                } else if (closestObject.type === 'moon') {
                    html = `
                        <strong>Name:</strong> ${data.name}<br>
                        <strong>Type:</strong> Moon<br>
                        <strong>Orbital Period:</strong> ${data.period.toFixed(1)} days<br>
                    `;
                } else if (closestObject.type === 'star') {
                    const distance = data.distance ? data.distance.toFixed(1) : "N/A";
                    const luminosity = data.radius ? data.radius.toFixed(1) : "N/A";
                    html = `
                        <strong>Name:</strong> ${data.name}<br>
                        <strong>Distance:</strong> ${distance} LY<br>
                        <strong>Luminosity Index:</strong> ${luminosity}<br>
                        <strong>Catalog ID:</strong> ${data.id}<br>
                    `;
                }

                tooltip.innerHTML = html;
                tooltip.style.display = 'block';
                document.body.style.cursor = 'pointer';
            } else {
                tooltip.style.display = 'none';
                document.body.style.cursor = 'default';
            }
        });

        // 6. Remove Loading Screen
        document.getElementById('loading').style.opacity = 0;

        // 7. Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            if (!config.stop) {
                const daysPerFrame = config.simulationSpeed / 60;
                config.date.setTime(config.date.getTime() + daysPerFrame * 24 * 60 * 60 * 1000);
            }

            updateUI(uiControls.uiState, uiControls);
            updatePlanets(planets);

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
