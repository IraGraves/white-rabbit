import * as THREE from 'three';
import * as Astronomy from 'astronomy-engine';
import { config, AU_TO_SCENE } from './src/config.js';

const SCREEN_HIT_RADIUS = 10; // Pixels on screen for hit detection

/**
 * Sets up the interactive tooltip system for celestial objects
 * @param {THREE.Camera} camera - The scene camera
 * @param {Array} planets - Array of planet objects
 * @param {THREE.Mesh} sun - The sun mesh
 * @param {Object} starsRef - Reference to the starfield points object
 */
export function setupTooltipSystem(camera, planets, sun, starsRef) {
    const tooltip = document.getElementById('tooltip');
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
        // Calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Tooltip positioning is now handled after content update to ensure it stays on screen

        let closestObject = null;
        let closestDistance = Infinity;

        // 1. Check Planets, Sun, and Moons using Raycaster
        const interactableObjects = [sun];
        planets.forEach(p => {
            interactableObjects.push(p.mesh);
            if (p.moons) {
                p.moons.forEach(m => interactableObjects.push(m.mesh));
            }
        });

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactableObjects, true);

        if (intersects.length > 0) {
            // Found a 3D object
            const hit = intersects[0];
            const objectData = getObjectData(hit.object, planets, sun);
            if (objectData) {
                closestObject = objectData;
                closestDistance = 0; // Priority over stars
            }
        }

        // 2. Check Stars (only if no 3D object found or to find closest star)
        // If we already hit a planet/sun, we skip stars to avoid confusion
        if (!closestObject) {
            const stars = starsRef.value;
            if (stars) {
                const positions = stars.geometry.attributes.position.array;
                const starData = stars.userData.starData;

                // Optimization: Only check stars if we are not hovering a planet
                // We iterate through all stars - this can be optimized with a spatial index if needed
                // but for ~5000 stars it's usually fine.

                // We need to find the closest star in screen space
                let minScreenDist = SCREEN_HIT_RADIUS;

                for (let i = 0; i < starData.length; i++) {
                    const x = positions[i * 3];
                    const y = positions[i * 3 + 1];
                    const z = positions[i * 3 + 2];

                    const starPos = new THREE.Vector3(x, y, z);

                    // Project star position to screen space
                    // We clone to avoid modifying the original vector
                    const projected = starPos.clone().project(camera);

                    // Check if star is in front of camera
                    if (projected.z < 1 && projected.z > -1) {
                        const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
                        const screenY = (-(projected.y * 0.5) + 0.5) * window.innerHeight;

                        const dx = mouseX - screenX;
                        const dy = mouseY - screenY;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < minScreenDist) {
                            minScreenDist = dist;
                            closestObject = { data: starData[i], type: 'star' };
                        }
                    }
                }
            }
        }

        // Display tooltip based on object type
        if (closestObject) {
            tooltip.innerHTML = formatTooltip(closestObject);
            tooltip.style.display = 'block';
            document.body.style.cursor = 'pointer';

            // Smart positioning to keep tooltip on screen
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;
            const margin = 15;

            let left = mouseX + margin;
            let top = mouseY + margin;

            // Check right edge
            if (left + tooltipWidth > window.innerWidth) {
                left = mouseX - tooltipWidth - margin;
            }

            // Check bottom edge
            if (top + tooltipHeight > window.innerHeight) {
                top = mouseY - tooltipHeight - margin;
            }

            // Ensure it doesn't go off top/left
            if (left < 0) left = margin;
            if (top < 0) top = margin;

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        } else {
            tooltip.style.display = 'none';
            document.body.style.cursor = 'default';
        }
    });
}

/**
 * Helper to map mesh back to data object
 */
function getObjectData(mesh, planets, sun) {
    if (mesh === sun || mesh.parent === sun) {
        return { type: 'sun', data: {} };
    }

    for (const p of planets) {
        if (p.mesh === mesh || p.mesh === mesh.parent) {
            return { type: 'planet', data: p.data, worldPos: p.mesh.position };
        }
        if (p.moons) {
            for (const m of p.moons) {
                if (m.mesh === mesh || m.mesh === mesh.parent) {
                    return { type: 'moon', data: m.data };
                }
            }
        }
    }
    return null;
}

/**
 * Formats the tooltip HTML based on the object type
 * @param {Object} closestObject - Object containing data and type
 * @returns {string} HTML string for the tooltip
 */
