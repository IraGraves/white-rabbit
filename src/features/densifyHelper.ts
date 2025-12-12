
/**
 * Densifies mission points by adding approach/departure helpers at flybys.
 * This fixes "sharp corner" artifacts by forcing the spline to curve around planets.
 */
function densifyMissionPoints(
  points: { pos: THREE.Vector3; date: number }[],
  waypoints: any[] // MissionWaypoint[]
): { pos: THREE.Vector3; date: number }[] {
  const densified: { pos: THREE.Vector3; date: number }[] = [];
  const AU_TO_SCENE = 50;
  const FILLET_DIST = 0.5 * AU_TO_SCENE; // 0.5 AU in scene units

  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const wp = waypoints[i];

    // Check if this is a Planetary Flyby (has 'body' and neighbors)
    // We don't fillet Earth (Launch) or Endpoints, only middle flybys.
    if (wp.body && i > 0 && i < points.length - 1) {
      const prev = points[i - 1];
      const next = points[i + 1];

      // 1. Approach Point
      const vecIn = new THREE.Vector3().subVectors(curr.pos, prev.pos);
      const distIn = vecIn.length();
      // Place helper 10% out, or max 0.5 AU
      const offsetIn = Math.min(distIn * 0.1, FILLET_DIST);
      const appPos = curr.pos.clone().sub(vecIn.normalize().multiplyScalar(offsetIn));
      
      // Interpolate Date
      const appAlpha = offsetIn / distIn;
      const appDate = curr.date - (curr.date - prev.date) * appAlpha;

      densified.push({ pos: appPos, date: appDate });

      // 2. The Flyby Point itself
      densified.push(curr);

      // 3. Departure Point
      const vecOut = new THREE.Vector3().subVectors(next.pos, curr.pos);
      const distOut = vecOut.length();
      const offsetOut = Math.min(distOut * 0.1, FILLET_DIST);
      const depPos = curr.pos.clone().add(vecOut.normalize().multiplyScalar(offsetOut));
      
      const depAlpha = offsetOut / distOut;
      const depDate = curr.date + (next.date - curr.date) * depAlpha;

      densified.push({ pos: depPos, date: depDate });

    } else {
      // Pass through normal point
      densified.push(curr);
    }
  }

  return densified;
}
