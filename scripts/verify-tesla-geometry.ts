// Standalone script to verify Keplerian calculations for Tesla Roadster

// Copy-pasted math from src/physics/orbits.ts to ensure identical logic
function solveKepler(M, e) {
  let E = M; // Initial guess
  for (let i = 0; i < 10; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-6) break;
  }
  return E;
}

function calculateKeplerianPosition(elements, date) {
  const dayMs = 86400000;
  let epochTime = new Date('2000-01-01T12:00:00Z').getTime(); // Default J2000

  if (elements.epoch) {
    // 2458164.5 -> Feb 15 2018 00:00
    // (JD - 2440587.5) * 86400000
    epochTime = (elements.epoch - 2440587.5) * 86400000;
  }

  const d = (date.getTime() - epochTime) / dayMs; // Days since Epoch

  // Mean motion (degrees per day)
  const EARTH_MEAN_MOTION = 0.9856076686;
  const n = EARTH_MEAN_MOTION / elements.a ** 1.5;

  // Current Mean Anomaly
  let M = elements.M + n * d;
  M = M % 360;
  if (M < 0) M += 360;

  // Convert to radians
  const rad = Math.PI / 180;
  const a = elements.a;
  const e = elements.e;
  const i = elements.i * rad;
  const Omega = elements.Omega * rad;
  const w = elements.w * rad;
  const M_rad = M * rad;

  // Solve Kepler's Equation for Eccentric Anomaly E
  const E = solveKepler(M_rad, e);

  // True Anomaly v implicitly handled by E in cartesian conversion
  // Orbit plane coordinates
  const x_orb = a * (Math.cos(E) - e);
  const y_orb = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // Rotate to heliocentric coordinates
  const cos_Omega = Math.cos(Omega);
  const sin_Omega = Math.sin(Omega);
  const cos_w = Math.cos(w);
  const sin_w = Math.sin(w);
  const cos_i = Math.cos(i);
  const sin_i = Math.sin(i);

  const x_ecl =
    x_orb * (cos_Omega * cos_w - sin_Omega * sin_w * cos_i) -
    y_orb * (cos_Omega * sin_w + sin_Omega * cos_w * cos_i);
  const y_ecl =
    x_orb * (sin_Omega * cos_w + cos_Omega * sin_w * cos_i) +
    y_orb * (cos_Omega * cos_w * cos_i - sin_Omega * sin_w);
  const z_ecl = x_orb * (sin_w * sin_i) + y_orb * (cos_w * sin_i);

  // Transform Ecliptic -> Equatorial
  const epsilon = 23.4392911 * (Math.PI / 180);
  const cos_eps = Math.cos(epsilon);
  const sin_eps = Math.sin(epsilon);

  const y_eq = y_ecl * cos_eps - z_ecl * sin_eps;
  const z_eq = y_ecl * sin_eps + z_ecl * cos_eps;

  return { x: x_ecl, y: y_eq, z: z_eq, r: Math.sqrt(x_orb * x_orb + y_orb * y_orb) };
}

// Data from src/data/bodies.ts
const teslaData = {
  a: 1.3249,
  e: 0.25855,
  i: 1.088,
  Omega: 317.35,
  w: 177.32,
  M: 355.0,
  epoch: 2458164.5,
};

console.log('--- Verifying Tesla Orbit Geometry ---');
console.log(`Elements: a=${teslaData.a}, e=${teslaData.e}`);
console.log(`Expected Perihelion: ${teslaData.a * (1 - teslaData.e).toFixed(4)} AU`);
console.log(`Expected Aphelion:   ${teslaData.a * (1 + teslaData.e).toFixed(4)} AU`);

// Simulate full orbit sampling
let minR = Infinity;
let maxR = -Infinity;
const period = 557; // days
const steps = 360;
const startDate = new Date('2018-02-15T00:00:00Z'); // Approx epoch

for (let i = 0; i < steps; i++) {
  const t = new Date(startDate.getTime() + (i / steps) * period * 86400000);
  const pos = calculateKeplerianPosition(teslaData, t);

  if (pos.r < minR) minR = pos.r;
  if (pos.r > maxR) maxR = pos.r;
}

console.log(`\nSimulated Range (over 1 period):`);
console.log(`Calculated Min R: ${minR.toFixed(4)} AU`);
console.log(`Calculated Max R: ${maxR.toFixed(4)} AU`);

const calcEccentricity = (maxR - minR) / (maxR + minR);
console.log(`\nDerived Eccentricity from Min/Max: ${calcEccentricity.toFixed(5)}`);

// Calculate inclination from Max Z relative to Radius
// approximate: sin(i) = z / r at the node, or max(|z|)/r_at_max_z
// Better: find max |z| and corresponding r
let maxZ = 0;
let rAtMaxZ = 0;

for (let i = 0; i < steps; i++) {
  const t = new Date(startDate.getTime() + (i / steps) * period * 86400000);
  const pos = calculateKeplerianPosition(teslaData, t);

  if (Math.abs(pos.z) > maxZ) {
    maxZ = Math.abs(pos.z);
    rAtMaxZ = pos.r;
  }
}

const calculatedInclinationDeg = Math.asin(maxZ / rAtMaxZ) * (180 / Math.PI);
console.log(`\nMax Z: ${maxZ.toFixed(4)} AU`);
console.log(`Calculated Inclination: ${calculatedInclinationDeg.toFixed(4)} degrees`);
console.log(`Expected Inclination:   ${teslaData.i} degrees`);

if (Math.abs(calcEccentricity - teslaData.e) > 0.01) {
  console.error('FAIL: Eccentricity mismatch!');
} else {
  console.log('SUCCESS: Eccentricity matches.');
}

if (Math.abs(calculatedInclinationDeg - teslaData.i) > 0.5) {
  console.error('FAIL: Inclination mismatch! Orbit is tilted.');
} else {
  console.log('SUCCESS: Inclination matches expected value.');
}