function formatTooltip(closestObject) {
    try {
        const data = closestObject.data;

        if (closestObject.type === 'sun') {
            return `
                <strong>Name:</strong> Sun<br>
                <strong>Type:</strong> G-type Main Sequence Star<br>
                <strong>Radius:</strong> 696,000 km<br>
            `;
        } else if (closestObject.type === 'planet') {
            let detailsHtml = '';
            if (data.details) {
                detailsHtml = `
                    <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.2); margin: 5px 0;">
                    <strong>Radius:</strong> ${data.radius} Earths<br>
                    <strong>Mass:</strong> ${data.details.mass}<br>
                    <strong>Density:</strong> ${data.details.density}<br>
                    <strong>Gravity:</strong> ${data.details.gravity}<br>
                    <strong>Albedo:</strong> ${data.details.albedo}<br>
                    <strong>Surface Temp:</strong> ${data.details.temp}<br>
                    <strong>Surface Pressure:</strong> ${data.details.pressure}<br>
                    <strong>Solar Day:</strong> ${data.details.solarDay}<br>
                    <strong>Sidereal Day:</strong> ${data.details.siderealDay}<br>
                    <strong>Axial Tilt:</strong> ${data.axialTilt}°<br>
                    <strong>Eccentricity:</strong> ${data.details.eccentricity}<br>
                    <strong>Inclination:</strong> ${data.details.inclination}<br>
                `;
            }

            let liveHtml = '';
            // Check if we have a valid body identifier and Astronomy engine is available
            if (data.body && Astronomy && Astronomy.Body && Astronomy.Body[data.body]) {
                try {
                    const date = config.date instanceof Date ? config.date : new Date();
                    const body = Astronomy.Body[data.body];

                    // Live Calculations
                    const elements = Astronomy.OrbitalElements(body, date);
                    const helio = Astronomy.HelioVector(body, date);
                    const geo = Astronomy.GeoVector(body, date);

                    const trueAnomaly = elements.nu.toFixed(1);
                    const vAuDay = Math.sqrt(helio.vx ** 2 + helio.vy ** 2 + helio.vz ** 2);
                    const vKmS = (vAuDay * 149597870.7 / 86400).toFixed(2);
                    const distAu = Math.sqrt(geo.x ** 2 + geo.y ** 2 + geo.z ** 2);
                    const lightTimeMin = (distAu * 499.00478 / 60).toFixed(2);

                    liveHtml = `
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); padding: 5px; border-radius: 4px;">
                            <strong style="color: #aaf;">LIVE DATA</strong><br>
                            <strong>True Anomaly:</strong> ${trueAnomaly}°<br>
                            <strong>Heliocentric Velocity:</strong> ${vKmS} km/s<br>
                            <strong>Distance to Earth:</strong> ${distAu.toFixed(3)} AU<br>
                            <strong>Light Time:</strong> ${lightTimeMin} min<br>
                        </div>
                    `;
                } catch (e) {
                    console.warn("Error calculating live data for " + data.name, e);
                }
            }

            return `
                <div style="min-width: 200px;">
                    <strong style="font-size: 1.1em;">${data.name}</strong><br>
                    <strong>Type:</strong> ${data.type === 'dwarf' ? 'Dwarf Planet' : 'Planet'}<br>
                    ${detailsHtml}
                    ${liveHtml}
                </div>
            `;
        } else if (closestObject.type === 'moon') {
            return `
                <strong>Name:</strong> ${data.name}<br>
                <strong>Type:</strong> Moon<br>
                <strong>Orbital Period:</strong> ${data.period.toFixed(1)} days<br>
            `;
        } else if (closestObject.type === 'star') {
            const distance = data.distance ? (data.distance * 3.26156).toFixed(1) : "N/A";
            const luminosity = data.radius ? data.radius.toFixed(1) : "N/A";
            const name = data.name || `HD ${data.id}`;
            const type = data.spectralType || "Unknown";
            return `
                <strong>Name:</strong> ${name}<br>
                <strong>Distance:</strong> ${distance} LY<br>
                <strong>Type:</strong> ${type}<br>
                <strong>Luminosity:</strong> ${luminosity}<br>
                <strong>Catalog ID:</strong> ${data.id}<br>
            `;
        }
    } catch (error) {
        console.error("Error formatting tooltip:", error);
        return "Error loading data";
    }

    return '';
}
