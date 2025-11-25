import * as THREE from 'three';

const SCREEN_HIT_RADIUS = 10; // Pixels on screen for hit detection

/**
 * Sets up the interactive tooltip system for celestial objects
 * @param {THREE.Camera} camera - The scene camera
 * @param {Array} planets - Array of planet objects
 * @param {THREE.Mesh} sun - The sun mesh
 * @param {THREE.Points} stars - The starfield points
 */
export function setupTooltipSystem(camera, planets, sun, starsRef) {
    const tooltip = document.getElementById('tooltip');

    window.addEventListener('mousemove', (event) => {
        // ... (rest of the function)

        // ...

        // Check all stars
        const stars = starsRef.value;
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
            tooltip.innerHTML = formatTooltip(closestObject);
            tooltip.style.display = 'block';
            document.body.style.cursor = 'pointer';
        } else {
            tooltip.style.display = 'none';
            document.body.style.cursor = 'default';
        }
    });
}

/**
 * Formats the tooltip HTML based on the object type
 * @param {Object} closestObject - Object containing data and type
 * @returns {string} HTML string for the tooltip
 */
function formatTooltip(closestObject) {
    const data = closestObject.data;

    if (closestObject.type === 'sun') {
        return `
            <strong>Name:</strong> Sun<br>
            <strong>Type:</strong> G-type Main Sequence Star<br>
            <strong>Radius:</strong> 696,000 km<br>
        `;
    } else if (closestObject.type === 'planet') {
        const distanceFromSun = closestObject.worldPos ?
            (closestObject.worldPos.length() / 50).toFixed(2) : 'N/A';
        return `
            <strong>Name:</strong> ${data.name}<br>
            <strong>Type:</strong> Planet<br>
            <strong>Orbital Period:</strong> ${data.period.toFixed(1)} days<br>
            <strong>Distance from Sun:</strong> ${distanceFromSun} AU<br>
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
        return `
            <strong>Name:</strong> ${data.name}<br>
            <strong>Distance:</strong> ${distance} LY<br>
            <strong>Luminosity Index:</strong> ${luminosity}<br>
            <strong>Catalog ID:</strong> ${data.id}<br>
        `;
    }

    return '';
}
