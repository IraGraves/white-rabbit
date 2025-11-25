import * as THREE from 'three';

const ZODIAC_IDS = ['Ari', 'Tau', 'Gem', 'Cnc', 'Leo', 'Vir', 'Lib', 'Sco', 'Sgr', 'Cap', 'Aqr', 'Psc'];

function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');

    // Draw a radial gradient with a larger solid core for better visibility of small stars
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 1)'); // 40% solid core
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

export async function createStarfield(scene) {
    try {
        const [starsResponse, namesResponse] = await Promise.all([
            fetch(`${import.meta.env.BASE_URL}assets/stars_3d.json`),
            fetch(`${import.meta.env.BASE_URL}assets/stars_names.json`)
        ]);

        const starsData = await starsResponse.json();
        const namesData = await namesResponse.json();

        // Create name map
        const nameMap = {};
        namesData.forEach(item => {
            nameMap[item.i] = item.n;
        });

        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        const processedData = [];

        starsData.forEach(star => {
            // Skip stars with missing coordinate data
            if (star.x == null || star.y == null || star.z == null || star.p == null) {
                return;
            }

            const SCALE = 10000;
            const x = star.x * SCALE;
            const y = star.y * SCALE;
            const z = star.z * SCALE;

            positions.push(x, y, z);

            // Color from K (r,g,b 0-1)
            // Normalize color brightness to ensure stars respond to Gamma/Exposure
            // We rely on size (N) for magnitude, so color should be fully bright (tint only)
            if (star.K) {
                const maxVal = Math.max(star.K.r, star.K.g, star.K.b, 0.001);
                // Boost to max brightness while preserving hue
                colors.push(star.K.r / maxVal, star.K.g / maxVal, star.K.b / maxVal);
            } else {
                colors.push(1, 1, 1); // Default to white
            }

            // Size calculation based on Apparent Brightness (Flux)
            // N is Luminosity, p is Distance. Flux ~ N / p^2.
            // We use log-scale to map flux to pixel size.
            // Range: Faint stars (log ~ -7) -> 2px. Bright stars (log ~ 1.3) -> 15px.

            const dist = Math.max(star.p || 1.0, 0.1);
            const luminosity = star.N || 0;
            const flux = luminosity / (dist * dist);

            // Log of flux. Add 10 to shift range to positive for easier scaling?
            // log(0.001) = -6.9. log(1.0) = 0. log(3.7) = 1.3.
            // Let's use a base offset.
            const logFlux = Math.log(Math.max(flux, 1e-9));

            // Formula: Base 1.5px + (logFlux - minLog) * scale
            // Adjusted to avoid "marble" look.
            // Faint stars (log ~ -8) -> ~1.5px
            // Bright stars (log ~ 1.3) -> ~6-7px (Rigel Kentaurus)
            // Very bright stars (Sirius) -> ~8px
            const size = Math.max(1.5, 1.5 + (logFlux + 8.0) * 0.6);
            sizes.push(size);

            // Process Name
            let commonName = star.n; // Default to HD name
            const names = nameMap[star.i];
            if (names && Array.isArray(names)) {
                const nameObj = names.find(n => n.startsWith("NAME "));
                if (nameObj) {
                    commonName = nameObj.replace("NAME ", "");
                }
            }

            processedData.push({
                id: star.i,
                name: commonName,
                distance: star.p, // Parsecs (will be converted to LY in tooltip)
                radius: star.N, // Using N as proxy for size/luminosity for now
                colorIndex: "N/A",
                mag: "N/A"
            });
        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('starSize', new THREE.Float32BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            vertexColors: true,
            size: 1.0, // Base multiplier (controlled by GUI)
            sizeAttenuation: false, // Disable perspective shrinking
            map: createStarTexture(),
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        // Patch the shader to use the per-vertex 'starSize' attribute
        material.onBeforeCompile = (shader) => {
            shader.vertexShader = `
                attribute float starSize;
                ${shader.vertexShader}
            `;
            shader.vertexShader = shader.vertexShader.replace(
                'gl_PointSize = size;',
                'gl_PointSize = starSize * size;'
            );
        };

        const stars = new THREE.Points(geometry, material);
        stars.userData = { starData: processedData };
        scene.add(stars);
        return { stars, rawData: starsData };
    } catch (error) {
        console.error("Error loading stars:", error);
        return null;
    }
}

export async function createConstellations(zodiacGroup, starsData) {
    try {
        // Load zodiac line data
        const zodiacLinesResponse = await fetch(`${import.meta.env.BASE_URL}assets/zodiac_lines.json`);
        const zodiacLines = await zodiacLinesResponse.json();

        // Create a map of HR number (i field) to star position
        const SCALE = 10000;
        const starPositionMap = {};
        starsData.forEach(star => {
            if (star.x != null && star.y != null && star.z != null && star.i != null) {
                starPositionMap[star.i] = new THREE.Vector3(
                    star.x * SCALE,
                    star.y * SCALE,
                    star.z * SCALE
                );
            }
        });

        const material = new THREE.LineBasicMaterial({
            color: 0x446688,
            transparent: true,
            opacity: 0.6
        });

        // Draw constellation lines by connecting actual stars
        for (const [constellationId, hrNumbers] of Object.entries(zodiacLines)) {
            const points = [];

            for (let i = 0; i < hrNumbers.length; i++) {
                const hrNumber = hrNumbers[i];
                const position = starPositionMap[hrNumber];

                if (position) {
                    points.push(position);
                } else {
                    console.warn(`Star HR ${hrNumber} not found in catalog for constellation ${constellationId}`);
                }
            }

            if (points.length >= 2) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                zodiacGroup.add(line);
            }
        }

        console.log(`Created ${Object.keys(zodiacLines).length} zodiac constellations from catalog stars`);
    } catch (error) {
        console.error("Error loading constellations:", error);
    }
}
